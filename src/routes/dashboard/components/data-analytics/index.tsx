import React from "react";

import { Card } from "antd";

import { Text } from "@/components";
import { NumberOfResponses } from "./responses";
import { TrendingUpOutlined } from "@mui/icons-material";

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
          <TrendingUpOutlined htmlColor="#6f2ebe" />
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
