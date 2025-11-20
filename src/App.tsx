import { useState } from "react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp, ConfigProvider } from "antd";

import {
  AuthWrapper,
  ForgotPassword,
  Layout,
  PageTitleUpdater,
  RedeemCode,
  ResetPassword,
} from "@/components";
import { resources } from "@/config/resources";
import { API_URL, authProvider, dataProvider, liveProvider } from "@/providers";
import {
  DashboardPage,
  LoginPage,
  PlatformPage,
  RegisterPage,
  SchedulerPage,
  SocialCalendarPage,
  SocialIndexPage,
  SurveyBuilder,
  SurveyFill,
} from "@/routes";

import BillingPage from "./routes/billing";

import "@refinedev/antd/dist/reset.css";

const App = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  const resetPassword = async (email: string) => {
    const response = await fetch(`${API_URL}/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to send reset email.");
    }
  };

  return (
    <BrowserRouter>
      <PageTitleUpdater />
      <ConfigProvider theme={RefineThemes.Purple}>
        <AntdApp>
          {/* <DevtoolsProvider> */}
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            liveProvider={liveProvider}
            notificationProvider={useNotificationProvider}
            authProvider={authProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              liveMode: "auto",
              useNewQueryKeys: true,
            }}
          >
            <Routes>
              {/* Public/free routes - no authentication */}
              <Route
                path="/free"
                element={
                  <Layout isTourOpen={isTourOpen} setIsTourOpen={setIsTourOpen}>
                    <Outlet />
                  </Layout>
                }
              >
                <Route
                  index
                  element={
                    <DashboardPage
                      isTourOpen={isTourOpen}
                      setIsTourOpen={setIsTourOpen}
                    />
                  }
                />
                <Route path="billing" element={<BillingPage />} />
                <Route path="social" element={<SocialIndexPage />} />
                <Route
                  path="social/instagram"
                  element={<PlatformPage platform="instagram" />}
                />
                <Route
                  path="social/facebook"
                  element={<PlatformPage platform="facebook" />}
                />
                <Route
                  path="social/linkedin"
                  element={<PlatformPage platform="linkedin" />}
                />
                <Route
                  path="social/tiktok"
                  element={<PlatformPage platform="tiktok" />}
                />
                {/* <Route path="social/scheduler" element={<SchedulerPage />} /> */}
                                <Route path="social/calendar" element={<SocialCalendarPage />} />
                                <Route path="survey-builder" element={<SurveyBuilder />} />
                                <Route path="survey-fill/:encodedSurveyData" element={<SurveyFill />} />
                                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* Authenticated routes */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout
                      isTourOpen={isTourOpen}
                      setIsTourOpen={setIsTourOpen}
                    >
                      <AuthWrapper>
                        <Outlet />
                      </AuthWrapper>
                    </Layout>
                  </Authenticated>
                }
              >
                <Route
                  index
                  element={
                    <DashboardPage
                      isTourOpen={isTourOpen}
                      setIsTourOpen={setIsTourOpen}
                    />
                  }
                />
                <Route path="billing" element={<BillingPage />} />
                <Route path="social" element={<SocialIndexPage />} />
                <Route
                  path="social/instagram"
                  element={<PlatformPage platform="instagram" />}
                />
                <Route
                  path="social/facebook"
                  element={<PlatformPage platform="facebook" />}
                />
                <Route
                  path="social/linkedin"
                  element={<PlatformPage platform="linkedin" />}
                />
                <Route
                  path="social/tiktok"
                  element={<PlatformPage platform="tiktok" />}
                />
                <Route path="social/scheduler" element={<SchedulerPage />} />
                <Route
                  path="social/calendar"
                  element={<SocialCalendarPage />}
                />
                <Route path="survey-builder" element={<SurveyBuilder />} />
                <Route path="survey-fill/:encodedSurveyData" element={<SurveyFill />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* Auth pages (login/register/forgot/reset) */}
              <Route
                element={
                  <Authenticated key="authenticated-auth" fallback={<Outlet />}>
                    <Outlet />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPassword onResetRequest={resetPassword} />}
                />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
                <Route path="/redeem" element={<RedeemCode />} />
              </Route>
            </Routes>

            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
          {/* <DevtoolsPanel /> */}
          {/* </DevtoolsProvider> */}
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter>
  );
};

export default App;
