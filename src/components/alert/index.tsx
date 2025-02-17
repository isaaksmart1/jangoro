import React from "react";
import { Alert } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

export const ErrorAlert: React.FC<{ message: string; description?: string }> = ({
  message,
  description,
}) => {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      showIcon
      icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
      style={{
        backgroundColor: "#fff2f0",
        border: "1px solid #ffccc7",
        color: "#cf1322",
        borderRadius: "8px",
        padding: "12px",
      }}
    />
  );
};

