import { Badge, Card, List, Skeleton as AntdSkeleton } from "antd";

import { Text } from "@/components";

import { useState } from "react";
import { PollOutlined } from "@mui/icons-material";
import { File } from "lucide-react";

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
      id="file-explorer"
      style={{
        height: "100%",
        overflow: "scroll",
        padding: "1rem",
        overflowX: "hidden",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
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
          <div
            style={{ width: 64, height: 40, backgroundColor: "#BE2E2E" }}
            className="rounded-xl flex items-center justify-center p-2"
          >
            <File className="w-6 h-6 text-white" />
          </div>
          <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
            Surveys and Reviews{" "}
            <span
              className="text-sm"
              style={{ fontWeight: 400, color: "#aaaaaa" }}
            >
              .csv {"(Comma-Separated Values)"} format
            </span>
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
                      <Text size="md" style={{ color: "#000000" }}>
                        {item.name}
                      </Text>
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
      color: "#CCCCCC",
    }}
  >
    No files uploaded yet.
  </span>
);
