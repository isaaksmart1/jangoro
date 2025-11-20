import React, { useState } from "react";
import { OpenAIOutlined } from "@ant-design/icons"; // or use AutoAwesome from MUI

import { Card, Col, Row, Select, Tabs } from "antd";

import { AIProgress } from "@/components/icon/AIIcon";

import { AI } from "./ai";

const { Option } = Select;
const { TabPane } = Tabs;

type Props = {
  aiResponse: any;
  isLoading: any;
  setIsLoading: any;
  selected: any;
  setSelected: any;
  selectedFiles: any;
  files: any;
};

export const AIAnalytics = ({
  aiResponse,
  isLoading,
  setIsLoading,
  setSelected,
  selectedFiles,
  selected,
  files,
}: Props) => {
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
    <Card
      id="ai-analytics"
      style={{
        height: "100%",
        padding: "1rem",
        backgroundColor: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <Row align="middle" gutter={[16, 8]} style={{ flexWrap: "wrap" }}>
          <Col>
            {isLoading ? (
              <AIProgress />
            ) : (
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
                <OpenAIOutlined style={{ color: "#FFFFFF", fontSize: 20 }} />
              </div>
            )}
          </Col>

          <Col>
            {selectedFiles.length > 0 && (
              <Select
                value={selected}
                onChange={(value) => setSelected(value)}
                style={{ width: 200, color: "#000000" }}
                placeholder="Select file"
              >
                {selectedFiles.map((file: any, index: any) => (
                  <Option key={index} value={file}>
                    {file}
                  </Option>
                ))}
              </Select>
            )}
          </Col>

          <Col flex="auto">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => onSelectTab(key)}
              tabBarStyle={{ marginBottom: 0 }}
            >
              <TabPane className="tab-content" tab="Action Plan" key="tab4" />
              <TabPane className="tab-content" tab="Ask AI" key="tab5" />
              <TabPane className="tab-content" tab="Summary" key="tab2" />
              <TabPane
                className="tab-content"
                tab="Survey Builder"
                key="tab3"
              />
              <TabPane
                className="tab-content"
                tab="Sentiment Score"
                key="tab1"
              />
            </Tabs>
          </Col>
        </Row>
      }
    >
      <Row style={{ height: "100%" }}>
        <AI
          aiResponse={aiResponse}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
          activeTab={activeTab}
          selected={selected}
          setSelected={setSelected}
          selectedFiles={selectedFiles}
          files={files}
        />
      </Row>
    </Card>
  );
};
