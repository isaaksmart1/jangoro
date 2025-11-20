import { useEffect, useState } from "react";

import { Form, Input, List, Select } from "antd";
import axios from "axios";

import { Text } from "@/components";
import { AI_URL } from "@/providers";

export function Feedback({
  sessionId,
  onSelect,
  setFiles,
}: {
  sessionId: string;
  onSelect: any;
  setFiles: any;
}) {
  const [feedback, setFeedback] = useState([]);

  const loadFeedback = async () => {
    const res = await axios.get(`${AI_URL}/email-feedback`, {
      headers: { "X-Session": sessionId },
    });
    const emails = res.data.map((email: any) => ({
      ...email,
      name: email.subject.split("=?")[0],
    }));
    setFeedback(res.data);
    setFiles(emails);
  };

  useEffect(() => {
    if (sessionId) loadFeedback();
  }, [sessionId]);

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={feedback || []}
        renderItem={(item: any, _: number) => {
          return (
            <List.Item>
              <List.Item.Meta
                title={
                  <div
                    key={_}
                    className="flex items-center space-x-2 mb-2 last:mb-0"
                  >
                    <input
                      type="checkbox"
                      id={`file-${_}`}
                      value={item.id}
                      className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                      onClick={(_event: any) => onSelect(item)}
                    />
                    <div>
                      <Text
                        size="md"
                        style={{
                          color: "#000000",
                          marginLeft: 8,
                          fontWeight: "bold",
                        }}
                      >
                        {item.subject.split("=?")[0]}
                      </Text>
                      <br />
                      <Text
                        size="md"
                        style={{ color: "#000000", marginLeft: 8 }}
                      >
                        From: {item.from}
                      </Text>
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
}

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  provider,
  setProvider,
}: any) {
  return (
    <Form style={{ padding: 5, flex: 1 }}>
      <h2 className="text-md">Connect Your Support Inbox</h2>
      <br />

      <Form.Item>
        <label htmlFor="provider">Email Provider</label>
        <Select
          className="py-4 my-4 text-lg"
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
        >
          <option value="gmail">Gmail</option>
          <option value="outlook">Outlook</option>
          <option value="yahoo">Yahoo</option>
          <option value="imap">Custom IMAP</option>
        </Select>
      </Form.Item>

      <Form.Item>
        <label htmlFor="email">Email Address</label>
        <Input
          className="py-4 my-4 text-lg"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Item>

      <Form.Item>
        <label htmlFor="password">Password (or App Password)</label>
        <Input
          className="py-4 my-4 text-lg"
          placeholder="Password / App Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
}
