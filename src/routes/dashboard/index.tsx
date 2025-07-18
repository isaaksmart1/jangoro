import { motion } from "framer-motion";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { QueryStatsRounded } from "@mui/icons-material";

import {
  AIAnalytics,
  AnalyzerActionButtons,
  DashboardLatestActivities,
  FileList,
  ResponsesChart,
} from "./components";
import TakeTourOverlay from "@/components/layout/tour";
import MetricPanel from "./components/metric-panel";
import { SurveyOverview } from "@/components/metrics/survey-metrics";

export const DashboardPage = ({ isTourOpen, setIsTourOpen }: any) => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiResponse, setAIResponse] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);
  const [averageScore, setAverageScore] = useState(null);

  return (
    <React.Fragment>
      <div className="page-container" id="dashboard-summary">
        <Row gutter={[32, 32]}>
          {/* File List - Slide in from Left */}
          <Col
            xs={20}
            sm={20}
            xl={8}
            style={{ height: "480px" }}
            className="dashboard-panel"
          >
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              style={{ height: "inherit" }}
            >
              <FileList
                setFiles={setFiles}
                files={files}
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
              />
            </motion.div>
          </Col>

          <Col xs={20} sm={20} xl={5}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ height: "inherit" }}
            >
              <SurveyOverview averageScore={averageScore} />
            </motion.div>
          </Col>

          {/* Generate Metrics */}
          <Col xs={20} sm={20} xl={5}>
            <MetricPanel type="list" files={files} selected={selected} />
          </Col>

          <Col xs={20} sm={20} xl={5}>
            <MetricPanel
              type="score"
              files={files}
              selected={selected}
              setAverageScore={setAverageScore}
            />
          </Col>
        </Row>

        <Row gutter={[32, 32]}>
          {/* Analyzer Action Buttons - Slide in from Right */}
          <Col xs={20} sm={20} xl={8} className="dashboard-panel">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ height: "inherit" }}
            >
              <AnalyzerActionButtons
                setIsLoading={setIsAILoading}
                setFiles={setFiles}
                files={files}
                selected={selected}
                selectedFiles={selectedFiles}
                setSelected={setSelected}
                setAIResponse={setAIResponse}
              />
            </motion.div>
          </Col>
          {/* AI Analytics - Slide in from Right */}
          <Col
            xs={20}
            sm={20}
            xl={15}
            style={{ height: 480 }}
            className="dashboard-panel"
          >
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              style={{ height: "inherit" }}
            >
              <AIAnalytics
                aiResponse={aiResponse}
                isLoading={isAILoading}
                setIsLoading={setIsAILoading}
                selected={selected}
                setSelected={setSelected}
                selectedFiles={selectedFiles}
                files={files}
              />
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[32, 32]} style={{ marginTop: "16px" }}>
          {/* Responses Chart - Slide in from Bottom */}
          <Col xs={20} lg={20} xl={20} className="dashboard-panel">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ height: "inherit" }}
            >
              <ResponsesChart files={files} />
            </motion.div>
          </Col>
        </Row>
      </div>
      <TakeTourOverlay isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen} />
    </React.Fragment>
  );
};
