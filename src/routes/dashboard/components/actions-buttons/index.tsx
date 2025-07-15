import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Text } from "@/components";
import { AI_URL, API_URL, authProvider, httpProvider } from "@/providers";
import { generateAIResponseText } from "@/utilities/helper";
import { BarChart3 } from "lucide-react";
import { Card } from "antd";

type FileInputProps = {
  setFiles: Dispatch<SetStateAction<any>>;
};

type Props = {
  files: any;
  setIsLoading: any;
  setFiles: Dispatch<SetStateAction<any>>;
  selected: any;
  selectedFiles: any;
  setSelected: Dispatch<SetStateAction<any>>;
  setAIResponse: Dispatch<SetStateAction<object>>;
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
        style={{ margin: 4 }}
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
  setFiles,
  selected,
  selectedFiles,
  setSelected,
  setAIResponse,
}: Props) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [user, setUser] = useState<any>(undefined);
  const [sentiment, setSentiment] = useState([]);
  const [summary, setSummary] = useState([]);
  const [refinement, setRefinement] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);
  const [processingCount, setProcessingCount] = useState(-1);
  const location = useLocation();

  const hasFiles = selectedFiles.length > 0;

  useEffect(() => {
    const getUser = async () => {
      try {
        if (location.pathname.includes("free")) {
          localStorage.removeItem("user");
        } else {
          const user = (await authProvider.getIdentity()) as any;
          if (user.hasOwnProperty("id")) {
            const response = await httpProvider.custom(
              `${API_URL}/user/id/${user.id}`,
              {},
            );
            const dbUser = await response.json();
            if (dbUser.hasOwnProperty("id")) setUser(dbUser);
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
    const formData = new FormData();
    formData.append(file.name, file.file);
    return formData;
  };

  const handleRequest = async (url: any, setState: any) => {
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

            let text: any = {};
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
    }
  };

  const handleSentiment = () =>
    handleRequest(`${AI_URL}/analyze-sentiment`, setSentiment);
  const handleSummary = () =>
    handleRequest(`${AI_URL}/analyze-summary`, setSummary);
  const handleRefinement = () =>
    handleRequest(`${AI_URL}/analyze-refinement`, setRefinement);
  const handleActionPlan = () =>
    handleRequest(`${AI_URL}/analyze-action-plan`, setActionPlan);

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
    {
      version: "paid",
      label: "Build Survey",
      action: handleRefinement,
      caption: "Create a refined survey based on data insights.",
    },
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
        padding: "0 1rem",
        position: "relative",
        backgroundColor: "#111827",
        border: "1px solid #374151",
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{ width: 40, height: 40, backgroundColor: "#6f2ebe" }}
            className="rounded-xl flex items-center justify-center"
          >
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <Text size="lg" style={{ marginLeft: ".7rem", color: "#FFFFFF" }}>
            AI Actions
          </Text>
        </div>
      }
    >
      <div className="flex flex-row items-center">
        <UploadFilesButton setFiles={setFiles} />
        {buttonActions
          .filter((btn) => user || btn.version === "free")
          .map((btn, index) => (
            <button
              disabled={!hasFiles}
              key={index}
              style={{
                margin: 4,
                backgroundColor: hasFiles ? "#3b82f6" : "#e5e5e5",
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-lg"
              onClick={btn.action}
              onMouseEnter={() => setHoveredButton(btn.caption)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {btn.label}
            </button>
          ))}
        {hoveredButton && (
          <div
            className="absolute text-sm text-black font-semibold p-1 rounded shadow-md"
            style={{
              bottom: 0,
              right: "-5rem",
              whiteSpace: "nowrap",
              transform: "translateX(-50%)",
              backgroundColor: "beige",
            }}
          >
            {hoveredButton}
          </div>
        )}
      </div>
    </Card>
  );
};
