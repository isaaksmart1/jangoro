import type { AuthProvider } from "@refinedev/core";

import type { User } from "@/graphql/schema.types";

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
  email: "jane@mail.com",
  password: "123",
};

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    try {
      const { result } = await dataProvider.custom({
        url: GRAPH_QL_URL,
        method: "post",
        headers: {},
        meta: {
          variables: { email },
          rawQuery: `
            mutation Login($email: String!) {
              login(loginInput: { email: $email }) {
                accessToken
                user {
                  id
                  email
                  name
                  avatarUrl
                  phone
                  jobTitle
                }
              }
            }
          `,
        },
      });

      console.log(result);

      const response = await httpProvider.custom(`${API_URL}/login`, {
        method: "post",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      const idStr = data.id;
      const idNum = Math.floor(Math.random() * 10 ** 21);

      const account = { ...data, id: idNum, idStr };

      localStorage.setItem("access_token", account.jwtToken);
      localStorage.setItem("user", JSON.stringify(account));

      return {
        success: true,
        redirectTo: `/`,
      };
    } catch (e) {
      const error = e as Error;

      return {
        success: false,
        error: {
          message: "message" in error ? error.message : "Login failed",
          name: "name" in error ? error.name : "Invalid email or password",
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
