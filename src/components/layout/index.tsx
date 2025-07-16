import React from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";

import { Header } from "./header";
import Sidebar from "./sidebar";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Sider={() => {
          return <Sidebar />;
        }}
        Header={Header}
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
