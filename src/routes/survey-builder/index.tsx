import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import { useGetIdentity } from "@refinedev/core";

import {
  Button,
  Card,
  Input,
  InputNumber,
  Layout,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import CryptoJS from "crypto-js";
import LZString from "lz-string";

import { ErrorAlert } from "@/components";
import { getEncryptionKey } from "@/config/config";
import { API_URL, authProvider } from "@/providers";
import TakeTourOverlay from "@/components/layout/tour";

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

interface Question {
  id: string;
  type: "text" | "multiple-choice" | "checkbox" | "rating";
  label: string;
  options?: { id: string; value: string }[];
  scale?: number; // Keep as optional number, but ensure assignment is always number.
}

interface AvailableQuestionType {
  id: string;
  type: "text" | "multiple-choice" | "checkbox" | "rating";
  label: string;
}

const SurveyBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showCopyLink, setShowCopyLink] = useState<boolean>(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("default");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const { data: user } = useGetIdentity<{
    id: number;
    idStr: string;
    jwtToken: string;
    subscription: string;
    surveyCount: number;
  }>();

  const isPaidAccount =
    user?.subscription === "month" || user?.subscription === "year";
  const canCreateMoreLinks =
    isPaidAccount || (isPaidAccount && (user?.surveyCount || 0) < 1);

  const serializeSurvey = (): string => {
    return JSON.stringify({
      questions,
      logoUrl,
      theme,
      customerName,
      customerEmail,
      surveyTitle,
    });
  };

  const availableQuestionTypes: AvailableQuestionType[] = [
    { id: "text-input", type: "text", label: "Additional Info" },
    {
      id: "multiple-choice",
      type: "multiple-choice",
      label: "Multiple Choice",
    },
    { id: "checkbox", type: "checkbox", label: "Checkbox" },
    { id: "rating", type: "rating", label: "Rating" },
  ];

  const handleAddQuestion = (questionType: AvailableQuestionType) => {
    const newQuestion: Question = {
      id: `question-${Date.now()}`,
      type: questionType.type,
      label: questionType.label,
      ...(questionType.type === "multiple-choice" ||
      questionType.type === "checkbox"
        ? { options: [{ id: `option-${Date.now()}`, value: "Option 1" }] }
        : {}),
      ...(questionType.type === "rating" ? { scale: 5 } : {}),
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditQuestionLabel = (id: string, newLabel: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, label: newLabel } : q)),
    );
  };

  const handleAddOption = (questionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId &&
        (q.type === "multiple-choice" || q.type === "checkbox")
          ? {
              ...q,
              options: [
                ...(q.options || []),
                {
                  id: `option-${Date.now()}`,
                  value: `Option ${(q.options?.length || 0) + 1}`,
                },
              ],
            }
          : q,
      ),
    );
  };

  const handleEditOption = (
    questionId: string,
    optionId: string,
    newValue: string,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId &&
        (q.type === "multiple-choice" || q.type === "checkbox")
          ? {
              ...q,
              options: (q.options || []).map((opt) =>
                opt.id === optionId ? { ...opt, value: newValue } : opt,
              ),
            }
          : q,
      ),
    );
  };

  const handleRemoveOption = (questionId: string, optionId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId &&
        (q.type === "multiple-choice" || q.type === "checkbox")
          ? {
              ...q,
              options: (q.options || []).filter((opt) => opt.id !== optionId),
            }
          : q,
      ),
    );
  };

  const handleEditRatingScale = (
    questionId: string,
    newScale: number | null,
  ) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId && q.type === "rating"
          ? { ...q, scale: newScale || 1 }
          : q,
      ),
    );
  };

  const handleGenerateLink = async () => {
    if (questions.length === 0) {
      alert("Please add some questions first!");
      return;
    }

    if (!canCreateMoreLinks) {
      alert(
        "Free accounts are limited to one survey link. Please upgrade to create more!",
      );
      return;
    }

    const serialized = serializeSurvey();
    const encodedData = encodeURIComponent(btoa(serialized));
    const compressed = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        encodedData,
        customerName,
        customerEmail,
        surveyTitle,
      }),
    );
    const baseUrl = window.location.origin;
    fetch(`${API_URL}/survey-fill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ compressed }),
    });

    const rawSurveyData = `${customerName}|${customerEmail}|${surveyTitle}`;
    const encodedSurveyData = btoa(rawSurveyData);
    // const secretKey = await getEncryptionKey();
    // const encodedSurveyData = CryptoJS.AES.encrypt(
    //   rawSurveyData,
    //   secretKey,
    // ).toString().replaceAll("/", "").replaceAll("+", "").replaceAll("=", "");
    const link = `${baseUrl}/survey-fill/${encodeURIComponent(encodedSurveyData)}`;
    setGeneratedLink(link);

    const user = await authProvider.getIdentity();
    if (user) {
      const updatedUser = { ...user, surveyCount: (user.surveyCount || 0) + 1 };
      fetch(`${API_URL}/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });
    }

    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 2000);
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      setShowCopyLink(true);
      setTimeout(() => setShowCopyLink(false), 2000);
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#f0f2f5", padding: "20px" }}>
        <Title id="question-types" level={4}>
          Question Types
        </Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          {availableQuestionTypes.map((qType) => (
            <Button
              key={qType.id}
              onClick={() => handleAddQuestion(qType)}
              style={{ width: "100%", textAlign: "left", marginBottom: "8px" }}
              icon={<PlusOutlined />}
            >
              {qType.label}
            </Button>
          ))}
        </Space>
      </Sider>
      <Layout>
        <Content style={{ padding: "20px" }}>
          <Title id="survey-builder" level={2}>
            Survey Builder
          </Title>
          <Text>
            Click on question types to add them, and configure their properties.
          </Text>

          <Space
            id="metadata"
            direction="vertical"
            style={{ width: "100%", marginTop: "20px" }}
          >
            <Input
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <Input
              placeholder="Customer Email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
            <Input
              placeholder="Survey Title"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
            />
          </Space>

          <ErrorAlert
            showAlert={showAlert}
            type="success"
            message="Survey link generated!"
          >
            <Button
              id="create"
              type="primary"
              icon={<CopyOutlined />}
              onClick={handleGenerateLink}
              style={{ marginTop: "20px", marginLeft: "10px" }}
              disabled={!canCreateMoreLinks}
            >
              Generate Shareable Link
            </Button>
          </ErrorAlert>

          {generatedLink && (
            <Space style={{ marginTop: "10px", width: "100%" }}>
              <Input value={generatedLink} readOnly />
              <ErrorAlert
                showAlert={showCopyLink}
                type="success"
                message="Survey link copied to clipboard!"
              >
                <CopyToClipboard text={generatedLink} onCopy={handleCopyLink}>
                  <Button icon={<CopyOutlined />}>Copy</Button>
                </CopyToClipboard>
              </ErrorAlert>
            </Space>
          )}

          <div id="logo-theme" style={{ marginTop: "20px" }}>
            <Text strong>Logo (Optional):</Text>
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={() => false} // Prevent automatic upload
              onChange={(info) => {
                if (info.file) {
                  const reader = new FileReader();
                  reader.readAsDataURL(info.file);
                  reader.onload = () => {
                    setLogoUrl(reader.result as string);
                  };
                }
              }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt="logo" style={{ width: "100%" }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {logoUrl && (
              <Button
                style={{ marginTop: 15 }}
                danger
                onClick={() => setLogoUrl(null)}
              >
                Remove Logo
              </Button>
            )}
          </div>

          <div style={{ marginTop: "20px" }}>
            <Text strong>Theme:</Text>
            <Select
              defaultValue="default"
              style={{ width: "120px", marginLeft: "10px" }}
              onChange={(value) => setTheme(value)}
              options={[
                { value: "default", label: "Default" },
                { value: "light", label: "Light" },
                { value: "red", label: "Red" },
                { value: "blue", label: "Blue" },
                { value: "yellow", label: "Yellow" },
                { value: "green", label: "Green" },
                { value: "purple", label: "Purple" },
                { value: "orange", label: "Orange" },
                // { value: "dark", label: "Dark" },
              ]}
            />
          </div>

          <div
            id="survey-canvas"
            style={{
              minHeight: "400px",
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              marginTop: "20px",
              padding: "20px",
              backgroundColor: "#fafafa",
            }}
          >
            {questions.length === 0 && (
              <Text id="build-area" type="secondary">
                Add questions here to start building your survey.
              </Text>
            )}
            <Space direction="vertical" style={{ width: "100%" }}>
              {questions.map((question) => (
                <Card
                  key={question.id}
                  style={{ marginBottom: "12px" }}
                  extra={
                    <Space>
                      <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() =>
                          setEditingQuestionId(
                            editingQuestionId === question.id
                              ? null
                              : question.id,
                          )
                        }
                      />
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveQuestion(question.id)}
                      />
                    </Space>
                  }
                >
                  <Paragraph
                    editable={{
                      onChange: (newLabel) =>
                        handleEditQuestionLabel(question.id, newLabel),
                    }}
                  >
                    {question.label}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    ({question.type})
                  </Text>

                  {editingQuestionId === question.id && (
                    <div
                      style={{
                        marginTop: "16px",
                        borderTop: "1px dashed #eee",
                        paddingTop: "16px",
                      }}
                    >
                      {question.type === "text" && (
                        <Text type="secondary">
                          No additional configuration needed for Text Input.
                        </Text>
                      )}

                      {(question.type === "multiple-choice" ||
                        question.type === "checkbox") && (
                        <>
                          <Text strong>Options:</Text>
                          <Space
                            direction="vertical"
                            style={{ width: "100%", marginTop: "8px" }}
                          >
                            {question.options?.map((option) => (
                              <Input
                                key={option.id}
                                value={option.value}
                                onChange={(e) =>
                                  handleEditOption(
                                    question.id,
                                    option.id,
                                    e.target.value,
                                  )
                                }
                                addonAfter={
                                  <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() =>
                                      handleRemoveOption(question.id, option.id)
                                    }
                                  />
                                }
                              />
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => handleAddOption(question.id)}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Option
                            </Button>
                          </Space>
                        </>
                      )}

                      {question.type === "rating" && (
                        <>
                          <Text strong>Rating Scale:</Text>
                          <InputNumber
                            min={1}
                            max={10}
                            value={question.scale}
                            onChange={(value) =>
                              handleEditRatingScale(question.id, value)
                            }
                            style={{ width: "100%", marginTop: "8px" }}
                          />
                        </>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </Space>
          </div>
        </Content>
      </Layout>
      <TakeTourOverlay isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen} />
    </Layout>
  );
};

export default SurveyBuilder;
