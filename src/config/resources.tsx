import type { IResourceItem } from "@refinedev/core";

import {
  DashboardOutlined,
  DollarOutlined,
  ProjectOutlined,
  ShopOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

export const resources: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <DashboardOutlined />,
    },
  },
  {
    name: "billing",
    list: "/billing",
    meta: {
      label: "Billing",
      icon: <DollarOutlined />,
    },
  },

  // Social resources
  {
    name: "socialAccounts",
    list: "/social/accounts",
    meta: {
      label: "Social Accounts",
      icon: <ProjectOutlined />,
    },
  },
  {
    name: "socialPosts",
    list: "/social/posts",
    create: "/social/scheduler",
    meta: {
      label: "Social Posts",
      icon: <ShopOutlined />,
    },
  },
  {
    name: "scheduledPosts",
    list: "/social/scheduled",
    meta: {
      label: "Scheduled Posts",
      icon: <CalendarOutlined />,
    },
  },
];