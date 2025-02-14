import React, { useEffect, useState } from "react";
import { Card, Table, Button, Spin, message, Col } from "antd";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { API_URL } from "@/providers";
import { DollarOutlined } from "@ant-design/icons";

const stripePromise = loadStripe(
  "pk_test_51MPpHXARPqfde7N5ZVZicL8SRNwvzvoyFe7vCgCID73swbWAn0JtbjuscgsC0mQmbZrdW7w340LOLAVV0TadxV6e00LNsJGPyl",
);

const BillingForm = () => {
  const [billingData, setBillingData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      window.location.href = url; // Redirect to Stripe Billing Portal
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
    <Card>
      <Col
        xs={24}
        sm={24}
        xl={4}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          margin: 24,
        }}
      >
        <DollarOutlined
          style={{ color: "#6f2ebe", fontSize: 32, marginRight: 12 }}
        />
        <h1 className="text-gray-700 text-3xl mb-0">Billing</h1>
      </Col>
      <Button
        type="primary"
        onClick={openStripeBillingPortal}
        style={{ marginBottom: 24 }}
      >
        Manage Subscription & Payment
      </Button>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table dataSource={billingData} columns={columns} rowKey="id" />
      )}
    </Card>
  );
};

const BillingPage = () => (
  <Elements stripe={stripePromise}>
    <BillingForm />
  </Elements>
);

export default BillingPage;
