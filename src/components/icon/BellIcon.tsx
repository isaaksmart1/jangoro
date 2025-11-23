import React from "react";
import { BellOutlined } from "@ant-design/icons";

import { IconProps } from "./types"; // Assuming a types.ts exists for icon props

export const BellIcon: React.FC<IconProps> = ({
  fontSize = "16px",
  color = "#8A8A8A",
  ...rest
}) => {
  const { rotate, ...safeRest } = rest;
  return <BellOutlined style={{ fontSize, color }} rotate={typeof rotate === "string" ? parseInt(rotate, 10) : rotate} {...safeRest} />;
};
