import { useSearchParams } from "react-router";
import { Image } from "antd";
import { AuthPage } from "@refinedev/antd";

import { authCredentials } from "@/providers";
import { Text } from "@/components";

import logo from "@/assets/img/logo.png";
import { URL_ROUTES } from "@/config/config";
import { useEffect } from "react";

export const RegisterPage = () => {
  const [searchParams] = useSearchParams();

  const www = () => {
    window.location.href = URL_ROUTES.www;
  };

  useEffect(() => {
    const plan = searchParams.get("plan") || "";
    localStorage.setItem("plan", plan);
  }, []);

  return (
    <AuthPage
      type="register"
      title={
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>
          <Image
            onClick={www}
            preview={false}
            src={logo}
            alt="Jangoro"
            style={{ width: 64, height: 32, marginRight: 16 }}
          />
          Jangoro
        </Text>
      }
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
