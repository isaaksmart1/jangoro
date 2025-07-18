import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { LineAxisSharp, SmartButtonOutlined } from "@mui/icons-material";
import { Button, Card, List, Select, Space, Typography } from "antd";

const { Title, Text } = Typography;
const { Option } = Select;

function MetricPanel({ files, selected, type, setAverageScore }: any) {
  const [data, setData] = useState([]);
  const [entities, setEntities] = useState([]);
  const [scoreColumn, setScoreColumn] = useState("");
  const [entityColumn, setEntityColumn] = useState("");
  const [columnNames, setColumnNames] = useState([]);

  useEffect(() => {
    if (files.length > 0)
      Papa.parse(files.find((f: any) => f.name === selected).file, {
        complete: (result: any) => {
          setData(result.data as any);
          // Extract column names dynamically from the first row (headers)
          const columns = Object.keys(result.data[0] as any);
          setColumnNames(columns as any);
          // Set initial values for columns
          setScoreColumn(columns[0] || "");
          setEntityColumn(columns[1] || "");
        },
        header: true,
      });
  }, [selected]);

  const calculateAverageScore = (column: string | number) => {
    if (column && data.length) {
      const total = data.reduce((sum, row) => {
        return sum + (parseFloat(row[column]) || 0);
      }, 0);
      return total / data.length;
    }
    return 0;
  };

  const handleScoreColumnChange = (value) => {
    setScoreColumn(value);
  };

  const handleEntityColumnChange = (value) => {
    setEntityColumn(value);
  };

  const onGenerate = (type: string) => {
    if (type === "score") {
      const avgScore = calculateAverageScore(scoreColumn);
      setAverageScore(avgScore as any);
    } else if (type === "list") {
      const entitiesList = [
        ...new Set(data.map((row) => row[entityColumn])),
      ].filter((e) => e !== undefined);
      setEntities(entitiesList);
    }
  };

  let metricTitle = "List";
  let columnTitle = "Entity";
  if (type === "score") {
    metricTitle = "Score";
    columnTitle = "Score";
  }

  return (
    <Card
      id="metrics-panel"
      style={{ borderRadius: 12, padding: 16 }}
      title={
        <Title style={{ fontSize: 20, marginLeft: ".7rem", color: "#000000" }}>
          {metricTitle} Metric
        </Title>
      }
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div className="flex flex-col gap-4">
          <Text style={{ fontSize: 14, color: "#4B5563" }}>
            Select {columnTitle} Column:
          </Text>
          {/* Score Column Selection */}
          {type === "score" && (
            <div>
              <Select
                value={scoreColumn}
                onChange={handleScoreColumnChange}
                style={{ width: "100%", marginTop: 4 }}
                placeholder="No columns available"
              >
                {columnNames.map((col, idx) => (
                  <Option key={idx} value={col}>
                    {col}
                  </Option>
                ))}
              </Select>
            </div>
          )}

          {/* Entity Column Selection */}
          {type === "list" && (
            <div>
              <Select
                onChange={handleEntityColumnChange}
                value={entityColumn}
                style={{ width: "100%", marginTop: 4 }}
                placeholder="No columns available"
              >
                {columnNames.map((col, idx) => (
                  <Option key={idx} value={col}>
                    {col}
                  </Option>
                ))}
              </Select>
              <List
                size="small"
                header={
                  <Text strong style={{ fontSize: 14 }}>
                    Entities
                  </Text>
                }
                bordered={false}
                dataSource={entities}
                renderItem={(item) => (
                  <List.Item style={{ paddingLeft: 0 }}>
                    <Text style={{ fontSize: 16, color: "#333" }}>
                      • {item}
                    </Text>
                  </List.Item>
                )}
                style={{ marginTop: "1rem" }}
              />
            </div>
          )}
        </div>

        <Button
          type="primary"
          block
          style={{ backgroundColor: "#4f46e5" }}
          onClick={() => onGenerate(type)}
        >
          Generate Metrics
        </Button>
      </Space>
    </Card>
  );
}

export default MetricPanel;
