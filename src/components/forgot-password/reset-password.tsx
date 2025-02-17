import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { useNavigation } from "@refinedev/core";
import { useParams, useSearchParams } from "react-router";
import { API_URL } from "@/providers";
const { Title, Text } = Typography;

export const ResetPassword = () => {
  const { token } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { push } = useNavigation();

  const email = searchParams.get("email");

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/user/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: values.password, email }),
      });

      if (!response.ok) throw new Error("Reset failed. Try again.");

      notification.success({
        message: "Password Reset Successful",
        description: "You can now log in with your new password.",
      });

      push("/login");
    } catch (error: any) {
      notification.error({
        message: "Error",
        description: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 400, margin: "auto", textAlign: "center" }}>
      <Title level={3}>Reset Password</Title>
      <Text>Enter a new password below.</Text>
      <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Enter a new password!" }]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value)
                  return Promise.resolve();
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
