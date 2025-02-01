import { Image } from "antd";
import { AuthPage, ThemedTitleV2 } from "@refinedev/antd";

import { authCredentials } from "@/providers";

export const RegisterPage = () => {
  return (
    <AuthPage
      type="register"
      title={
        <ThemedTitleV2
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
