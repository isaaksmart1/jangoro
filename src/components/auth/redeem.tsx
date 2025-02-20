import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { useNavigation } from "@refinedev/core";
import { API_URL } from "@/providers";
import { updateProvider } from "@/providers/auth";
import { ErrorAlert } from "../alert";
const { Title, Text } = Typography;

export const RedeemCode = () => {
  const { push } = useNavigation();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redeemCode, setRedeemCode] = useState("");
  const [error, setError] = useState({ title: "", message: "" });
  const [alert, setAlert] = useState(false);
  const [alertType, setAlertType] = useState("error");

  useEffect(() => {
    if (alert) {
      setTimeout(() => {
        setAlert(false);
      }, 3000);
    }
    if (alertType === "success") {
      setTimeout(() => {
        push("/login");
      }, 5000);
    }
  }, [alert]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    const { email, password, redeem } = values;
    try {
      const data = await updateProvider.redeemRegistration({ email, password });

      if (data.hasOwnProperty("error")) {
        throw new Error(
          "You have either created an account or used the same redeem code more than once",
        );
      }

      const response = await fetch(`${API_URL}/user/redeem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: redeem,
          email,
          userId: data.user.user.id,
          stripeCustomerId: data.stripeCustomerId,
        }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      localStorage.setItem("plan", result.plan);

      const success = {
        title: "Registration successful",
        message: result.message,
      };
      setError(success);
      setAlert(true);
      setAlertType("success");
    } catch (error: any) {
      const errors = {
        title: "Registration error",
        message: error.message || "Something went wrong.",
      };
      setError(errors);
      setAlert(true);
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <Title level={3} style={{ color: "#722ed1" }}>
        Sign Up with your Redeem Code
      </Title>
      <Form
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 20, textAlign: "left" }}
      >
        <Text>Email</Text>
        <Form.Item name="email" rules={[{ required: true }]}>
          <Input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Text>Password</Text>
        <Form.Item name="password" rules={[{ required: true }]}>
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Text>Redeem Code</Text>
        <Form.Item
          name="redeem"
          rules={[{ required: true, message: "Please enter redeem code" }]}
        >
          <Input
            placeholder="JANGO-XYZ-123-XXX"
            value={redeemCode}
            onChange={(e) => setRedeemCode(e.target.value)}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      {alert && (
        <ErrorAlert
          type={alertType}
          message={error.title}
          description={error.message}
        />
      )}
    </Card>
  );
};
