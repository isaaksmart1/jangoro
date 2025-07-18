import React from "react";
import { Card, Typography, Space } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";
import { NumberOfResponses } from "./responses";

const { Text } = Typography;

export const ResponsesChart = ({ files, fileCounts, setFileCounts }: any) => {
  return (
    <Card
      style={{
        height: "100%",
        padding: "1rem",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <Space align="center">
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#6F2EBE",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ArrowUpOutlined style={{ color: "#FFFFFF", fontSize: 20 }} />
          </div>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#000000",
              marginLeft: 8,
            }}
          >
            Number of Responses
          </Text>
        </Space>
      }
    >
      <NumberOfResponses
        files={files}
        fileCounts={fileCounts}
        setFileCounts={setFileCounts}
      />
    </Card>
  );
};
