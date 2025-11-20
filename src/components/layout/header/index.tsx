import React from "react";
import { QuestionCircleFilled } from "@ant-design/icons";

import { Layout, Space, Typography } from "antd";

import { CurrentUser } from "../current-user";


const { Title } = Typography;

export const Header = ({ title, isTourOpen, setIsTourOpen }) => {


  const headerStyles: React.CSSProperties = {
    backgroundColor: "#FFFFFF",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    zIndex: 999,
    top: 0,
  };

  return (
    <Layout.Header style={headerStyles}>
      {/* Title on the left */}
      <Title level={3} style={{ margin: 0, color: "#000000" }}>
        {title}
      </Title>

      {/* Right-side content */}
      <Space align="center" size="middle">
        <CurrentUser />
        <button
          onClick={() => setIsTourOpen(!isTourOpen)}
          style={{ height: 48 }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 rounded-lg flex items-center"
        >
          <QuestionCircleFilled style={{ color: "#FFFFFF" }} className="mr-2" />
          <span className="text-white">Take a Tour</span>
        </button>
      </Space>
    </Layout.Header>
  );
};
