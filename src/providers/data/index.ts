import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider,
} from "@refinedev/nestjs-query";

import { createClient } from "graphql-ws";

import { fetchWrapper } from "./fetch-wrapper";
import { URL_ROUTES } from "@/utilities/config";

export const REFINE_URL = "https://api.crm.refine.dev/graphql";
export const BASE_URL = URL_ROUTES.base;
export const API_URL = URL_ROUTES.api;
export const AI_URL = URL_ROUTES.ai;
export const GRAPH_QL_URL = `${URL_ROUTES.api}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

class httpClient {
  constructor() {}

  custom(url: string, options: RequestInit) {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  }
}

export const client = new GraphQLClient(GRAPH_QL_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          };
        },
      })
    : undefined;

export const dataProvider = graphqlDataProvider(client);
export const httpProvider = new httpClient();

export const liveProvider = wsClient
  ? graphqlLiveProvider(wsClient)
  : undefined;
