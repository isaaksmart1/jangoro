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
      const plan = localStorage.getItem("plan");

      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      let amount;
      switch (plan) {
        case "month":
          amount = 1500;
          break;
        case "year":
          amount = 9900;
          break;
        case "life":
          amount = 4900;
          break;
        default:
          break;
      }

      const customer = {
        email: email,
        subscription: {
          plan: plan || "month",
        },
        amount,
      };

      // Call backend to create Stripe Checkout session
      const stripeResponse = await httpProvider.custom(
        `${API_URL}/create-payment-intent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(customer),
        },
      );

      if (!stripeResponse.ok)
        throw new Error("Failed to create Stripe checkout session");

      const stripeData = await stripeResponse.json();

      if (!stripeData?.url) throw new Error("Stripe checkout URL not received");

      localStorage.setItem("stripe_session_id", stripeData.id);
      localStorage.setItem("stripe_subscription_interval", stripeData.interval);
      // localStorage.setItem("stripe_subscription_interval", "month");

      // Redirect user to Stripe Checkout
      window.location.href = stripeData.url;

      return {
        // redirectTo: '/login',
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
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

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
      const response = await fetch(
        `${API_URL}/retrieve-customer?email=${encodeURIComponent(email)}`,
      );
      const remoteStripeCustomer = await response.json();
      const stripeCustomerId = localStorage.getItem("stripe_customer_id");

      if (!account) throw new Error("Login failed");

      if (!remoteStripeCustomer.id) {
        if (stripeCustomerId === "null" || !stripeCustomerId)
          throw new Error("Account not found");
      } else {
        localStorage.setItem("stripe_customer_id", remoteStripeCustomer.id);
      }

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
          name: "Invalid credentials",
          message: e?.message || "Login failed",
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
        localStorage.removeItem("email");
        localStorage.removeItem("password");
        localStorage.removeItem("plan");
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

      if (response.status !== 200) return "User not found";

      const data = await response.json();
      localStorage.setItem("plan", data.subscription);

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
