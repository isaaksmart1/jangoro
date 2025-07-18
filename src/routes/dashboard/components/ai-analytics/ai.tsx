import React from "react";
import { CopyToClipboardButton } from "@/components/icon/Copy";
import { Col, Row } from "antd";
import { isMobile } from "react-device-detect";
import { AIQuery } from "./ai-query";

type Props = {
  aiResponse: any;
  setIsLoading: any;
  isLoading: boolean;
  activeTab: any;
  selectedFiles: any;
  setSelected: any;
  selected: any;
  files: any;
};

export const AI = ({
  aiResponse,
  isLoading,
  setIsLoading,
  activeTab,
  selectedFiles,
  setSelected,
  selected,
  files,
}: Props) => {
  const {
    refine,
    summ,
    sentim,
    action,
    rawRefinement,
    rawSummary,
    rawSentiment,
    rawActionPlan,
  } = aiResponse;
  const AIAnalyticsDashHeight = 296;
  return (
    <Col style={{ width: "100%" }}>
      <Row style={{ width: "100%" }}>
        <Col
          id="tab4"
          className="tab-content scrollable hidden"
          style={{ height: AIAnalyticsDashHeight }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: action,
            }}
          ></div>
        </Col>
        <AIQuery
          setIsLoading={setIsLoading}
          selectedFiles={selectedFiles}
          selected={selected}
          setSelected={setSelected}
          files={files}
          isLoading={isLoading}
          activeTab={activeTab}
          AIAnalyticsDashHeight={AIAnalyticsDashHeight}
        />
        <Col
          id="tab2"
          className="tab-content scrollable hidden"
          style={{ height: AIAnalyticsDashHeight }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: summ,
            }}
          ></div>
        </Col>
        <Col
          id="tab3"
          className="tab-content scrollable hidden"
          style={{ height: AIAnalyticsDashHeight }}
        >
          <div>
            {refine ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: refine,
                }}
              />
            ) : (
              <div class="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-exclamation-circle text-red-500"></i>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700 font-normal">
                      Unable to build survey. Either reload the Dashboard or
                      click 'Build Survey' and try again...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
        <Col
          id="tab1"
          className="tab-content scrollable"
          style={{ height: AIAnalyticsDashHeight }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: sentim,
            }}
          ></div>
        </Col>
        {!isLoading && (
          <React.Fragment>
            {activeTab === "tab1" && sentim && rawSentiment && (
              <CopyToClipboardButton text={rawSentiment} />
            )}
            {activeTab === "tab2" && summ && rawSummary && (
              <CopyToClipboardButton text={rawSummary} />
            )}
            {activeTab === "tab3" && refine && rawRefinement && (
              <CopyToClipboardButton text={rawRefinement} />
            )}
            {activeTab === "tab4" && action && rawActionPlan && (
              <CopyToClipboardButton text={rawActionPlan} />
            )}
          </React.Fragment>
        )}
      </Row>
    </Col>
  );
};
