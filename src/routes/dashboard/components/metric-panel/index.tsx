import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { LineAxisSharp, SmartButtonOutlined } from "@mui/icons-material";
import { Text } from "@/components";
import { Card } from "antd";

function MetricPanel({ files, selected, type }) {
  const [data, setData] = useState([]);
  const [averageScore, setAverageScore] = useState(null);
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

  const handleScoreColumnChange = (e: { target: { value: any } }) => {
    const column = e.target.value;
    setScoreColumn(column);
    const avgScore = calculateAverageScore(column);
    setAverageScore(avgScore as any);
  };

  const handleEntityColumnChange = (e: { target: { value: any } }) => {
    const column = e.target.value;
    setEntityColumn(column);
    const entitiesList = [...new Set(data.map((row) => row[column]))].filter(
      (e) => e !== undefined,
    );
    setEntities(entitiesList);
  };

  let metricTitle = "List";
  if (type === "score") metricTitle = "Score";

  return (
    <Card
      id="metrics-panel"
      style={{
        height: "100%",
        padding: "0 1rem",
        position: "relative",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
      }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <LineAxisSharp htmlColor="#6f2ebe" />
          <Text size="lg" style={{ marginLeft: ".7rem", color: "#6f2ebe" }}>
            {metricTitle} Metric
          </Text>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Score Column Selection */}
        {type === "score" && (
          <div>
            <label className="text-lg font-semibold">
              Select Score Column:{" "}
            </label>
            <select
              onChange={handleScoreColumnChange}
              value={scoreColumn}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {columnNames.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <div
              style={{
                marginTop: "1rem",
                fontSize: 18,
                color: "#3b82f6",
                fontWeight: 600,
                marginLeft: 12,
              }}
            >
              Average Score:{" "}
              {averageScore !== null ? averageScore.toFixed(2) : "N/A"}
            </div>
          </div>
        )}

        {/* Entity Column Selection */}
        {type === "list" && (
          <div>
            <label className="text-lg font-semibold">
              Select Entity Column:{" "}
            </label>
            <select
              onChange={handleEntityColumnChange}
              value={entityColumn}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "16px",
                width: "100%",
              }}
            >
              {columnNames.map((col, idx) => (
                <option key={idx} value={col}>
                  {col}
                </option>
              ))}
            </select>
            <ul
              style={{
                marginTop: "1rem",
                paddingLeft: "20px",
                listStyleType: "disc",
                color: "#333",
              }}
            >
              {entities.map((entity, idx) => (
                <li key={idx} style={{ fontSize: "16px" }}>
                  {entity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
}

export default MetricPanel;
