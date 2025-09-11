import React, { useState } from "react";
import { Form, Input, Button, Card, Typography, notification } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { updatePassword } from "../../providers/data/user";
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
      // window.location.href = `mailto:team@jangoro.com?subject=Password Reset Request - ${values.email}&body=I wish to reset my password, please send me instructions.`;

      const payload = {
        email: values.email,
        password: values.password,
      };

      const response = await updatePassword(payload);

      setAlert(true);
      setMessage({
        message: "Reset Sent",
        description:
          "Your password has been reset.",
      });
      window.location.href = '/login';
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

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Type your new password" },
            { type: "string", message: "Enter your new password" },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="Enter your new password"
            type="password"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Confirm your new password" },
            { type: "string", message: "Confirm your new password" },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder="Confirm your new password"
            type="password"
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
