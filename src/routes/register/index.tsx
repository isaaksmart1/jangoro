import { Image } from "antd";
import { AuthPage } from "@refinedev/antd";

import { authCredentials } from "@/providers";
import { Text } from "@/components";

export const RegisterPage = () => {
  return (
    <AuthPage
      type="register"
      title={<Text style={{ fontSize: 32, fontWeight: "bold" }}>Jangoro</Text>}
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
