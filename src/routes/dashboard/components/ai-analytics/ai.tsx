import React from "react";
import { CopyToClipboardButton } from "@/components/icon/Copy";
import { CircularProgress } from "@mui/material";
import { Col, Row } from "antd";
import { isMobile } from "react-device-detect";
import { AIProgress } from "@/components/icon/AIIcon";

type Props = {
  aiResponse: any;
  isLoading: boolean;
  activeTab: any;
  selected: any;
};

export const AI = ({ aiResponse, isLoading, activeTab, selected }: Props) => {
  const { refine, summ, sentim, rawRefinement, action } = aiResponse;
  const AIAnalyticsDashHeight = isMobile ? 296 : 312;
  return (
    <Col style={{ width: "100%" }}>
      {isLoading && (
        <span>
          {/* <CircularProgress /> */}
          <AIProgress />
        </span>
      )}
      <Row style={{ width: "100%" }}>
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
              <p style={{ color: "red" }}>
                Unable to build survey. Either reload the Dashboard or click
                'Build Survey' and try again...
              </p>
            )}
          </div>
        </Col>
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
        {!isLoading && (
          <React.Fragment>
            {activeTab === "tab1" && sentim && (
              <CopyToClipboardButton text={sentim} />
            )}
            {activeTab === "tab2" && summ && (
              <CopyToClipboardButton text={summ} />
            )}
            {activeTab === "tab3" && refine && rawRefinement && (
              <CopyToClipboardButton text={rawRefinement[selected]} />
            )}
            {activeTab === "tab4" && action && (
              <CopyToClipboardButton text={action} />
            )}
          </React.Fragment>
        )}
      </Row>
    </Col>
  );
};
