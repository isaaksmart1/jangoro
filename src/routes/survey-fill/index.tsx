import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  message,
  Radio,
  Slider,
  Space,
  Typography,
} from "antd";

import { API_URL } from "@/providers";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Question {
  id: string;
  type: "text" | "multiple-choice" | "checkbox" | "rating";
  label: string;
  options?: { id: string; value: string }[];
  scale?: number;
}

const SurveyFill = () => {
  const { encodedSurveyData } = useParams<{ encodedSurveyData: string }>();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [surveyLogoUrl, setSurveyLogoUrl] = useState<string | null>(null);
  const [surveyTheme, setSurveyTheme] = useState<string>("default");
  const [currentTheme, setCurrentTheme] = useState<React.CSSProperties>({});
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [customerName, customerEmail, surveyTitle] = (
    encodedSurveyData || ""
  ).split("|");

  useEffect(() => {
    fetch(
      `${API_URL}/survey-fill?customerName=${encodeURIComponent(customerName)}&customerEmail=${encodeURIComponent(customerEmail)}&surveyTitle=${encodeURIComponent(surveyTitle)}`,
    )
      .then((res) => res.json())
      .then((result) => {
        if (result && result.encodedData) {
          const { encodedData } = result;
          const encodedSurveyData = encodedData;
          try {
            const decodedData = atob(decodeURIComponent(encodedSurveyData));
            const parsedData = JSON.parse(decodedData);
            setSurveyQuestions(parsedData.questions || []);
            setSurveyLogoUrl(parsedData.logoUrl || null);
            setSurveyTheme(parsedData.theme || "default");
            setLoading(false);
          } catch (e) {
            console.error("Failed to decode or parse survey data:", e);
            setError("Invalid survey link.");
            setLoading(false);
          }
        } else {
          setError("No survey data provided.");
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching survey data:", err);
        setError("Failed to fetch survey data.");
        setLoading(false);
      });
  }, []);

  const onFinish = (values: any) => {
    console.log("Survey responses:", values);
    message.success(
      "Survey submitted successfully! Check console for responses.",
    );
    // In a real application, you would send these responses to a backend.
  };

  const themeStyles: { [key: string]: React.CSSProperties } = {
    default: { backgroundColor: "#f0f2f5", color: "#000000" },
    light: { backgroundColor: "#ffffff", color: "#000000" },
    red: { backgroundColor: "#ffcccc", color: "#ffcccc" },
    blue: { backgroundColor: "#cce5ff", color: "#cce5ff" },
    yellow: { backgroundColor: "#fff9cc", color: "#fff9cc" },
    green: { backgroundColor: "#ccffcc", color: "#ccffcc" },
    purple: { backgroundColor: "#e5ccff", color: "#e5ccff" },
    orange: { backgroundColor: "#ffe5cc", color: "#ffe5cc" },
    dark: { backgroundColor: "#333333", color: "#ffffff" },
  };

  useEffect(() => {
    setCurrentTheme(themeStyles[surveyTheme]);
  }, [surveyTheme]);

  if (loading) {
    return (
      <Content style={{ padding: "50px", textAlign: "center" }}>
        <Text>Loading survey...</Text>
      </Content>
    );
  }

  if (error) {
    return (
      <Content style={{ padding: "50px", textAlign: "center" }}>
        <Text type="danger">{error}</Text>
      </Content>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", ...themeStyles["default"] }}>
      <Content
        style={{
          padding: "50px",
          width: "720px",
          maxWidth: "720px",
          margin: "auto",
        }}
      >
        <Card>
          {surveyLogoUrl && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={surveyLogoUrl}
                alt="Survey Logo"
                style={{ maxWidth: "150px", maxHeight: "150px" }}
              />
            </div>
          )}
          <Title
            level={2}
            style={{
              textAlign: "center",
              marginBottom: "30px",
              color: currentTheme.color || "inherit",
            }}
          >
            Complete the {surveyTitle} Survey
          </Title>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {surveyQuestions.map((question) => (
              <Form.Item
                key={question.id}
                label={<Text strong>{question.label}</Text>}
                name={question.id}
                rules={[
                  {
                    required: true,
                    message: `Please answer ${question.label}`,
                  },
                ]}
              >
                {question.type === "text" && (
                  <Input placeholder="Your answer" />
                )}
                {question.type === "multiple-choice" && (
                  <Radio.Group>
                    <Space direction="vertical">
                      {question.options?.map((option) => (
                        <Radio key={option.id} value={option.value}>
                          {option.value}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                )}
                {question.type === "checkbox" && (
                  <Checkbox.Group>
                    <Space direction="vertical">
                      {question.options?.map((option) => (
                        <Checkbox key={option.id} value={option.value}>
                          {option.value}
                        </Checkbox>
                      ))}
                    </Space>
                  </Checkbox.Group>
                )}
                {question.type === "rating" && (
                  <Slider
                    min={1}
                    max={question.scale || 5}
                    marks={
                      question.scale
                        ? Array.from(
                            { length: question.scale },
                            (_, i) => i + 1,
                          ).reduce((acc, val) => ({ ...acc, [val]: val }), {})
                        : { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }
                    }
                  />
                )}
              </Form.Item>
            ))}
            <Form.Item>
              <Button
                htmlType="submit"
                style={{ width: "100%", marginTop: "20px", backgroundColor: currentTheme.backgroundColor }}
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </Layout>
  );
};

export default SurveyFill;
