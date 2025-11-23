import { useEffect, useState } from "react";
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
import { addRemoveNotification } from "./utilities/helper";

const App = () => {
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    platformUpdates();
  }, []);

  const fetchUsageStats = async (user: any) => {
    try {
      if (!user?.id) {
        console.error("User ID is not available for fetching usage stats.");
        return;
      }
      const response = await fetch(`${API_URL}/ai-queries/${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch usage stats");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching usage stats:", error);
    }
  };

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

  const platformUpdates = async () => {
    const user = await authProvider.getIdentity();
    if (!user) return;

    // Get metrics
    const usage = await fetchUsageStats(user);

    // Fetch notifications
    const notifications = await JSON.parse(
      localStorage.getItem("notifications") || "[]",
    );
    const templates = {
      usage: "You have used up all of your AI credits! Top-Up.",
    };

    let payload = {
      id: "",
      text: "",
      page: "",
    };

    if (usage.usage >= 0) {
      payload.text = templates.usage;
      payload.page = `${window.location.origin}/billing`;

      // Find existing notification index
      const existingIndex = notifications.findIndex(
        (n: any) => n.text === payload.text,
      );

      // Store the index as payload.id (or random integer if not found)
      payload.id =
        existingIndex !== -1
          ? existingIndex
          : Math.floor(Math.random() * (10 ^ 6));

      // Push the new notification
      const response = await addRemoveNotification(payload, "push");
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
                <Route
                  path="social/calendar"
                  element={<SocialCalendarPage />}
                />
                <Route path="survey-builder" element={<SurveyBuilder />} />
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

              <Route
                path="survey-fill/:encodedSurveyData"
                element={<SurveyFill />}
              />
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
