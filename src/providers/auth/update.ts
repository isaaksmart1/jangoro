import { generateStripeCustomerId } from "@/utilities/helper";
import {
  API_URL,
  BASE_URL,
  dataProvider,
  GRAPH_QL_URL,
  httpProvider,
} from "../data";

export const updateProvider: any = {
  onCheckoutSuccess: async ({ email, password }) => {
    const subscriptionInterval = localStorage.getItem(
      "stripe_subscription_interval",
    );
    if (subscriptionInterval === "life") {
      // Get a redemption code
      const response = await fetch(`${API_URL}/user/redeem/get`);
      const { code } = await response.json();
      // Redirect to redemption page
      if (code) {
        window.location.href = `${BASE_URL}/redeem?code=${encodeURIComponent(code)}`;
      }
      return;
    } else if (subscriptionInterval === "paid") return;

    const { data } = await dataProvider.custom({
      url: GRAPH_QL_URL,
      method: "post",
      headers: {},
      meta: {
        variables: { email, password, subscription: subscriptionInterval },
        rawQuery: `
                mutation Register($email: String!, $password: String!, $subscription: String!) {
                  register(registerInput: { email: $email, password: $password, subscription: $subscription }) {
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

    localStorage.setItem("access_token", account.accessToken);
    localStorage.setItem("user", JSON.stringify(account.user));

    return true;
  },
  redeemRegistration: async ({ email, password }) => {
    try {
      const { data } = await dataProvider.custom({
        url: GRAPH_QL_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email, password, subscription: "life" },
          rawQuery: `
          mutation Register($email: String!, $password: String!, $subscription: String!) {
            register(registerInput: { email: $email, password: $password, subscription: $subscription }) {
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

      localStorage.setItem("access_token", account.accessToken);
      localStorage.setItem("user", JSON.stringify(account.user));

      const stripeCustomerId = generateStripeCustomerId();

      return {
        user: account,
        stripeCustomerId,
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Redemption failed",
          name: "name" in error ? error.name : "Unknown error",
        },
      };
    }
  },
  updateIdentity: async (user: any) => {
    try {
      if (user) {
        const response = await httpProvider.custom(`${API_URL}/user/update`, {
          method: "post",
          body: JSON.stringify(user),
        });

        const result = await response.json();

        const idStr = user.id;
        const idNum = Math.floor(Math.random() * 10 ** 21);

        const account = { ...user, id: idNum, idStr };

        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
        localStorage.setItem("user", JSON.stringify(account));
      }
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Update failed",
          name: "name" in error ? error.name : "Unknown error",
        },
      };
    }
  },
};
