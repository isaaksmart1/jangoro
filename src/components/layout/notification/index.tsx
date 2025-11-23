import { useState } from "react";
import { Badge, Button, Popover } from "antd";

import { BellIcon } from "@/components/icon";
import { DotIcon } from "lucide-react";
import { Text } from "@/components/text";
import { DeleteFilled } from "@ant-design/icons";
import { addRemoveNotification } from "@/utilities/helper";

export const Notifications = ({ messages, setMessages }: any) => {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notificationCount] = useState(messages.length);

  const uniqueMessages = messages.filter(
    (item: any, index: any, self: any) =>
      index === self.findIndex((n: any) => n.text === item.text),
  );

  const handleDelete = (messageId: string) => {
    const updated = uniqueMessages.filter((m: any) => m.id !== messageId);
    setMessages(updated);
    addRemoveNotification(null, "remove");
  };

  const content = (
    <div style={{ width: 280 }}>
      {/* Header */}
      <div
        style={{
          padding: "10px 15px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text className="text-muted font-medium">Notifications</Text>
        <Button
          type="text"
          size="small"
          onClick={() => {
            addRemoveNotification(null, "clear");
            setMessages([]);
          }}
        >
          Clear All
        </Button>
      </div>

      {/* List */}
      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {uniqueMessages.length === 0 ? (
          <div
            style={{
              padding: 20,
              textAlign: "center",
              color: "#999",
              fontSize: 14,
            }}
          >
            No notifications
          </div>
        ) : (
          uniqueMessages.map((message: any) => (
            <div
              key={message.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "10px 15px",
                borderBottom: "1px solid #f7f7f7",
                gap: 10,
              }}
            >
              {/* Dot Icon */}
              <DotIcon color="#6f2ebe" size={40} />

              {/* Notification Text */}
              <div
                onClick={() => (window.location.href = message.page)}
                style={{
                  flex: 1,
                  cursor: "pointer",
                  fontSize: 14,
                  lineHeight: "18px",
                }}
              >
                {message.text}
              </div>

              {/* Delete */}
              <Button
                type="text"
                onClick={() => handleDelete(message.id)}
                style={{ padding: 0 }}
              >
                <DeleteFilled size={16} />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <Popover
      placement="bottomRight"
      content={content}
      trigger="click"
      overlayInnerStyle={{ padding: 0 }}
      overlayStyle={{ zIndex: 999 }}
    >
      <Button
        type="text"
        onClick={() => setNotificationsVisible(!notificationsVisible)}
        style={{ position: "relative" }}
      >
        <Badge count={notificationCount} size="small">
          <BellIcon fontSize="20px" color="#6610f2" />
        </Badge>
      </Button>
    </Popover>
  );
};
