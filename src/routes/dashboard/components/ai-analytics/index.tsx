import React, { useEffect, useState } from "react";

import { Card, Col, Row } from "antd";

import { Text } from "@/components";
import { AutoAwesome } from "@mui/icons-material";
import { AI } from "./ai";
import { AIProgress } from "@/components/icon/AIIcon";

type Props = {
  aiResponse: any;
  isLoading: any;
  selected: any;
  setSelected: any;
  selectedFiles: any;
};

export const AIAnalytics = ({
  aiResponse,
  isLoading,
  selected,
  setSelected,
  selectedFiles,
}: Props) => {
  const [activeTab, setActiveTab] = useState("tab1");

  useEffect(() => {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        const contents = document.querySelectorAll(".tab-content");
        const content = document.getElementById(contents[index].id);

        // Remove active classes from all tabs and contents
        tabs.forEach((t) => t.classList.remove("tab-active"));
        contents.forEach((c) => c.classList.add("hidden"));

        // Add active class to the clicked tab and corresponding content
        tab.classList.add("tab-active");
        setActiveTab(contents[index].id);
        content?.classList.remove("hidden");
      });
    });
  }, []);

  return (
    <Card
      style={{ height: "100%", padding: "24px 24px 0px 24px" }}
      headStyle={{ padding: "8px 16px" }}
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isLoading ? (
            <span>
              {/* <CircularProgress /> */}
              <AIProgress />
            </span>
          ) : (
            <AutoAwesome />
          )}
          <Text size="lg" style={{ marginLeft: ".5rem" }}>
            Ask AI
          </Text>
          <Row style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            <Col style={{ marginLeft: "1rem", marginRight: "1rem" }}>
              {selectedFiles.length > 0 && (
                <select
                  onChange={(event) => setSelected(event.target.value)}
                  className="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedFiles.map((file: any, index: number) => (
                    <option key={index} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
              )}
            </Col>
            <Col className="tabs" xs={24} sm={24} xl={4}>
              <div className="tab-headers flex border-b border-gray-200 mb-4">
                <button
                  className="tab tab-active px-4 py-2 text-gray-700 border-b-2 border-blue-500 font-medium"
                  data-tab="tab1"
                >
                  Sentiment Score
                </button>
                <button
                  className="tab px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  data-tab="tab2"
                >
                  Summary
                </button>
                <button
                  className="tab px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  data-tab="tab3"
                >
                  Survey Builder
                </button>
                <button
                  className="tab px-4 py-2 text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
                  data-tab="tab3"
                >
                  Action Plan
                </button>
              </div>
            </Col>
          </Row>
        </div>
      }
    >
      <Row style={{ height: "100%" }}>
        <AI
          aiResponse={aiResponse}
          isLoading={isLoading}
          activeTab={activeTab}
          selected={selected}
        />
      </Row>
    </Card>
  );
};
