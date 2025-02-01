import { Image } from "antd";
import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { authCredentials } from "@/providers";

export const LoginPage = () => {
  return (
    <AuthPage
      type="login"
      title={
        <ThemedTitleV2
          icon=""
          collapsed={false}
          text="Jangoro"
          wrapperStyles={{ fontSize: 24 }}
        />
      }
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
