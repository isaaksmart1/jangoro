import { Text } from "@/components";
import { Badge, List, Skeleton as AntdSkeleton } from "antd";
import React from "react";

export const NoFiles = ({files}: any) => (
  <List
    itemLayout="horizontal"
    dataSource={files.map((_: any, index: number) => ({
      id: index,
    }))}
    renderItem={() => {
      return (
        <List.Item>
          <List.Item.Meta
            avatar={<Badge color="transparent" />}
            title={
              <AntdSkeleton.Button
                active
                style={{
                  height: "14px",
                }}
              />
            }
            description={
              <AntdSkeleton.Button
                active
                style={{
                  width: "300px",
                  marginTop: "8px",
                  height: "16px",
                }}
              />
            }
          />
        </List.Item>
      );
    }}
  />
);

const CSV = ({ files, onFileSelectChange }: any) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={files || []}
      renderItem={(item: any, _: number) => {
        return (
          <List.Item>
            <List.Item.Meta
              //   avatar={<Badge color={item.color} />}
              title={
                <div
                  key={_}
                  className="flex items-center space-x-2 mb-2 last:mb-0"
                >
                  <input
                    type="checkbox"
                    id={`file-${_}`}
                    value={item.name}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                    onClick={(event: any) =>
                      onFileSelectChange(event.target.value)
                    }
                  />
                  <Text size="md" style={{ color: "#000000", marginLeft: 8 }}>
                    {item.name}
                  </Text>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default CSV;
