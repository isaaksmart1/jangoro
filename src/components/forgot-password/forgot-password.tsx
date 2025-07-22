import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { ErrorAlert } from "../alert";

const { Title, Text } = Typography;

export const ForgotPassword = ({ onResetRequest }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ message: "", description: "" });
  const [alert, setAlert] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Call the password reset API (replace with actual API request)
      // await onResetRequest(values.email);
      window.location.href = `mailto:team@jangoro.com?subject=Password Reset Request - ${values.email}&body=I wish to reset my password, please send me instructions.`;

      setAlert(true);
      setMessage({
        message: "Reset Link Sent",
        description:
          "Check your email for the confirmation. Make sure to check your Spam.",
      });
    } catch (error: any) {
      setAlert(true);
      setMessage({
        message: "Reset Failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setTimeout(() => {
        setAlert(false);
      }, 5000);
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 512, margin: "auto", textAlign: "center" }}>
      <Title level={3}>Forgot Password</Title>
      <Text>Please enter your email to receive a reset link.</Text>
      <Form layout="vertical" onFinish={handleSubmit} style={{ marginTop: 20 }}>
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Enter a valid email address!" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Send Reset Link
          </Button>
        </Form.Item>
      </Form>
      {alert && (
        <ErrorAlert
          type="success"
          message={message.message}
          description={message.description}
        />
      )}
    </Card>
  );
};
