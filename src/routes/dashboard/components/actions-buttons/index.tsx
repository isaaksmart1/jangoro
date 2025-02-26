import { Text } from "@/components";
import { AI_URL, dataProvider, httpProvider } from "@/providers";
import { generateAIResponseText } from "@/utilities/helper";
import { SmartButtonOutlined } from "@mui/icons-material";
import { Card } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

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

  const handleFileUpload = async (event) => {
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
        style={{ margin: 4, backgroundColor: "#6f2ebe" }}
        className="px-4 py-4 text-white rounded-xl hover:bg-blue-600"
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
  const [sentiment, setSentiment] = useState([]);
  const [summary, setSummary] = useState([]);
  const [refinement, setRefinement] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);
  const [processingCount, setProcessingCount] = useState(-1);

  const hasFiles = selectedFiles.length > 0;

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
      label: "Build Action Plan",
      action: handleActionPlan,
      caption: "Develop an actionable plan from your analysis.",
    },
    {
      label: "Summarize",
      action: handleSummary,
      caption: "Generate a short summary of your uploaded files.",
    },
    {
      label: "Build Survey",
      action: handleRefinement,
      caption: "Create a refined survey based on data insights.",
    },
    {
      label: "Sentiment Score",
      action: handleSentiment,
      caption: "Analyze the sentiment and produce ratings of your data.",
    },
  ];

  return (
    <Card
      style={{ height: "100%", padding: "0 1rem", position: "relative" }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SmartButtonOutlined htmlColor="#6f2ebe" />
          <Text size="lg" style={{ marginLeft: ".7rem" }}>
            AI Actions
          </Text>
        </div>
      }
    >
      <div className="flex flex-row items-center">
        <UploadFilesButton setFiles={setFiles} />
        {buttonActions.map((btn, index) => (
          <button
            disabled={!hasFiles}
            key={index}
            style={{
              margin: 4,
              backgroundColor: hasFiles ? "#3b82f6" : "#e5e5e5",
            }}
            className="p-4 text-white rounded-xl hover:bg-blue-600 relative"
            onClick={btn.action}
            onMouseEnter={() => setHoveredButton(btn.caption)}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {btn.label}
          </button>
        ))}
        {/* Tooltip for hovered button */}
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
