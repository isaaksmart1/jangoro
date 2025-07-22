import { useEffect, useState } from "react";
import { Badge, Card, List, Skeleton as AntdSkeleton } from "antd";
import { Text } from "@/components";
import { PollOutlined } from "@mui/icons-material";
import { UploadFilesButton } from "../actions-buttons";
import { wsClient, wsSession } from "@/utilities/ws";

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

  useEffect(() => {
    wsClient.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "csv-sync") {
        const { filename, contentType, data } = message.payload;

        // Decode base64 string to binary data
        const byteCharacters = atob(data);
        const byteNumbers = Array.from(byteCharacters, (char) =>
          char.charCodeAt(0),
        );
        const byteArray = new Uint8Array(byteNumbers);

        // Create a File object (or Blob)
        const file = new File([byteArray], filename, { type: contentType });
        const csvFiles = [file].map((file: any) => {
          return {
            name: file.name,
            file,
            type: file.type,
          };
        });
        setFiles(csvFiles);
      }
    };
  }, [wsSession]);

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
        padding: "1rem",
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
            Upload Survey Data
          </Text>
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            CSV Format
          </span>
          <UploadFilesButton setFiles={setFiles} />
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
                      <Text
                        size="md"
                        style={{ color: "#000000", marginLeft: 8 }}
                      >
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
