import React from "react";
import { Card, Typography, Row, Col, Space } from "antd";
import { UserOutlined, StarOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const SurveyOverview = ({ averageScore, fileCounts }: any) => {
  const totalResponses = fileCounts.reduce(
    (sum, c) => sum + Number(c.count || 0),
    0,
  );
  return (
    <Card
      id="survey-overview"
      title={
        <Title level={4} style={{ margin: 0 }}>
          Survey Overview
        </Title>
      }
      style={{ borderRadius: 12, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
      bodyStyle={{ padding: 24 }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Card
          style={{ backgroundColor: "#eef2ff", borderRadius: 10 }}
          bodyStyle={{ padding: 16 }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{ color: "#3730a3", fontSize: 14 }}>
                Number of Responses
              </Text>
              <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                {totalResponses ? totalResponses : "0"}
              </Title>
            </Col>
            <Col>
              <div
                style={{
                  backgroundColor: "#e0e7ff",
                  padding: 12,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <UserOutlined style={{ color: "#4f46e5", fontSize: 20 }} />
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          style={{ backgroundColor: "#ecfdf5", borderRadius: 10 }}
          bodyStyle={{ padding: 16 }}
        >
          <Row justify="space-between" align="middle">
            <Col>
              <Text style={{ color: "#065f46", fontSize: 14 }}>Avg. Score</Text>
              <Title level={2} style={{ margin: 0, color: "#1f2937" }}>
                {averageScore > 0 ? averageScore.toFixed(2) : "N/A"}
              </Title>
            </Col>
            <Col>
              <div
                style={{
                  backgroundColor: "#d1fae5",
                  padding: 12,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <StarOutlined style={{ color: "#059669", fontSize: 20 }} />
              </div>
            </Col>
          </Row>
        </Card>
      </Space>
    </Card>
  );
};
