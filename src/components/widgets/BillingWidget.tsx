import React, { useEffect } from "react";
import { Card, Typography, Button, Row, Col, message } from "antd";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";

import { API_URL, authProvider } from "@/providers";

const { Title, Text } = Typography;

interface PricingOption {
  id: string;
  credits: number;
  price: number;
  priceId: string;
}

// Load Stripe outside of a component’s render to avoid recreating the Stripe object on every render.
const stripePromise = loadStripe(
  "pk_live_51QsQzNL7QJgb8vM73DD1rfi7SQOZZulzMgwfpRnNU0aZon4bjr5RvjOOHcUtoYpoVNWfUhZayZLkFIk5zMI6zNcY00TwNoC2zc",
); // Replace with your actual publishable key

const BillingWidget: React.FC = () => {
  const [pricingOptions, setPricingOptions] = React.useState<PricingOption[]>(
    [],
  );
  const [usageStats, setUsageStats] = React.useState(null);

  useEffect(() => {
    // Fetch pricing options from backend if needed
    fetch(`${API_URL}/pricing-options`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data)) {
          setPricingOptions(data);
        }
      })
      .then((res) => fetchUsageStats())
      .catch((err) => {
        console.error("Failed to fetch pricing options:", err);
      });
  }, []);

  const fetchUsageStats = async () => {
    const user = await authProvider.getIdentity();
    try {
      if (!user?.id) {
        console.error("User ID is not available for fetching usage stats.");
        return;
      }
      const response = await fetch(`${API_URL}/ai-queries/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch usage stats");
      }
      const data = await response.json();
      setUsageStats(data);
      return data;
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  };

  const handleTopUp = async (
    credits: number,
    price: number,
    productId: string,
  ) => {
    console.log(
      `User selected ${credits} credits for $${price} (Product ID: ${productId})`,
    );

    try {
      const user = await authProvider?.getIdentity();
      if (!user) {
        message.error("You must be logged in to purchase AI credits.");
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        message.error("Stripe is not initialized.");
        return;
      }

      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(user as any).token}`, // Assuming token is available on user object
        },
        body: JSON.stringify({
          productId,
          quantity: 1, // Always 1 for these packages
          userId: (user as any).id,
          successUrl: window.location.origin + "/billing?payment=success", // Redirect after success
          cancelUrl: window.location.origin + "/billing?payment=cancel", // Redirect after cancel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to create checkout session.",
        );
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        message.error(
          result.error.message || "Failed to redirect to Stripe Checkout.",
        );
      }
    } catch (error: any) {
      console.error("Error during top-up process:", error);
      message.error(
        error.message || "An unexpected error occurred during top-up.",
      );
    }
  };

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {!usageStats ||
        (usageStats == 0 && (
          <Card
            title={
              <Title level={4} style={{ marginBottom: 0, color: "#1f2937" }}>
                <Bot className="h-6 w-6 inline-block mr-2" />
                Top-up AI Queries
              </Title>
            }
            style={{
              background: "#f9fafb",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              marginBottom: 32,
            }}
          >
            <Text
              type="secondary"
              style={{ marginBottom: 16, display: "block" }}
            >
              Instantly add more AI query credits to your account.
            </Text>
            <Row gutter={[16, 16]}>
              {pricingOptions.map((option) => (
                <Col xs={24} sm={8} key={option.credits}>
                  <Card
                    hoverable
                    style={{
                      textAlign: "center",
                      borderRadius: 8,
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    <Title level={3} style={{ color: "#4f46e5" }}>
                      {option.credits}
                    </Title>
                    <Text strong>Queries</Text>
                    <Title level={4} style={{ margin: "16px 0 8px" }}>
                      ${option.price.toFixed(2)}
                    </Title>
                    <Button
                      type="primary"
                      size="large"
                      onClick={() =>
                        handleTopUp(option.credits, option.price, option.id)
                      }
                      block
                    >
                      Buy Now
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        ))}
    </motion.div>
  );
};

export default BillingWidget;
