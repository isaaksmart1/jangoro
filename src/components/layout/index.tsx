import React from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";

import { Header } from "./header";
import Sidebar from "./sidebar";

export const Layout = ({ children, isTourOpen, setIsTourOpen }: any) => {
  const path = window.location.pathname;

  let title = "";
  if (path.includes("dashboard")) {
    title = "Survey Analyser";
  } else if (path.includes("billing")) {
    title = "Billing & Subscriptions";
  }

  return (
    <>
      <ThemedLayoutV2
        Sider={() => {
          return <Sidebar />;
        }}
        Header={() => (
          <Header
            title={title}
            isTourOpen={isTourOpen}
            setIsTourOpen={setIsTourOpen}
          />
        )}
        Title={(titleProps) => {
          return (
            <ThemedTitleV2
              {...titleProps}
              text={
                <p
                  className="text-md"
                  style={{ color: "#AAAAAA", fontWeight: 400 }}
                >
                  Optimized for Desktop
                </p>
              }
              icon=""
              wrapperStyles={{ fontSize: 12 }}
            />
          );
        }}
      >
        {children}
      </ThemedLayoutV2>
    </>
  );
};
