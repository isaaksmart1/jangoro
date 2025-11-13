import React, { useEffect, useState } from "react";
import { Button, Card, List, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import socialApi from "./socialApi";
import SchedulerPage from "./scheduler";
import { Text } from "@/components";

type Props = {
  platform: "instagram" | "facebook" | "linkedin" | "tiktok";
};

const PlatformPage: React.FC<Props> = ({ platform }) => {
  const [connected, setConnected] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);

  useEffect(() => {
    async function check() {
      const has = await socialApi.checkConnection(platform);
      setConnected(has);
      if (has) {
        await loadPosts();
      }
    }
    check();
  }, [platform]);

  const loadPosts = async () => {
    try {
      const res = await socialApi.fetchPosts(platform);
      setPosts(res || []);
    } catch (err) {
      message.error("Failed to load posts");
    }
  };

  const handleConnect = () => {
    socialApi.oauthRedirect(platform);
  };

  const handleCreate = async () => {
    if (!text && !media) {
      message.warn("Add text or media");
      return;
    }
    try {
      await socialApi.createPost(platform, { text, media });
      message.success("Posted");
      setText("");
      setMedia(null);
      await loadPosts();
    } catch (err) {
      message.error("Failed to post");
    }
  };

  return (
    <div className="page-container" style={{ padding: 24 }}>
      <Card
        title={`${platform[0].toUpperCase() + platform.slice(1)} Integration`}
        style={{ minHeight: 400 }}
      >
        {!connected ? (
          <Button type="primary" onClick={handleConnect}>
            Connect {platform}
          </Button>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <Input.TextArea
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your post..."
              />
              <Upload
                beforeUpload={(file) => {
                  setMedia(file);
                  return false;
                }}
                showUploadList={true}
              >
                <Button style={{ marginTop: 12 }} icon={<UploadOutlined />}>
                  Upload media
                </Button>
              </Upload>
              <div style={{ marginTop: 12 }}>
                <Button type="primary" onClick={handleCreate}>
                  Post now
                </Button>
              </div>
              <br />
              <SchedulerPage platform={platform} />
            </div>
            <br />

            <Text
              style={{
                fontSize: 18,
                fontWeight: 600,
                border: "1px solid #CCCCCC",
                borderRadius: 6,
                padding: 6,
              }}
            >
              My Posts
            </Text>

            <List
              itemLayout="vertical"
              dataSource={posts}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.caption || item.message || item.text}
                    description={item.createdAt}
                  />
                  {item.media && (
                    <img src={item.media} alt="" style={{ maxWidth: 400 }} />
                  )}
                </List.Item>
              )}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default PlatformPage;
