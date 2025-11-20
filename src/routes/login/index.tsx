import React, { useEffect } from "react";
import { useSearchParams } from "react-router";

import { AuthPage } from "@refinedev/antd";

import { Image } from "antd";

import logo from "@/assets/img/logo.png";
import { Text } from "@/components";
import { URL_ROUTES } from "@/config/config";
import { API_URL, authCredentials } from "@/providers";
import { updateProvider } from "@/providers/auth";

export const LoginPage = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const urlPath = searchParams.get("session_id");
    getStripeSession(urlPath);
  }, []);

  const www = () => {
    window.location.href = URL_ROUTES.www;
  };

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
      console.error(error);
      return 500;
    }
  };

  const doesStripeCustomerExists = async (id: string) => {
    const customerId = id;
    let status: any = undefined;
    if (!customerId || customerId === "null" || customerId === "undefined") {
      status = await deleteUser();
    } else status = "Customer exists";
    return status;
  };

  const completeCheckout = async () => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (email && password) {
      try {
        await updateProvider.onCheckoutSuccess({ email, password });
      } catch (error) {
        console.error(error);
      }
    }
  };

  const getStripeSession = async (urlPath: string | null) => {
    const sessionId = localStorage.getItem("stripe_session_id");

    if (!sessionId) return;

    if (urlPath?.includes("cancelled")) {
      localStorage.setItem("stripe_subscription_interval", "");
    }

    const subscriptionInterval = localStorage.getItem(
      "stripe_subscription_interval",
    );
    const customerId = localStorage.getItem("stripe_customer_id") || "";

    // Lifetime access
    if (subscriptionInterval === "life") {
      const status = doesStripeCustomerExists(customerId);
      if (status === undefined) return;
      completeCheckout();
      return;
    } else if (subscriptionInterval === "paid") return;

    // Subscriptions
    const response = await fetch(`${API_URL}/retrieve-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });
    const data = await response.json();
    console.log("Stripe session details:", data);

    // Store Stripe session details for reference (optional)
    localStorage.setItem("stripe_subscription_id", data.subscriptionId);
    localStorage.setItem("stripe_customer_id", data.customerId);

    const status = await doesStripeCustomerExists(data.customerId);
    if (status.includes("exists")) completeCheckout();
    return;
  };

  return (
    <AuthPage
      type="login"
      title={
        <React.Fragment>
          <Image
            onClick={www}
            preview={false}
            src={logo}
            alt="Jangoro"
            style={{ width: 32, height: 56, marginRight: 6 }}
          />
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "indigo" }}>
            angoro
          </Text>
        </React.Fragment>
      }
      formProps={{
        initialValues: authCredentials,
      }}
      renderContent={(content) => (
        <>
          {content}
          <div style={{ marginTop: 24, textAlign: "center" }}>
            <button
              onClick={() => {
                window.location.href = "/free";
              }}
              style={{
                backgroundColor: "#6F2EBE",
                color: "white",
                border: "none",
                padding: "10px 16px",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Free Version
            </button>
          </div>
        </>
      )}
    />
  );
};
