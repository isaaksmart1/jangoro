import { CopyToClipboardButton } from "@/components/icon/Copy";
import { CircularProgress } from "@mui/material";
import { Col, Row } from "antd";
import { isMobile } from "react-device-detect";

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
        <span
          className="MuiCircularProgress-root MuiCircularProgress-indeterminate MuiCircularProgress-colorPrimary RaLoading-icon css-12ek9y1-MuiCircularProgress-root"
          style={{ width: 40, height: 40 }}
          role="progressbar"
        >
          <CircularProgress />
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
        {activeTab === "tab1" && sentim && (
          <CopyToClipboardButton text={sentim} />
        )}

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
        {activeTab === "tab2" && summ && <CopyToClipboardButton text={summ} />}

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
        {activeTab === "tab3" && refine && rawRefinement && (
          <CopyToClipboardButton text={rawRefinement[selected]} />
        )}

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
        {activeTab === "tab4" && action && (
          <CopyToClipboardButton text={action} />
        )}
      </Row>
    </Col>
  );
};
