import Subscription from "@models/Subscription";
import User, { IUser } from "@models/User";
import { Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

interface RequestWithUser extends Request {
  user?: IUser;
}
export const webhook = async (req: Request, res: Response) => {
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"] as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session?.metadata?.userId;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await Subscription.create({
        userId,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        current_period_start: new Date(
          subscription.current_period_start * 1000
        ),
        current_period_end: new Date(subscription.current_period_end * 1000),
        planId: subscription.items.data[0].price.id,
      });

      await User.findByIdAndUpdate(userId, {
        stripeCustomerId: session.customer,
      });
    }
    else if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      await Subscription.findOneAndUpdate({ userId }, { status:subscription.status });
    }
    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send("Webhook error");
  }
};

export const checkout = async (req: RequestWithUser, res: Response) => {
  const { priceId } = req.body;
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const user = (await User.findById(req.user._id)) as IUser;
    if (!user) {
      res.status(404).json({ success: "false", error: "User not found" });
      return;
    }
    // Create Stripe Customer if not exists
    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    const userId = user?.id.toString();
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      // success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId: userId },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSubscriptionStatus = async (
  req: RequestWithUser,
  res: Response
) => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: "false", error: "User not found" });
      return;
    }
    // Fetch the subscription from your database
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      res.status(404).json({ error: "Subscription not found" });
      return;
    }

    // Fetch subscription status from Stripe API (if needed)
    const stripeSubscription = await stripe.subscriptions.retrieve(
      subscription.stripeSubscriptionId
    );

    res.status(200).json({
      subscriptionStatus: stripeSubscription.status,
      current_period_start: stripeSubscription.current_period_start,
      current_period_end: stripeSubscription.current_period_end,
    });
    return;
  } catch (error) {
    console.error("Error fetching subscription status:", error);
    res.status(500).json({ error: "Failed to fetch subscription status" });
  }
};
