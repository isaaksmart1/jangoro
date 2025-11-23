import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { BarChartOutlined } from "@ant-design/icons";

import { Button, Card, Space, Tooltip } from "antd";

import { Text } from "@/components";
import { AI_URL, API_URL, authProvider, httpProvider } from "@/providers";
import { generateAIResponseText } from "@/utilities/helper";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<any>>;
};

type Props = {
  files: any;
  setIsLoading: any;
  selected: any;
  selectedFiles: any;
  setSelected: Dispatch<SetStateAction<any>>;
  setAIResponse: Dispatch<SetStateAction<object>>;
  onSelectTab: any;
};

export const UploadFilesButton = ({ setFiles }: FileInputProps) => {
  const onFileInputChange = () => {
    const fileInput = document.getElementById("fileInput");
    fileInput?.click();
  };

  const handleFileUpload = async (event: any) => {
    const selectedFiles = Array.from(event.target.files);
    const csvFiles = selectedFiles.map((file: any) => {
      return {
        name: file.name,
        file: file,
        type: file.type,
      };
    });

    setFiles(csvFiles);
  };

  return (
    <div>
      <button
        style={{ margin: 4, color: "#FFFFFF" }}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-500 text-white p-4 rounded-lg"
        onClick={onFileInputChange}
      >
        Upload
      </button>
      <input
        id="fileInput"
        type="file"
        multiple
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
    </div>
  );
};

export const AnalyzerActionButtons = ({
  setIsLoading,
  files,
  selected,
  selectedFiles,
  setSelected,
  setAIResponse,
  onSelectTab,
}: Props) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [user, setUser] = useState<any>(undefined);
  const [sentiment, setSentiment] = useState([]);
  const [summary, setSummary] = useState([]);
  const [refinement, setRefinement] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);
  const [processingCount, setProcessingCount] = useState(0);
  const location = useLocation();

  const hasFiles = selectedFiles.length > 0;

  useEffect(() => {
    const getUser = async () => {
      try {
        if (location.pathname.includes("free")) {
          localStorage.removeItem("user");
        } else {
          const user = (await authProvider.getIdentity()) as any;
          if (Object.prototype.hasOwnProperty.call(user, "id")) {
            const response = await httpProvider.custom(
              `${API_URL}/user/id/${user.id}`,
              {},
            );
            const dbUser = await response.json();
            if (Object.prototype.hasOwnProperty.call(dbUser, "id")) setUser(dbUser);
            else setUser(undefined);
          }
        }
      } catch {
        console.log("Unable to fetch user");
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (processingCount === selectedFiles.length - 1) {
      setIsLoading(false);
    } else if (selectedFiles.length === 0) {
      setIsLoading(false);
    }
  }, [processingCount, selectedFiles]);

  useEffect(() => {
    const response = generateAIResponseText(
      {
        refine: "",
        summ: "",
        sentim: "",
        action: "",
        general: "",
      },
      refinement,
      summary,
      sentiment,
      actionPlan,
      [],
      selected,
    );
    setAIResponse(response);
  }, [refinement, summary, sentiment, actionPlan, selected]);

  const createFormData = (file: any) => {
    const uploadType = localStorage.getItem("uploadType");
    const formData = new FormData();
    formData.append("email", user?.email || "");
    formData.append("id", user?.id || "");
    formData.append(file.name, file.file);
    if (uploadType) {
      formData.append("source", uploadType);
      if (uploadType === "email") {
        formData.append("emailBody", file.body);
        formData.append("emailSubject", file.subject);
      }
    }
    return formData;
  };

  const checkUsageStats = async () => {
    if (!user) return { usage: 0 };

    try {
      const response = await fetch(`${API_URL}/ai-queries/${user.id}`);
      const text = await response.text();

      if (!response.ok) {
        console.error("Usage API error:", response.status, text);
        return { usage: 0 };
      }

      if (!text) return { usage: 0 };

      const usageStats = JSON.parse(text);
      if (!usageStats || usageStats.usage === 0) {
        alert(
          "You have no usage left this month for AI queries. See billing for details.",
        );
        return {
          error:
            "You have no usage left this month for AI queries. See billing for details.",
        };
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      throw new Error("Usage API returned invalid JSON");
    }
  };

  const handleRequest = async (url: any, setState: any, tab: any) => {
    setIsLoading(true);
    setProcessingCount(-1);

    const formFiles = files.filter((file: any) =>
      selectedFiles.includes(file.name),
    );

    try {
      // Fetch usage stats for the user and check if they have usage left
      const response = await checkUsageStats();

      if (response && response.error) return;

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
            const key = Object.keys(result)[0];
            if (
              !key ||
              !result[key] ||
              !Array.isArray(result[key]) ||
              result[key].length === 0
            ) {
              console.error("Unexpected data structure", result);
              return;
            }

            const selectedFile = Object.keys(result[key][0])[0];
            if (!selectedFile) {
              console.error("Invalid file structure", result[key][0]);
              return;
            }

            setSelected(selectedFile);

            const text: any = {};
            text[selectedFile] = result[key][0][selectedFile];

            setState((prevState: any) =>
              Array.isArray(prevState) ? [...prevState, text] : [text],
            );
            setProcessingCount(index);
          }
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      onSelectTab(tab)
    }
  };

  const handleSentiment = () =>
    handleRequest(`${AI_URL}/analyze-sentiment`, setSentiment, "tab1");
  const handleSummary = () =>
    handleRequest(`${AI_URL}/analyze-summary`, setSummary, "tab2");
  const handleRefinement = () =>
    handleRequest(`${AI_URL}/analyze-refinement`, setRefinement, "tab3");
  const handleActionPlan = () =>
    handleRequest(`${AI_URL}/analyze-action-plan`, setActionPlan, "tab4");

  const buttonActions = [
    {
      version: "paid",
      label: "Build Action Plan",
      action: handleActionPlan,
      caption: "Develop an actionable plan from your analysis.",
    },
    {
      version: "free",
      label: "Summarise",
      action: handleSummary,
      caption: "Generate a short summary of your uploaded files.",
    },
    // {
    //   version: "paid",
    //   label: "Build Survey",
    //   action: handleRefinement,
    //   caption: "Create a refined survey based on data insights.",
    // },
    {
      version: "paid",
      label: "Sentiment Score",
      action: handleSentiment,
      caption: "Analyze the sentiment and produce ratings of your data.",
    },
  ];

  return (
    <Card
      id="ai-actions"
      style={{
        height: "100%",
        padding: "1rem",
        position: "relative",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      title={
        <Space align="center">
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "#6F2EBE",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChartOutlined style={{ color: "#FFFFFF", fontSize: 20 }} />
          </div>
          <Text size="lg" style={{ marginLeft: ".7rem", color: "#000000" }}>
            AI Actions
          </Text>
        </Space>
      }
    >
      <Space wrap>
        {buttonActions
          .filter((btn) => user || btn.version === "free")
          .map((btn, index) => (
            <Tooltip
              key={index}
              title={hoveredButton === btn.caption ? btn.caption : ""}
            >
              <Button
                type="primary"
                size="large"
                disabled={!hasFiles}
                style={{
                  backgroundColor: hasFiles ? "#3b82f6" : "#e5e5e5",
                  border: "none",
                }}
                onClick={btn.action}
                onMouseEnter={() => setHoveredButton(btn.caption)}
                onMouseLeave={() => setHoveredButton(null)}
              >
                {btn.label}
              </Button>
            </Tooltip>
          ))}
      </Space>
    </Card>
  );
};
