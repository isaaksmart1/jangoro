import React from "react";
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
        <React.Fragment>
          <Image
            onClick={www}
            preview={false}
            src={logo}
            alt="Jangoro"
            style={{ width: 32, height: 56, marginRight: 6 }}
          />
          <Text style={{ fontSize: 32, fontWeight: "bold", color: "indigo" }}>
            angoro
          </Text>
        </React.Fragment>
      }
      formProps={{
        initialValues: authCredentials,
      }}
    />
  );
};
