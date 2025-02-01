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

  useEffect(() => {
    const response = generateAIResponseText(
      {
        refine: "",
        summ: "",
        sentim: "",
      },
      refinement,
      summary,
      sentiment,
      selected,
    );
    setAIResponse(response);
  }, [refinement, summary, sentiment]);

  const createFormData = () => {
    if (selectedFiles.length === 0) return null;

    const formData = new FormData();
    const formFiles = files.filter((file: any) =>
      selectedFiles.includes(file.name),
    );

    formFiles.forEach(({ name, file }: any) => {
      formData.append(name, file);
    });

    return formData;
  };

  const handleSentiment = async () => {
    setIsLoading(true);
    const data = await createFormData();

    try {
      // Send files to Flask server using fetch
      const response = await httpProvider.custom(
        `${AI_URL}/analyze-sentiment`,
        {
          method: "post",
          headers: {},
          body: data,
        },
      );
      const result = await response.json();

      console.log(result);

      const k = Object.keys(result.sentiments[0])[0];
      setSelected(k);
      setSentiment(result.sentiments);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  const handleSummary = async () => {
    setIsLoading(true);
    const data = await createFormData();

    try {
      // Send files to Flask server using fetch
      const response = await httpProvider.custom(`${AI_URL}/analyze-summary`, {
        method: "post",
        headers: {},
        body: data,
      });
      const result = await response.json();

      const k = Object.keys(result.summary[0])[0];
      setSelected(k);
      setSummary(result.summary);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  const handleRefinement = async () => {
    setIsLoading(true);
    const data = await createFormData();

    try {
      // Send files to Flask server using fetch
      const response = await httpProvider.custom(
        `${AI_URL}/analyze-refinement`,
        {
          method: "post",
          headers: {},
          body: data,
        },
      );
      const result = await response.json();

      const k = Object.keys(result.refinement[0])[0];
      setSelected(k);
      setRefinement(result.refinement);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

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
      </div>
    </Card>
  );
};
