import { Image } from "antd";
import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { API_URL, authCredentials } from "@/providers";
import { useEffect } from "react";

export const LoginPage = () => {
  useEffect(() => {
    getStripeSession();
  }, []);

  const getStripeSession = async () => {
    const sessionId = localStorage.getItem("stripe_session_id");
    const response = await fetch(`${API_URL}/retrieve-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();
    console.log("Stripe session details:", data);

    // Store Stripe session details for reference (optional)
    localStorage.setItem("stripe_customer_id", data.customerId);
    localStorage.setItem("stripe_subscription_id", data.subscriptionId);
  };

  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2
          icon=""
          collapsed={false}
          text="Jangoro"
          wrapperStyles={{ fontSize: 24 }}
        />
      }
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
