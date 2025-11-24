import React, { useEffect, useState } from "react";

import { Button, Card } from "antd";
import { motion } from "framer-motion";
import { Text } from "@/components/text";

let tourSteps = {
  analyser: [
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
      description: `We have 3 available settings in this widget:\n
    1. Upload CSV Data - raw data from csv files can be uploaded from your device.\n
    2. Upload Email Data - connect your email account and analyse surveys sent to your inbox.\n
    3. Upload Survey Builder Data - analyse survey responses from surveys that have been submitted from the Survey Builder (just click update).`,
      targetId: "file-explorer",
    },
    {
      id: 3,
      title: "Take a Tour - Survey Overview",
      description: `Here you can view a couple of metrics, just:\n
    1. Upload a File \n
    2. Select the File in two panels (File Explorer then inside AI-Analytics) \n
    3. Select a column in the 'Score' metric panel \n
    4. Click Generate Metrics in the panel you chose \n
    Following the above steps will populate the stats for the Survey Overview Panel.`,
      targetId: "survey-overview",
    },
    {
      id: 4,
      title: "Take a Tour - AI Actions",
      description:
        "First click 'Upload' to open a file, then perform various actions on your uploaded data.",
      targetId: "ai-actions",
    },
    {
      id: 5,
      title: "Take a Tour - AI Analysis",
      description:
        "View the output generated from performing different AI Actions (Summary, Sentiment Score, Action Plan etc.).",
      targetId: "ai-analytics",
    },
  ],
  surveyBuilder: [
    {
      id: 1,
      title: "Take a Tour - Survey Builder",
      description:
        "Here's where you can build your survey and use it to share a link and distribute to your customers.",
      targetId: "survey-builder",
    },
    {
      id: 2,
      title: "Take a Tour - Question Types",
      description: `These are the various types of questions you can ask in this widget:\n
    1. Additional Information - This is an open-ended text input where you can ask questions with variable answers.\n
    2. Multiple Choice - This is a multiple choice question where you can add many choices and users can select only ONE answer from the list.\n
    3. Checkbox - This is a multiple choice question where you can add many choices and users can select MORE THAN ONE answer from the list.\n
    4. Rating - This is a scale question where users can slide from 1 to some defined value.`,
      targetId: "question-types",
    },
    {
      id: 3,
      title: "Take a Tour - Metadata",
      description: `This is other data for internal use only. Note* You typically set the Customer Email to the same email as your account.`,
      targetId: "metadata",
    },
    {
      id: 4,
      title: "Take a Tour - Logo & Theme",
      description:
        "Upload a brand logo & theme to your survey and make it stand out!",
      targetId: "logo-theme",
    },
    {
      id: 5,
      title: "Take a Tour - Build Area",
      description:
        "Consider that when you select a question type, the build area gets populated with a title box, edit buttons, delete buttons and option boxes.",
      targetId: "build-area",
    },
    {
      id: 6,
      title: "Take a Tour - Finish",
      description:
        "To create your survey click 'Generate Shareable Link'. To distribute a survey click 'Copy' (this will appear once you create it).",
      targetId: "create",
    },
  ],
};

export default function TakeTourOverlay({ isTourOpen, setIsTourOpen }: any) {
  const [stepIndex, setStepIndex] = useState(0);

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

  const url = window.location.href;
  let steps;

  if (url.includes("survey-builder")) steps = tourSteps.surveyBuilder;
  else steps = tourSteps.analyser;

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsTourOpen(false);
    }
  };

  const step = steps[stepIndex];
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
                {stepIndex === steps.length - 1 ? "Finish" : "Next"}
              </Button>,
            ]}
          >
            {step.description.split("\n").map((d) => (
              <>
                <Text style={{ color: "#888888" }}>{d}</Text>
                <br />
              </>
            ))}
          </Card>
        </motion.div>
      </div>
    )
  );
}
