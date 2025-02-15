import type { AuthProvider } from "@refinedev/core";

import {
  API_URL,
  BASE_URL,
  dataProvider,
  GRAPH_QL_URL,
  httpProvider,
} from "../data";

/**
 * For demo purposes and to make it easier to test the app, you can use the following credentials:
 */
export const authCredentials = {
  email: "",
  password: "",
};

export const authProvider: AuthProvider = {
  register: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: GRAPH_QL_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password },
          rawQuery: `
            mutation Register($email: String!, $password: String!) {
              register(registerInput: { email: $email, password: $password }) {
                accessToken
                user {
                  id
                  email
                }
              }
            }
          `,
        },
      });

      const account = data?.register;
      if (!account) throw new Error("Registration failed");

      const registered = {
        id: account.user.id,
        email: account.user.email,
        subscription: {
          plan: "monthly",
        },
        amount: 1500,
      };

      localStorage.setItem("access_token", account.accessToken);
      localStorage.setItem("user", JSON.stringify(account.user));

      // Call backend to create Stripe Checkout session
      const stripeResponse = await httpProvider.custom(
        `${API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registered),
        },
      );

      if (!stripeResponse.ok)
        throw new Error("Failed to create Stripe checkout session");

      const stripeData = await stripeResponse.json();

      if (!stripeData?.url) throw new Error("Stripe checkout URL not received");

      localStorage.setItem("stripe_session_id", stripeData.id);

      // Redirect user to Stripe Checkout
      window.location.href = stripeData.url;

      return {
        success: true,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          message: e?.message || "Registration failed",
          name: "Invalid registration details",
        },
      };
    }
  },
  login: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: GRAPH_QL_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password }, // ✅ Include password
          rawQuery: `
            mutation Login($email: String!, $password: String!) {
              login(loginInput: { email: $email, password: $password }) {
                accessToken
                user {
                  id
                  email
                }
              }
            }
          `,
        },
      });

      const account = data?.login;
      const stripeCustomerId = localStorage.getItem("stripe_customer_id");

      if (!account) throw new Error("Login failed");

      if (stripeCustomerId === "null" || !stripeCustomerId)
        throw new Error("Have not completed sign up");

      localStorage.setItem("access_token", account.accessToken);
      localStorage.setItem("user", JSON.stringify(account.user));

      return {
        success: true,
        redirectTo: `/`,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          message: e?.message || "Login failed",
          name: "Invalid credentials",
        },
      };
    }
  },
  logout: async () => {
    let result = {
      success: false,
      redirectTo: `/`,
    };
    try {
      const user = localStorage.getItem("user");
      const account = user ? JSON.parse(user) : null;

      if (!account) throw new Error("Account does not exist");

      const data = {
        ...account,
        status: "inactive",
      };

      const response = await httpProvider.custom(`${API_URL}/user/update`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        result = {
          success: true,
          redirectTo: `/login`,
        };
      }
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Logout failed",
          name: "name" in error ? error.name : "Unknown error",
        },
      };
    }

    return result;
  },
  onError: async (error) => {
    if (error.statusCode === "UNAUTHENTICATED") {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      // await dataProvider.custom({
      //   url: API_URL,
      //   method: "post",
      //   headers: {},
      //   meta: {
      //     rawQuery: `
      //               query Me {
      //                   me {
      //                     name
      //                   }
      //                 }
      //           `,
      //   },
      // });

      return {
        authenticated: true,
        redirectTo: `${BASE_URL}/`,
      };
    } catch (error) {
      return {
        authenticated: false,
        redirectTo: `${BASE_URL}/login`,
      };
    }
  },
  getIdentity: async () => {
    const accessToken = localStorage.getItem("access_token");
    const user = localStorage.getItem("user");
    const account = user ? JSON.parse(user) : null;

    try {
      if (!account) {
        throw new Error("User not found");
      }

      const response = await httpProvider.custom(
        `${API_URL}/user/${account.email}`,
        {},
      );

      const data = await response.json();

      const idStr = data.id;
      const idNum = Math.floor(Math.random() * 10 ** 21);

      return { id: idNum, idStr, jwtToken: accessToken, ...data };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Get Identity failed",
          name: "name" in error ? error.name : "Unknown error",
        },
      };
    }
  },
};
