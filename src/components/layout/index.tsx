import React from "react";
import { ThemedLayoutV2, ThemedTitleV2 } from "@refinedev/antd";

import { Header } from "./header";

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <>
      <ThemedLayoutV2
        Header={Header}
        Title={(titleProps) => {
          return (
            <ThemedTitleV2
              {...titleProps}
              text={
                <p
                  className="text-md"
                  style={{ color: "#aaaaaa", fontWeight: 400 }}
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
