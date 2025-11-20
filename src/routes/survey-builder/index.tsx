import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import {
  Button,
  Card,
  Input,
  InputNumber,
  Layout,
  message,
  Select,
  Space,
  Typography,
  Upload,
} from "antd";
import LZString from "lz-string";

import { API_URL } from "@/providers";

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
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("default");
  const [customerName, setCustomerName] = useState<string>("");
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [surveyTitle, setSurveyTitle] = useState<string>("");

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
    { id: "text-input", type: "text", label: "Text Input" },
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

  const handleGenerateLink = () => {
    if (questions.length === 0) {
      message.warn("Please add some questions first!");
      return;
    }
    const serialized = serializeSurvey();
    // In a real application, you would store this serialized data in a database
    // and generate a short, unique ID to pass in the URL.
    // For this example, we'll encode the entire survey data into the URL.
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
    const encodedSurveyData = `${customerName}|${customerEmail}|${surveyTitle}`;
    const link = `${baseUrl}/survey-fill/${encodedSurveyData}`;
    setGeneratedLink(link);
    message.success("Survey link generated!");
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      message.success("Survey link copied to clipboard!");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} style={{ background: "#f0f2f5", padding: "20px" }}>
        <Title level={4}>Question Types</Title>
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
          <Title level={2}>Survey Builder</Title>
          <Text>
            Click on question types to add them, and configure their properties.
          </Text>

          <Space
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

          <Button
            type="primary"
            icon={<CopyOutlined />}
            onClick={handleGenerateLink}
            style={{ marginTop: "20px", marginLeft: "10px" }}
          >
            Generate Shareable Link
          </Button>

          {generatedLink && (
            <Space style={{ marginTop: "10px", width: "100%" }}>
              <Input value={generatedLink} readOnly />
              <CopyToClipboard text={generatedLink} onCopy={handleCopyLink}>
                <Button icon={<CopyOutlined />}>Copy</Button>
              </CopyToClipboard>
            </Space>
          )}

          <div style={{ marginTop: "20px" }}>
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
              <Button danger onClick={() => setLogoUrl(null)}>
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
              <Text type="secondary">
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
    </Layout>
  );
};

export default SurveyBuilder;
