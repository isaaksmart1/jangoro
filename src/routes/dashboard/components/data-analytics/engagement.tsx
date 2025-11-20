import React, { useEffect, useState } from "react";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { AI_URL, authProvider, httpProvider } from "@/providers";

type Props = {
  files: any;
  selectedFiles: any;
};

export function Engagements({ files, selectedFiles }: Props) {
  const [engagement, setEngagement] = useState<any>(null);
  const [animatedRate, setAnimatedRate] = useState(0);

  const handleRequest = async () => {
    if (selectedFiles.length !== 1) return;

    const url = `${AI_URL}/analyze-engagement`;
    const user = await authProvider.getIdentity();
    const file = files.find((f: any) => f.name === selectedFiles[0]);
    if (!file) return;

    const formData = new FormData();
    formData.append("email", user?.email || "");
    formData.append("id", user?.id || "");
    formData.append("file", file.file);

    try {
      const response = await httpProvider.custom(url, {
        method: "post",
        headers: {},
        body: formData,
      });
      const result = await response.json();
      setEngagement(result.engagement);
    } catch (error) {
      console.error("Error fetching engagement:", error);
    }
  };

  useEffect(() => {
    handleRequest();
  }, [selectedFiles]);

  // Animate gauge fill when engagement data updates
  useEffect(() => {
    if (!engagement) return;
    const target = engagement.completionRate;
    let current = 0;
    const duration = 800; // total animation time in ms
    const stepTime = 16; // roughly 60fps
    const increment = (target / duration) * stepTime;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedRate(current);
    }, stepTime);

    return () => clearInterval(timer);
  }, [engagement]);

  if (!engagement) return null;

  const data = [
    { name: "Completed", value: animatedRate },
    { name: "Remaining", value: 100 - animatedRate },
  ];

  const COLORS = ["#82ca9d", "#e0e0e0"];

  return (
    <div style={{ marginTop: "1rem", width: "100%" }}>
      <h3 style={{ textAlign: "center", marginBottom: 16 }}>Engagement Analysis</h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            startAngle={180}
            endAngle={0}
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
            isAnimationActive={false} // disable Recharts built-in animation, we handle it manually
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div style={{ textAlign: "center", marginTop: -20 }}>
        <h2 style={{ margin: 0 }}>{animatedRate.toFixed(1)}%</h2>
        <p style={{ color: "#666", marginTop: 4 }}>
          {engagement.completedSurveys} of {engagement.totalSurveys} surveys completed
        </p>
      </div>
    </div>
  );
}
