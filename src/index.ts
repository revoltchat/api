import createFetchClient, { ClientOptions, Middleware } from "openapi-fetch";
import type { paths } from "./api.js";

export type * from "./types.js";

export type FetchConfiguration = ClientOptions & {
  /**
   * Specify a bot token to authenticate with Revolt
   */
  botToken?: string;

  /**
   * Specify a session token to authenticate with Revolt
   */
  sessionToken?: string;
};

/**
 * Create a new Fetch client for the API
 * @param config Configuration
 * @returns Fetch client
 */
export function createClient(config?: FetchConfiguration) {
  const client = createFetchClient<paths>({
    baseUrl: "https://revolt.chat/api",
    ...config,
  });

  if (config?.sessionToken || config?.botToken) {
    const authMiddleware: Middleware = {
      async onRequest({ request }) {
        if (config.sessionToken) {
          request.headers.set("X-Session-Token", config.sessionToken);
        }

        if (config.botToken) {
          request.headers.set("X-Bot-Token", config.botToken);
        }

        return request;
      },
    };

    client.use(authMiddleware);
  }

  return client;
}
