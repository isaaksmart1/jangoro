import React, { useState } from "react";

import {
  Button,
  Card,
  DatePicker,
  Form,
  message,
  TimePicker,
} from "antd";
import dayjs from "dayjs";

import socialApi from "./socialApi";

const SchedulerPage: React.FC<Props> = ({ platform }) => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const scheduledAt = dayjs(values.date)
        .hour(values.time.hour())
        .minute(values.time.minute())
        .toISOString();
      await socialApi.schedulePost({
        platform,
        text: values.text,
        scheduledAt,
        media: null, // Extend to handle media upload
      });
      message.success("Post scheduled");
    } catch (_) {
      void _; // Workaround for unused _ in catch block
      message.error("Failed to schedule post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card title="Schedule Social Post" style={{ minHeight: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="date" label="Date" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="time" label="Time" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Schedule Post
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SchedulerPage;
