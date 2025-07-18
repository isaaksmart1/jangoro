import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";

import { Header } from "./header";
import Sidebar from "./sidebar";

export const Layout = ({ children, isTourOpen, setIsTourOpen }: any) => {
  const [title, setTitle] = useState("");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;

    if (
      path.endsWith("/dashboard") ||
      path.endsWith("/") ||
      path.endsWith("/free") ||
      path.endsWith(".com") ||
    ) {
      setTitle("Survey Analyser");
    } else if (path.endsWith("/billing")) {
      setTitle("Billing & Subscriptions");
    }
  }, [location.pathname]);

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
