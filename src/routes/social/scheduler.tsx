import React, { useState } from "react";
import { Card, Form, Input, DatePicker, TimePicker, Select, Button, message } from "antd";
import socialApi from "./socialApi";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const SchedulerPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const scheduledAt = dayjs(values.date).hour(values.time.hour()).minute(values.time.minute()).toISOString();
      await socialApi.schedulePost({
        platform: values.platform,
        text: values.text,
        scheduledAt,
        media: null, // Extend to handle media upload
      });
      message.success("Post scheduled");
    } catch (err) {
      message.error("Failed to schedule post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Card title="Schedule Social Post" style={{ minHeight: 400 }}>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="platform" label="Platform" rules={[{ required: true }]}>
            <Select placeholder="Select platform">
              <Option value="instagram">Instagram</Option>
              <Option value="facebook">Facebook</Option>
              <Option value="linkedin">LinkedIn</Option>
              <Option value="tiktok">TikTok</Option>
            </Select>
          </Form.Item>
          <Form.Item name="text" label="Post text" rules={[{ required: true }]}>
            <TextArea rows={4} />
          </Form.Item>
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