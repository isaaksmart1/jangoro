import React from "react";

import { Badge,Calendar } from "antd";
import dayjs from "dayjs";

type Event = {
  id: string;
  platform: string;
  text: string;
  scheduledAt: string;
  status?: string;
};

const SocialCalendar: React.FC<{ events: Event[] }> = ({ events }) => {
  const getListData = (value: any) => {
    const dateStr = dayjs(value).startOf("day").toISOString();
    return events.filter((e) => dayjs(e.scheduledAt).startOf("day").toISOString() === dateStr);
  };

  const dateCellRender = (value: any) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.id}>
            <Badge status={item.status === "posted" ? "success" : "processing"} text={`${item.platform}: ${item.text}`} />
          </li>
        ))}
      </ul>
    );
  };

  return <Calendar dateCellRender={dateCellRender} />;
};

export default SocialCalendar;