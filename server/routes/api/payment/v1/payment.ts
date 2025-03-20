import { checkout, getSubscriptionStatus, webhook } from "@controllers/payment.controller";
import { verifyJWT } from "@middlewares/auth";
import express from "express";
const router = express.Router();

//api/payment/v1/webhook/stripe
// router.post("/webhook/stripe", express.raw({ type: "application/json" }),webhook);
router.post("/create-checkout-session",verifyJWT,checkout);
router.get("/get-subscription-status",verifyJWT,getSubscriptionStatus);

export default router 