import { Badge, Card, List, Skeleton as AntdSkeleton } from "antd";

import { Text } from "@/components";

import { useState } from "react";
import { DocumentScannerRounded, PollOutlined } from "@mui/icons-material";

type Props = {
  files: any;
  setFiles: any;
  selectedFiles: any;
  setSelectedFiles: any;
};

export const FileList = ({
  files,
  setFiles,
  selectedFiles,
  setSelectedFiles,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const onFileSelectChange = async (file: any) => {
    const idx = selectedFiles.indexOf(file);
    if (idx > -1) {
      const files = [...selectedFiles];
      files.splice(idx, 1);
      setSelectedFiles(files);
    } else {
      const files = [...selectedFiles, file];
      setSelectedFiles(files);
    }
  };

  return (
    <Card
      style={{
        height: "100%",
        overflow: "scroll",
        padding: "0 1rem",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <PollOutlined />
          <Text size="lg" style={{ marginLeft: ".7rem" }}>
            Surveys and Reviews
          </Text>
        </div>
      }
    >
      {isLoading ? (
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
      ) : (
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
                      <Text size="sm">{item.name}</Text>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}

      {!isLoading && files?.length === 0 && <NoFiles />}
    </Card>
  );
};

const NoFiles = () => (
  <span
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "220px",
    }}
  >
    File list empty.
  </span>
);
