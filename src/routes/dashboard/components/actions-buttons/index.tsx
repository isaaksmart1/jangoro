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
        onClick={onFileInputChange} // Optional: trigger file input programmatically
      >
        Upload
      </button>
      <input
        id="fileInput"
        type="file"
        multiple
        accept=".csv"
        style={{
          display: "none",
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
        }}
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
  const [sentiment, setSentiment] = useState([]);
  const [summary, setSummary] = useState([]);
  const [refinement, setRefinement] = useState([]);
  const [actionPlan, setActionPlan] = useState([]);
  const [processingCount, setProcessingCount] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  useEffect(() => {
    if (processingCount === selectedFiles.length - 1) {
      setResetCount(0);
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
      },
      refinement,
      summary,
      sentiment,
      actionPlan,
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
    const formFiles = files.filter((file: any) =>
      selectedFiles.includes(file.name),
    );

    let count = resetCount;

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
            count = index;
            setProcessingCount(count);
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

  return (
    <Card
      style={{
        height: "100%",
        padding: "0 1rem",
      }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <SmartButtonOutlined />
          <Text size="lg" style={{ marginLeft: ".7rem" }}>
            AI Actions
          </Text>
        </div>
      }
    >
      <div className="flex flex-row">
        <UploadFilesButton setFiles={setFiles} />
        <button
          style={{ margin: 4 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          onClick={handleSentiment}
        >
          Sentiment Score
        </button>
        <button
          style={{ margin: 4 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          onClick={handleSummary}
        >
          Summarize
        </button>
        <button
          style={{ margin: 4 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          onClick={handleRefinement}
        >
          Build Survey
        </button>
        <button
          style={{ margin: 4 }}
          className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
          onClick={handleActionPlan}
        >
          Formulate Action Plan
        </button>
      </div>
    </Card>
  );
};
