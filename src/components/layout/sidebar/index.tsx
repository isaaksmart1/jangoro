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

const { Sider } = Layout;
const { Title, Text } = Typography;

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const logout = async () => {
    const result = await authProvider.logout();
    if (result.success) window.location.href = "/login";
  };

  return (
    <Sider
      width={200}
      collapsible
      collapsed={collapsed}
      trigger={null}
      style={{
        backgroundColor: "#111827",
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
        {!collapsed && (
          <Link to="/" style={{ textDecoration: "none" }}>
            <Space size="small" align="center" style={{ fontSize: 12 }}>
              <Title level={5} style={{ margin: 0, fontWeight: 700 }}>
                <Text style={{ color: "#CCCCCC", fontWeight: 400 }}>
                  Optimized for Desktop
                </Text>
              </Title>
            </Space>
          </Link>
        )}
      </div>

      <Menu
        theme="dark"
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
                <RightOutlined
                  style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "bold" }}
                />
              ) : (
                <LeftOutlined
                  style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "bold" }}
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
