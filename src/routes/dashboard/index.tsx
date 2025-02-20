import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";
import { useEffect, useState } from "react";
import { QueryStatsRounded } from "@mui/icons-material";

import {
  AIAnalytics,
  AnalyzerActionButtons,
  DashboardLatestActivities,
  FileList,
  ResponsesChart,
} from "./components";

export const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiResponse, setAIResponse] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);

  return (
    <div className="page-container">
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} xl={4}>
          <QueryStatsRounded
            sx={{ fontSize: 32, marginRight: 1 }}
            htmlColor="#6f2ebe"
          />
          <h1 className="text-gray-700 text-3xl mb-6">Analyzer</h1>
        </Col>
        <Col xs={24} sm={24} xl={12}>
          <AnalyzerActionButtons
            setIsLoading={setIsAILoading}
            setFiles={setFiles}
            files={files}
            selected={selected}
            selectedFiles={selectedFiles}
            setSelected={setSelected}
            setAIResponse={setAIResponse}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col
          xs={24}
          sm={24}
          xl={8}
          style={{
            height: "460px",
          }}
        >
          <FileList
            setFiles={setFiles}
            files={files}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
          />
        </Col>
        <Col
          xs={24}
          sm={24}
          xl={16}
          style={{
            height: 480,
          }}
        >
          <AIAnalytics
            aiResponse={aiResponse}
            isLoading={isAILoading}
            selected={selected}
            setSelected={setSelected}
            selectedFiles={selectedFiles}
          />
        </Col>
      </Row>

      <Row
        gutter={[32, 32]}
        style={{
          marginTop: "32px",
        }}
      >
        <Col xs={24} lg={18}>
          <ResponsesChart files={files} />
        </Col>
      </Row>
    </div>
  );
};
