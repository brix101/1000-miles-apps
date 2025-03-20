import { env } from "@/env";
import { zuluAuthenticate } from "@/services/zulu-authenticate.service";
import axios from "axios";

let sessionId = "";

export const getSessionId = (): string => {
  return sessionId;
};

const apiZuluInstance = axios.create({
  baseURL: `${env.ZULU_LIVE}/api`,
  withCredentials: true,
});

apiZuluInstance.interceptors.request.use(
  async function (config) {
    // Retrieve the JSON object from localStorage
    const zuluSessionId = getSessionId();
    if (zuluSessionId === "") {
      sessionId = await zuluAuthenticate({
        db: env.ZULU_DB,
        login: env.ZULU_LOGIN,
        password: env.ZULU_PASSWORD,
      });
      config.headers.Cookie = `session_id=${sessionId}`;
    } else {
      config.headers.Cookie = `session_id=${sessionId}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

apiZuluInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Check if the error is due to an expired token
    const status = error.response.status;

    if (sessionId === "" && status >= 404 && status < 500) {
      // Refresh the access token
      try {
        sessionId = await zuluAuthenticate({
          db: env.ZULU_DB,
          login: env.ZULU_LOGIN,
          password: env.ZULU_PASSWORD,
        });
        error.config.headers.Cookie = `session_id=${sessionId}`;
        // Retry the original request
        return apiZuluInstance(error.config);
      } catch (refreshError) {
        // Handle errors that occurred during token refresh
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default apiZuluInstance;
