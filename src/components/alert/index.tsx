import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";

import { CheckCircleOutline } from "@mui/icons-material";
import { Alert } from "antd";

export const ErrorAlert: React.FC<{
  type: string;
  message: string;
  description?: string;
}> = ({ message, description, type = "error" }) => {
  return (
    <Alert
      message={message}
      description={description}
      type="error"
      showIcon
      icon={
        type === "error" ? (
          <ExclamationCircleOutlined style={{ color: "red" }} />
        ) : (
          <CheckCircleOutline style={{ color: "green" }} />
        )
      }
      style={{
        backgroundColor: type === "error" ? "#fff2f0" : "rgb(199, 255, 209)",
        border:
          type === "error"
            ? "1px solid #ffccc7"
            : "1px solid rgb(199, 255, 209)",
        color: "#cf1322",
        borderRadius: "8px",
        padding: "12px",
      }}
    />
  );
};
