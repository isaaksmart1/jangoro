import React from "react";
import { Layout, Space, Typography, theme } from "antd";
import { Link } from "react-router-dom";
import { authProvider } from "@/providers";

import { CurrentUser } from "../current-user";

const { useToken } = theme;
const { Title, Text } = Typography;

export const Header = () => {
  const { token } = useToken();

  const headerStyles: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    zIndex: 999,
    top: 0,
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <CurrentUser />
        <Link to="/" style={{ textDecoration: "none" }}>
          <Space size="small" align="center" style={{ fontSize: 12 }}>
            <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
              <Text style={{ color: "#CCCCCC", fontWeight: 400 }}>
                Optimized for Desktop
              </Text>
            </Title>
          </Space>
        </Link>
      </Space>
    </Layout.Header>
  );
};
