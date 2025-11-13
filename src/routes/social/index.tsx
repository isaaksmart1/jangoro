import React from "react";
import { Card, Button, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import PlatformPage from "./platformTemplate";
import SchedulerPage from "./scheduler";
import SocialCalendarPage from "./calendar";

const { Title, Paragraph } = Typography;

export const SocialIndexPage = () => {
  return (
    <div className="page-container">
      <Card title="Social Media" style={{ minHeight: 400 }}>
        <Title level={4}>Connect accounts & manage content</Title>
        <Paragraph>
          Connect your Instagram, Facebook, LinkedIn and TikTok accounts to
          schedule and post content.
        </Paragraph>
        <Space>
          <Link to="/social/instagram">
            <Button>Instagram</Button>
          </Link>
          <Link to="/social/facebook">
            <Button>Facebook</Button>
          </Link>
          <Link to="/social/linkedin">
            <Button>LinkedIn</Button>
          </Link>
          <Link to="/social/tiktok">
            <Button>TikTok</Button>
          </Link>
          <Link to="/social/scheduler">
            <Button>Scheduler</Button>
          </Link>
          <Link to="/social/calendar">
            <Button>Calendar</Button>
          </Link>
        </Space>
      </Card>
    </div>
  );
};

export { PlatformPage };
export { SchedulerPage };
export { SocialCalendarPage };

export default SocialIndexPage;
