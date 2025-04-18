import { BrowserRouter, Outlet, Route, Routes } from "react-router";

import { RefineThemes, useNotificationProvider } from "@refinedev/antd";
import { Authenticated, ErrorComponent, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import routerProvider, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";

import { App as AntdApp, ConfigProvider } from "antd";

import {
  Layout,
  PageTitleUpdater,
  AuthWrapper,
  ForgotPassword,
  ResetPassword,
  RedeemCode,
} from "@/components";
import { resources } from "@/config/resources";
import { API_URL, authProvider, dataProvider, liveProvider } from "@/providers";
import {
  CompanyCreatePage,
  CompanyEditPage,
  CompanyListPage,
  DashboardPage,
  LoginPage,
  RegisterPage,
  TasksCreatePage,
  TasksEditPage,
  TasksListPage,
} from "@/routes";
import "@refinedev/antd/dist/reset.css";
import BillingPage from "./routes/billing";

const App = () => {
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
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="*" element={<ErrorComponent />} />
              </Route>

              {/* Authenticated routes */}
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login" />}
                  >
                    <Layout>
                      <AuthWrapper>
                        <Outlet />
                      </AuthWrapper>
                    </Layout>
                  </Authenticated>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="billing" element={<BillingPage />} />
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
