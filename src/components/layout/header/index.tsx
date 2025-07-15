import React from "react";

import { Layout, Space, theme } from "antd";

import { CurrentUser } from "../current-user";
import logo from "../../../assets/img/logo-2.png";

const { useToken } = theme;

export const Header = () => {
  const { token } = useToken();

  const headerStyles: React.CSSProperties = {
    backgroundColor: "#111827",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    borderBottom: "1px solid #374151",
  };

  return (
    <Layout.Header style={headerStyles}>
      <Space align="center" size="middle">
        <CurrentUser />
        <img src={logo} width={24} height={40} />
      </Space>
    </Layout.Header>
  );
};
