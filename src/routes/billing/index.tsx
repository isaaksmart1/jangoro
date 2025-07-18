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

const { Title, Text } = Typography;

const stripePromise = loadStripe(
  "pk_test_51MPpHXARPqfde7N5ZVZicL8SRNwvzvoyFe7vCgCID73swbWAn0JtbjuscgsC0mQmbZrdW7w340LOLAVV0TadxV6e00LNsJGPyl",
);

const BillingForm = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

  useEffect(() => {
    const loadCustomer = async () => {
      let plan;
      const user = await authProvider.getIdentity();
      if (user) {
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
            plan = "Monthly Access";
            break;
        }
        setSubscriptionPlan(plan);
      }
    };

    loadCustomer();
    fetchBillingHistory();
  }, []);

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
