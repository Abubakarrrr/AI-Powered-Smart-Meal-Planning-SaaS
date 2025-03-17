import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";

// Customer portal link
const customerPortalLink = "https://billing.stripe.com/p/login/test_00gdUxbbUajx78A8ww";
const BASE_URL = import.meta.env.VITE_API_URL;

const ButtonCustomerPortal = () => {
  const { user } = useAuthStore();
  const [status, setStatus] = useState();

  const getSubscriptionStatus = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/payment/v1/get-subscription-status`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      setStatus(data.subscriptionStatus);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSubscriptionStatus();
  });

  if (status === "active") {
    return (
      <a
        href={customerPortalLink + "?prefilled_email=" + user?.email}
        className="btn"
      >
        Billing
      </a>
    );
  }
};

export default ButtonCustomerPortal;
