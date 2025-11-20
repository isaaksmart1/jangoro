import React, { useEffect, useState } from "react";

import { Card, List, Spin } from "antd";

import socialApi from "./socialApi";
import SocialCalendar from "./socialCalendar";

const SocialCalendarPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const scheduled = await socialApi.fetchScheduledPosts();
        setEvents(scheduled || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="page-container">
      <Card title="Social Content Calendar" style={{ minHeight: 500 }}>
        {loading ? (
          <Spin />
        ) : (
          <>
            <SocialCalendar events={events} />
            <List
              header={<div>Upcoming scheduled posts</div>}
              dataSource={events}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  {item.platform} — {item.text} — {new Date(item.scheduledAt).toLocaleString()}
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default SocialCalendarPage;