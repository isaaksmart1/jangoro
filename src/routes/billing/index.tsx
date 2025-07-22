import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Table,
  Button,
  Spin,
  message,
  Col,
  Row,
  Typography,
  Tag,
} from "antd";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { DollarOutlined } from "@ant-design/icons";
import { API_URL, authProvider } from "@/providers";
import { CardContent, CardHeader } from "@mui/material";
import { Badge, Bot } from "lucide-react";

const { Title, Text } = Typography;

const stripePromise = loadStripe(
  "pk_live_51QsQzNL7QJgb8vM73DD1rfi7SQOZZulzMgwfpRnNU0aZon4bjr5RvjOOHcUtoYpoVNWfUhZayZLkFIk5zMI6zNcY00TwNoC2zc",
);

const BillingForm = () => {
  const [billingData, setBillingData] = useState([]);
  const [usageStats, setUsageStats] = useState({ usage: 0 });
  const [loading, setLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      let plan;
      const user = await authProvider.getIdentity();
      if (user) {
        setUser(user);
        switch (user.subscription) {
          case "month":
            plan = "Monthly Access";
            break;
          case "year":
            plan = "Yearly Access";
            break;
          case "life":
            plan = "Lifetime Access";
            break;
          default:
            plan = "Free Access";
            break;
        }
        setSubscriptionPlan(plan);
      }
    };

    loadCustomer();
    fetchBillingHistory();
  }, []);

  useEffect(() => {
    fetchUsageStats();
  }, [user]);

  const fetchUsageStats = async () => {
    try {
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

  const fetchBillingHistory = async () => {
    setLoading(true);
    try {
      const customerId = localStorage.getItem("stripe_customer_id");
      const response = await fetch(
        `${API_URL}/get-transactions?customerId=${customerId}`,
      );
      const data = await response.json();
      setBillingData(data.transactions);
    } catch (error) {
      console.error("Error fetching billing history:", error);
    }
    setLoading(false);
  };

  const openStripeBillingPortal = async () => {
    try {
      const customerId = localStorage.getItem("stripe_customer_id");
      if (!customerId) {
        message.error("No Stripe customer ID found");
        return;
      }

      const response = await fetch(`${API_URL}/create-billing-portal-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create billing portal session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Error opening Stripe billing portal:", error);
      message.error("Failed to open Stripe billing portal");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created",
      key: "created",
      render: (timestamp: number) =>
        new Date(timestamp * 1000).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `$${(amount / 100).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "succeeded" ? "green" : "red"}>{status}</Tag>
      ),
    },
  ];

  return (
    <Row gutter={[32, 32]}>
      <Col span={24}>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={4} style={{ color: "#444" }}>
            Manage subscriptions and view transaction history
          </Title>
        </motion.div>
      </Col>

      <Col span={24}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            style={{
              background: "#f9fafb",
              borderRadius: 16,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
            }}
          >
            <CardHeader>
              <Title level={4} style={{ marginBottom: 8, color: "#1f2937" }}>
                Usage Statistics
              </Title>
              <Text type="secondary" style={{ fontSize: 14 }}>
                Monitor your monthly usage limits.
              </Text>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* AI Queries Card */}
                <div className="w-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <Bot className="h-12 w-12 text-indigo-600 mr-2" />
                      <span className="font-semibold text-gray-800 text-base">
                        AI Queries
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-sm"
                    >
                      {usageStats.usage} / 1000
                    </Badge>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ease-in-out ${
                        usageStats.usage / 1000 < 0.8
                          ? "bg-red-500"
                          : "bg-indigo-500"
                      }`}
                      style={{
                        width: `${Math.min((usageStats.usage / 1000) * 100, 100)}%`,
                      }}
                    />
                  </div>

                  {/* Remaining or Upsell Message */}
                  <div className="mt-2 text-xs text-gray-600">
                    {subscriptionPlan === "Free Access" ? (
                      <span className="text-red-500 font-medium">
                        Upgrade your plan to unlock AI queries
                      </span>
                    ) : (
                      `${usageStats.usage} queries remaining this month`
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Col>

      <Col span={24}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card
            title={
              <span>
                <DollarOutlined style={{ marginRight: 8 }} />
                Billing History
              </span>
            }
            style={{
              backgroundColor: "#fff",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            {subscriptionPlan && (
              <Tag
                color="blue"
                style={{
                  fontSize: 14,
                  padding: "4px 12px",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                {subscriptionPlan}
              </Tag>
            )}

            {subscriptionPlan !== "Lifetime Access" && (
              <Button
                type="primary"
                onClick={openStripeBillingPortal}
                style={{ marginBottom: 24 }}
              >
                Manage Subscription & Payment
              </Button>
            )}

            {loading ? (
              <Spin size="large" />
            ) : (
              <Table
                dataSource={billingData}
                columns={columns}
                rowKey="id"
                pagination={{ pageSize: 5 }}
              />
            )}
          </Card>
        </motion.div>
      </Col>
    </Row>
  );
};

const BillingPage = () => (
  <Elements stripe={stripePromise}>
    <BillingForm />
  </Elements>
);

export default BillingPage;
