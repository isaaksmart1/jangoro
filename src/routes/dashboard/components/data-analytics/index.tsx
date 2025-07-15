import React from "react";

import { Card } from "antd";

import { Text } from "@/components";
import { NumberOfResponses } from "./responses";
import { TrendingUpOutlined } from "@mui/icons-material";

export const ResponsesChart = ({ files }: any) => {
  return (
    <Card
      style={{
        height: "100%",
        padding: "24px 24px 0px 24px",
        backgroundColor: "#111827",
        border: "1px solid #374151",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{ width: 40, height: 40, backgroundColor: "#2e82be" }}
            className="rounded-xl flex items-center justify-center"
          >
            <TrendingUpOutlined
              className="w-6 h-6 text-white"
              htmlColor="#FFFFFF"
            />
          </div>
          <Text size="lg" style={{ color: "#FFFFFF", marginLeft: ".5rem" }}>
            Number of Responses
          </Text>
        </div>
      }
    >
      <NumberOfResponses files={files} />
    </Card>
  );
};
