import React, { useEffect, useState } from "react";
import { Card, Table, Button, Spin, Select, Input, Form, message } from "antd";
import {
  Elements,
  useStripe,
  ElementsConsumer,
  CardElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API_URL } from "@/providers";

const { Option } = Select;
const stripePromise = loadStripe(
  "pk_test_51MPpHXARPqfde7N5ZVZicL8SRNwvzvoyFe7vCgCID73swbWAn0JtbjuscgsC0mQmbZrdW7w340LOLAVV0TadxV6e00LNsJGPyl",
);

const BillingPage = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("monthly");

  useEffect(() => {
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

  const handleUpdatePayment = async (stripe) => {
    if (!stripe) return;
    try {
      const customerId = localStorage.getItem("stripe_customer_id");
      const payload = {
        customerId,
      };
      const response = await fetch(`${API_URL}/get-setup-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      stripe.redirectToCheckout({ sessionId: data.sessionId });
    } catch (error) {
      console.error("Error updating payment method:", error);
    }
  };

  const handleSubscriptionChange = async (value) => {
    setSubscriptionType(value);
    try {
      await fetch(`${API_URL}/update-subscription`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionType: value }),
      });
      message.success("Subscription updated successfully");
    } catch (error) {
      console.error("Error updating subscription:", error);
      message.error("Failed to update subscription");
    }
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "created",
      key: "created",
      render: (timestamp) => new Date(timestamp * 1000).toLocaleDateString(),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `$${(amount / 100).toFixed(2)}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => `${status}`,
    },
  ];

  return (
    <Elements stripe={stripePromise}>
      <ElementsConsumer>
        {({ stripe }) => (
          <Card title="Billing Dashboard">
            <Form layout="vertical">
              <Form.Item label="Subscription Type">
                <Select
                  value={subscriptionType}
                  onChange={handleSubscriptionChange}
                >
                  <Option value="monthly">$15 /mo</Option>
                  <Option value="annually">$99 /yr</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Card Details">
                <CardElement
                  options={{ style: { base: { fontSize: "16px" } } }}
                />
              </Form.Item>
              <Button
                type="primary"
                onClick={() => handleUpdatePayment(stripe)}
                style={{ marginBottom: 24 }}
              >
                Update Details
              </Button>
            </Form>
            {loading ? (
              <Spin size="large" />
            ) : (
              <Table dataSource={billingData} columns={columns} rowKey="id" />
            )}
          </Card>
        )}
      </ElementsConsumer>
    </Elements>
  );
};

export default BillingPage;
