import React, { useState } from "react";
import { Layout, Menu, Typography, Space, Button } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "@/providers";

import logo from "../../../assets/img/logo.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const { Sider } = Layout;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const logout = async () => {
    const result = await authProvider.logout();
    if (result.success) window.location.href = "/login";
  };

  const windowWidth = window.innerWidth;

  return (
    <Sider
      width={200}
      collapsible
      collapsed={windowWidth < 720 || collapsed}
      trigger={null}
      style={{
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        style={{
          width: "100%",
          padding: "0 16px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
          alignItems: "center",
          height: 64,
          fontSize: 14,
        }}
      >
        <img src={logo} width={24} height={40} />
      </div>

      <Menu
        theme="light"
        mode="inline"
        style={{
          paddingTop: 8,
          border: "none",
          overflow: "auto",
          height: "calc(100% - 72px)",
        }}
        defaultSelectedKeys={["/dashboard"]}
      >
        <Menu.Item key="/dashboard" icon={<DashboardOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/billing" icon={<DollarOutlined />}>
          <Link to="/billing">Billing</Link>
        </Menu.Item>
        <Menu.Item key="/logout" onClick={logout} icon={<LogoutOutlined />}>
          Logout
        </Menu.Item>

        <div style={{ width: "100%" }}>
          <Button
            type="text"
            onClick={toggleCollapsed}
            style={{
              borderRadius: 0,
              height: 48,
              width: "100%",
              padding: 12,
            }}
            icon={
              collapsed ? (
                <ArrowRight
                  style={{ fontSize: 20, color: "#6F2EBE", fontWeight: "bold" }}
                />
              ) : (
                <ArrowLeft
                  style={{ fontSize: 20, color: "#6F2EBE", fontWeight: "bold" }}
                />
              )
            }
          />
        </div>
      </Menu>
    </Sider>
  );
};

export default Sidebar;
