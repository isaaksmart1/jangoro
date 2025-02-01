import React from "react";

import { DollarOutlined, RiseOutlined } from "@ant-design/icons";
import { Card } from "antd";

import { Text } from "@/components";
import { NumberOfResponses } from "./responses";

export const ResponsesChart = ({ files }: any) => {
  return (
    <Card
      style={{ height: "100%", padding: "24px 24px 0px 24px" }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <RiseOutlined />
          <Text size="lg" style={{ marginLeft: ".5rem" }}>
            Number of Responses
          </Text>
        </div>
      }
    >
      <NumberOfResponses files={files} />
    </Card>
  );
};
