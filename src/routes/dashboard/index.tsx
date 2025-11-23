import React, { useState } from "react";

import { Col, Row } from "antd";
import { motion } from "framer-motion";

import TakeTourOverlay from "@/components/layout/tour";
import { SurveyOverview } from "@/components/metrics/survey-metrics";

import {
  AIAnalytics,
  AnalyzerActionButtons,
  EngagementChart,
  FileList,
  ResponsesChart,
} from "./components";
import MetricPanel from "./components/metric-panel";

export const DashboardPage = ({ isTourOpen, setIsTourOpen }: any) => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiResponse, setAIResponse] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);
  const [averageScore, setAverageScore] = useState(null);
  const [fileCounts, setFileCounts] = useState([]);
  const [activeTab, setActiveTab] = useState("tab4");
  
    const onSelectTab = (tab: string) => {
      const allTabs = document.querySelectorAll(".tab-content");
      const activeTab = document.getElementById(tab);
  
      allTabs.forEach((el) => {
        el.classList.remove("tab-active");
        el.classList.add("hidden");
      });
  
      if (activeTab) {
        activeTab.classList.add("tab-active");
        activeTab.classList.remove("hidden");
      }
  
      setActiveTab(tab);
    };

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

          {/* Generate Metrics */}
          <Col xs={20} sm={20} xl={5}>
            <MetricPanel type="list" files={files} selected={selected} />
          </Col>

          <Col xs={20} sm={20} xl={5}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ height: "inherit" }}
            >
              <SurveyOverview
                averageScore={averageScore}
                fileCounts={fileCounts}
              />
            </motion.div>
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
                files={files}
                selected={selected}
                selectedFiles={selectedFiles}
                setSelected={setSelected}
                setAIResponse={setAIResponse}
                onSelectTab={onSelectTab}
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
                onSelectTab={onSelectTab}
                activeTab={activeTab}
              />
            </motion.div>
          </Col>
        </Row>

        <Row gutter={[32, 32]} style={{ marginTop: "16px" }}>
          {/* Responses Chart - Slide in from Bottom */}
          <Col xs={20} lg={15} xl={15} className="dashboard-panel">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ height: "inherit" }}
            >
              <ResponsesChart
                files={files}
                fileCounts={fileCounts}
                setFileCounts={setFileCounts}
              />
            </motion.div>
          </Col>
          {/* Engagement Chart - Slide in from Bottom */}
          <Col xs={20} lg={5} xl={5} className="dashboard-panel">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              style={{ height: "inherit" }}
            >
              <EngagementChart files={files} selectedFiles={selectedFiles} />
            </motion.div>
          </Col>
        </Row>
      </div>
      <TakeTourOverlay isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen} />
    </React.Fragment>
  );
};
