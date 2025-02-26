import { CopyToClipboardButton } from "@/components/icon/Copy";
import { AI_URL, httpProvider } from "@/providers";
import { generateAIResponseText } from "@/utilities/helper";
import { SendOutlined } from "@ant-design/icons";
import { Button, Col, Input } from "antd";
import React, { useEffect, useState } from "react";

type Props = {
  isLoading: any;
  setIsLoading: any;
  selected: any;
  setSelected: any;
  selectedFiles: any;
  AIAnalyticsDashHeight: any;
  activeTab: any;
  files: any;
};

export const AIQuery = ({
  isLoading,
  setIsLoading,
  AIAnalyticsDashHeight,
  activeTab,
  selectedFiles,
  selected,
  setSelected,
  files,
}: Props) => {
  const [aiQuery, setAIQuery] = useState("");
  const [aiResponse, setAIResponse] = useState({ general: "", rawAIQuery: "" });
  const [general, setGeneral] = useState([]);
  const [processingCount, setProcessingCount] = useState(-1);

  useEffect(() => {
    if (processingCount === selectedFiles.length - 1) {
      setIsLoading(false);
    }
  }, [processingCount]);

  useEffect(() => {
    const response = generateAIResponseText(
      {
        refine: "",
        summ: "",
        sentim: "",
        action: "",
        general: "",
      },
      [],
      [],
      [],
      [],
      general,
      selected,
    );
    setAIResponse(response);
  }, [general, selected]);

  const createFormData = (file: any) => {
    const formData = new FormData();
    formData.append("query", aiQuery);
    formData.append(file.name, file.file);
    return formData;
  };

  const handleRequest = async (url: any, setState: any) => {
    if (!aiQuery) return;

    if (selectedFiles.length === 0) {
      setState("Query failed! You have not selected file...");
      return;
    }

    setIsLoading(true);
    setProcessingCount(-1);

    const formFiles = files.filter((file: any) =>
      selectedFiles.includes(file.name),
    );

    try {
      formFiles.forEach(async (file: any, index: any) => {
        try {
          const data = createFormData(file);
          const response = await httpProvider.custom(url, {
            method: "post",
            headers: {},
            body: data,
          });
          const result = await response.json();

          if (result && Object.keys(result).length > 0) {
            const key = Object.keys(result)[0]; // Ensure result has keys
            if (
              !key ||
              !result[key] ||
              !Array.isArray(result[key]) ||
              result[key].length === 0
            ) {
              console.error("Unexpected data structure", result);
              return;
            }

            const selectedFile = Object.keys(result[key][0])[0]; // Ensure result[key][0] has keys
            if (!selectedFile) {
              console.error("Invalid file structure", result[key][0]);
              return;
            }

            let text: any = {};
            text[selectedFile] = result[key][0][selectedFile];

            setSelected(selectedFile);

            // BUG
            setState((prevState: any) => {
              if (Array.isArray(prevState)) {
                let index = prevState.findIndex((element: any) =>
                  element.hasOwnProperty(selectedFile),
                );
                if (index > -1) {
                  let file = prevState.find((element: any) =>
                    element.hasOwnProperty(selectedFile),
                  );
                  prevState[file] = text;
                } else {
                  prevState = [...prevState, text];
                }
              } else prevState = [text];
              return prevState;
            });
            setProcessingCount(index);
          }
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAIQuery = () =>
    handleRequest(`${AI_URL}/analyze-query`, setGeneral);

  return (
    <React.Fragment>
      <Col
        id="tab5"
        className="tab-content scrollable hidden"
        style={{ height: AIAnalyticsDashHeight }}
      >
        <Input.Search
          name="query"
          className="rounded-3xl"
          placeholder="Ask something..."
          style={{
            color: "purple",
            marginBottom: 12,
          }}
          value={aiQuery}
          onChange={(event) => setAIQuery(event.target.value)}
          enterButton={
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleAIQuery}
              loading={isLoading}
            >
              Send
            </Button>
          }
        />
        <div
          dangerouslySetInnerHTML={{
            __html: aiResponse.general,
          }}
        ></div>
      </Col>
      {!isLoading && (
        <React.Fragment>
          {activeTab === "tab5" &&
            aiResponse.general &&
            aiResponse.rawAIQuery && (
              <CopyToClipboardButton text={aiResponse.rawAIQuery} />
            )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
