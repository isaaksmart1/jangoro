import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button, Card } from "antd";

const { Meta } = Card;

const tourSteps = [
  {
    id: 1,
    title: "Take a Tour - Dashboard Overview",
    description:
      "Here's where you can see all your survey insights at a glance. See the Side Menu to navigate the various features such as Billing.",
    targetId: "dashboard-summary",
  },
  {
    id: 2,
    title: "Take a Tour - File Explorer",
    description: "List of the your uploaded CSV files.",
    targetId: "file-explorer",
  },
  {
    id: 3,
    title: "Take a Tour - AI Actions",
    description:
      "First click 'Upload' to open a file, then perform various actions on your uploaded data.",
    targetId: "ai-actions",
  },
  {
    id: 4,
    title: "Take a Tour - AI Analysis",
    description:
      "View the output generated from performing different AI Actions (Summary, Sentiment Score, Action Plan etc.).",
    targetId: "ai-analytics",
  },
];

export default function TakeTourOverlay({ isTourOpen, setIsTourOpen }: any) {
  const [stepIndex, setStepIndex] = useState(0);
  const [tourFlag, setTourFlag] = useState(false);

  useEffect(() => {
    // Only show the tour if it hasn't been shown in this session
    const hasSeenTour = sessionStorage.getItem("hasSeenTour");
    if (!hasSeenTour) {
      setIsTourOpen(true);
      sessionStorage.setItem("hasSeenTour", "true");
    }
  }, []);

  useEffect(() => {
    setStepIndex(0);
  }, [isTourOpen]);

  const step = tourSteps[stepIndex];

  const nextStep = () => {
    if (stepIndex < tourSteps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsTourOpen(false);
    }
  };

  const targetElement = document.getElementById(step?.targetId);
  const targetRect = targetElement?.getBoundingClientRect();

  return (
    isTourOpen && (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
        <motion.div
          className="absolute p-4 max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={
            targetRect
              ? {
                  top: targetRect.top + window.scrollY - 8,
                  left: targetRect.left + window.scrollX - 8,
                  width: targetRect.width + 16,
                  height: targetRect.height + 16,
                }
              : {}
          }
        >
          <Card
            title={step.title}
            bordered={true}
            style={{ width: 300 }}
            className="border-2 border-blue-500"
            actions={[
              <Button
                type="text"
                onClick={() => setIsTourOpen(false)}
                key="skip"
              >
                Skip
              </Button>,
              <Button type="primary" onClick={nextStep} key="next">
                {stepIndex === tourSteps.length - 1 ? "Finish" : "Next"}
              </Button>,
            ]}
          >
            <Meta description={step.description} />
          </Card>
        </motion.div>
      </div>
    )
  );
}
