import React from "react";

import { Layout, Space, theme } from "antd";

import { CurrentUser } from "../current-user";
import logo from "../../../assets/img/logo.png";

const { useToken } = theme;

export const Header = () => {
  const { token } = useToken();

  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: "#DDDDDD",
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
