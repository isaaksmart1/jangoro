import React, { useState } from "react";
import { Layout, Menu, Typography, Space, Button } from "antd";
import {
  DashboardOutlined,
  DollarOutlined,
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LinkedinOutlined,
  VideoCameraOutlined,
  CalendarOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { authProvider } from "@/providers";

import logo from "../../../assets/img/logo-2.png";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UpgradeBanner } from "../upgrade-banner";

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
      width={256}
      collapsible
      collapsed={windowWidth < 720 || collapsed}
      trigger={null}
      style={{
        backgroundColor: "#6C16DC",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
        theme="dark"
        mode="inline"
        className="sidebar-menu"
        style={{
          padding: 12,
          borderTop: "1px solid #666666",
          overflow: "auto",
          height: "calc(100% - 72px)",
        }}
        defaultSelectedKeys={["/dashboard"]}
      >
        <Menu.Item
          key="/dashboard"
          style={{ fontSize: 16 }}
          icon={<DashboardOutlined />}
        >
          <Link to="/">Dashboard</Link>
        </Menu.Item>

        <Menu.Item
          key="/billing"
          style={{ fontSize: 16 }}
          icon={<DollarOutlined />}
        >
          <Link to="/billing">Billing</Link>
        </Menu.Item>

        <hr color="#666666" style={{ borderColor: "#666666" }} />

        {/* Social Section */}
        <Menu.SubMenu
          key="social"
          title="Social"
          icon={<ScheduleOutlined />}
          style={{ fontSize: 16 }}
        >
          <Menu.Item
            key="/social/instagram"
            icon={<InstagramOutlined />}
            style={{ backgroundColor: "#E4405F" }}
          >
            <Link to="/social/instagram">Instagram</Link>
          </Menu.Item>
          <Menu.Item
            key="/social/facebook"
            icon={<FacebookOutlined />}
            style={{ backgroundColor: "#1877F2" }}
          >
            <Link to="/social/facebook">Facebook</Link>
          </Menu.Item>
          <Menu.Item
            key="/social/linkedin"
            icon={<LinkedinOutlined />}
            style={{ backgroundColor: "#0A66C2" }}
          >
            <Link to="/social/linkedin">LinkedIn</Link>
          </Menu.Item>
          <Menu.Item
            key="/social/tiktok"
            icon={<VideoCameraOutlined />}
            style={{ backgroundColor: "#000000" }}
          >
            <Link to="/social/tiktok">TikTok</Link>
          </Menu.Item>
          {/* <Menu.Item
            key="/social/scheduler"
            icon={<ScheduleOutlined />}
            style={{ backgroundColor: "#6C16DC" }}
          >
            <Link to="/social/scheduler">Scheduler</Link>
          </Menu.Item> */}
          <Menu.Item
            key="/social/calendar"
            icon={<CalendarOutlined />}
            style={{ backgroundColor: "#0E7351FF" }}
          >
            <Link to="/social/calendar">Calendar</Link>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.Item
          key="/logout"
          style={{ fontSize: 16 }}
          onClick={logout}
          icon={<LogoutOutlined />}
        >
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
                  style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "bold" }}
                />
              ) : (
                <ArrowLeft
                  style={{ fontSize: 20, color: "#FFFFFF", fontWeight: "bold" }}
                />
              )
            }
          />
        </div>
        {!collapsed && <UpgradeBanner />}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
