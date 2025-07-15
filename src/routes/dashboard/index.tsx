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

export const DashboardPage = () => {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiResponse, setAIResponse] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);

  return (
    <React.Fragment>
      <div className="page-container" id="dashboard-summary">
        <Row gutter={[32, 32]}>
          {/* Title & Icon - Slide in from Left */}
          <Col xs={24} sm={24} xl={2}>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <QueryStatsRounded
                sx={{ fontSize: 32, marginRight: 1 }}
                htmlColor="#6f2ebe"
              />
              <h1 className="text-gray-700 text-3xl mb-6">Analyzer</h1>
            </motion.div>
          </Col>

          {/* Analyzer Action Buttons - Slide in from Right */}
          <Col xs={16} sm={16} xl={9} className="dashboard-panel">
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

          {/* Other Metrics */}
          <Col xs={6} sm={6} xl={6}>
            <MetricPanel
              type="list"
              files={files}
              selected={selected}
            />
          </Col>

          <Col xs={6} sm={6} xl={6}>
            <MetricPanel
              type="score"
              files={files}
              selected={selected}
            />
          </Col>
        </Row>

        <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
          {/* File List - Slide in from Left */}
          <Col
            xs={24}
            sm={24}
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

          {/* AI Analytics - Slide in from Right */}
          <Col
            xs={24}
            sm={24}
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

        <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
          {/* Responses Chart - Slide in from Bottom */}
          <Col xs={24} lg={18} className="dashboard-panel">
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
      <TakeTourOverlay />
    </React.Fragment>
  );
};
