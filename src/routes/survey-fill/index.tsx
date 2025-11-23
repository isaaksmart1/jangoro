import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Radio,
  Slider,
  Space,
  Typography,
} from "antd";
import CryptoJS from "crypto-js";

import { getEncryptionKey } from "@/config/config";
import { AI_URL, API_URL, authProvider } from "@/providers";

const { Content } = Layout;
const { Title, Text } = Typography;

interface Question {
  id: string;
  type: "text" | "multiple-choice" | "checkbox" | "rating";
  label: string;
  options?: { id: string; value: string }[];
  scale?: number;
}

const ThanksForTakingSurvey = ({ themeStyles }: any) => (
  <Layout style={{ minHeight: "100vh", ...themeStyles["default"] }}>
    <Content
      style={{
        padding: "50px",
        width: "720px",
        maxWidth: "720px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <Card>
        <Title level={2} style={{ marginBottom: "20px" }}>
          Thank You!
        </Title>
        <Text>Your responses have been recorded successfully.</Text>
        {/* Go Back */}
        <div style={{ marginTop: "30px" }}>
          <Button
            type="primary"
            style={{
              backgroundColor: themeStyles.backgroundColor,
              color: themeStyles.color,
            }}
            onClick={() => {
              window.location.reload();
            }}
          >
            Fill Another Survey
          </Button>
        </div>
      </Card>
    </Content>
  </Layout>
);

const SurveyFill = () => {
  const { encodedSurveyData } = useParams<{ encodedSurveyData: string }>();
  const [surveyQuestions, setSurveyQuestions] = useState<Question[]>([]);
  const [surveyLogoUrl, setSurveyLogoUrl] = useState<string | null>(null);
  const [surveyTitle, setSurveyTitle] = useState<string>("");
  const [surveyTheme, setSurveyTheme] = useState<string>("default");
  const [currentTheme, setCurrentTheme] = useState<React.CSSProperties>({});
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    decryptSurveyData(encodedSurveyData || "")
      .then((decryptedData) => {
        const [customerName, customerEmail, surveyTitle] = (
          decryptedData || ""
        ).split("|");
        return fetch(
          `${API_URL}/survey-fill?customerName=${encodeURIComponent(customerName)}&customerEmail=${encodeURIComponent(customerEmail)}&surveyTitle=${encodeURIComponent(surveyTitle)}`,
        );
      })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.encodedData) {
          const { encodedData } = result;
          const encodedSurveyData = encodedData;
          try {
            const decodedData = atob(decodeURIComponent(encodedSurveyData));
            const parsedData = JSON.parse(decodedData);
            setSurveyTitle(parsedData.surveyTitle || "");
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

  const decryptSurveyData = async (encodedData: string) => {
    let decrypted = "";

    try {
      decrypted = atob(decodeURIComponent(encodedData));
    } catch (e) {
      console.error("Failed to decode Base64", e);
    }
    // const secretKey = await getEncryptionKey();
    // try {
    //   const bytes = CryptoJS.AES.decrypt(
    //     encodedData,
    //     secretKey,
    //   );
    //   decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // } catch (e) {
    //   console.error("Failed to decrypt.", e);
    // }

    return decrypted;
  };

  const onFinish = async (values: any) => {
    const res = {} as any;
    let payload = {};
    const user = await authProvider.getIdentity();
    const email = user.email || customerEmail || "" || "";
    Object.keys(values).forEach((key) => {
      const question = surveyQuestions.find((q) => q.id === key);
      if (!question) {
        return null;
      }
      const label = question.label;
      res[label] = values[key];
      return res;
    });
    payload = {
      customerName,
      customerEmail: email,
      surveyTitle,
      responses: res,
    };
    // Post payload to the backend API
    fetch(`${AI_URL}/survey-submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Successfully submitted survey responses:", data);
        setThankYouVisible(true);
      })
      .catch((err) => {
        console.error("Error submitting survey responses:", err);
        alert("Failed to submit survey. Please try again later.");
      });
  };

  const themeStyles: { [key: string]: React.CSSProperties } = {
    default: { backgroundColor: "#f0f2f5", color: "#000000" },
    light: { backgroundColor: "#ffffff", color: "#000000" },
    red: { backgroundColor: "#ff7e7eff", color: "#ff7e7eff" },
    blue: { backgroundColor: "#84bfffff", color: "#84bfffff" },
    yellow: { backgroundColor: "#fff186ff", color: "#fff186ff" },
    green: { backgroundColor: "#7bff7bff", color: "#7bff7bff" },
    purple: { backgroundColor: "#ab66f5ff", color: "#ab66f5ff" },
    orange: { backgroundColor: "#fdba7bff", color: "#fdba7bff" },
    dark: { backgroundColor: "#333333", color: "#333333" },
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
    <React.Fragment>
      {!thankYouVisible ? (
        <Layout style={{ minHeight: "100vh", ...themeStyles["default"] }}>
          <Content
            style={{
              padding: "50px",
              width: "720px",
              maxWidth: "720px",
              margin: "auto",
              paddingTop: "25px",
            }}
          >
            <h2
              style={{
                textAlign: "center",
                marginBottom: "20px",
                color: "#999999",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Powered by Jangoro
            </h2>
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
                Customer {surveyTitle} Survey
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
                              ).reduce(
                                (acc, val) => ({ ...acc, [val]: val }),
                                {},
                              )
                            : { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 }
                        }
                      />
                    )}
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button
                    htmlType="submit"
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      backgroundColor: currentTheme.backgroundColor,
                    }}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Content>
        </Layout>
      ) : (
        <ThanksForTakingSurvey themeStyles={themeStyles} />
      )}
    </React.Fragment>
  );
};

export default SurveyFill;
