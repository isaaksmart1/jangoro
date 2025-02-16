import { useEffect } from "react";
import { Image } from "antd";
import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { API_URL, authCredentials, httpProvider } from "@/providers";
import { Text } from "@/components";

export const LoginPage = () => {
  useEffect(() => {
    getStripeSession();
  }, [window.location]);

  const deleteUser = async () => {
    const user = localStorage.getItem("user");
    try {
      const result = await fetch(`${API_URL}/user/deactivate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: user,
      });
      return result;
    } catch (error) {
      return 500;
    }
  };

  const getStripeSession = async () => {
    const sessionId = localStorage.getItem("stripe_session_id");

    if (!sessionId) return;

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

    const customerId = localStorage.getItem("stripe_customer_id");

    if (!customerId || customerId === "null" || customerId === "undefined") {
      const status = await deleteUser();
      return status;
    }
  };

  return (
    <AuthPage
      type="login"
      title={<Text style={{ fontSize: 32, fontWeight: "bold" }}>Jangoro</Text>}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
