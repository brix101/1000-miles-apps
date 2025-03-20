import { env } from "@/env";
import { refreshAcessToken } from "@/services/amz-auth.service";
import axios from "axios";

let accessToken = "";

export const getAccessToken = (): string => {
  return accessToken;
};

const apiSPInstance = axios.create({
  baseURL: "https://sellingpartnerapi-na.amazon.com",
  withCredentials: true,
});

// // Add a request interceptor
apiSPInstance.interceptors.request.use(
  async function (config) {
    // Retrieve the JSON object from localStorage
    const amzAccessToken = getAccessToken();
    if (amzAccessToken === "") {
      accessToken = await refreshAcessToken({
        refreshToken: env.AUTH_REFRESH_TOKEN,
        clientId: env.LWA_APP_ID,
        clientSecret: env.LWA_CLIENT_SECRET,
      }).then((response) => response.access_token);
      config.headers["x-amz-access-token"] = accessToken;
    } else {
      config.headers["x-amz-access-token"] = amzAccessToken;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiSPInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Check if the error is due to an expired token
    if (error.response && [403].includes(error.response.status)) {
      // Refresh the access token
      try {
        accessToken = await refreshAcessToken({
          refreshToken: env.AUTH_REFRESH_TOKEN,
          clientId: env.LWA_APP_ID,
          clientSecret: env.LWA_CLIENT_SECRET,
        }).then((response) => response.access_token);
        // Update the original request with the new access token
        error.config.headers["x-amz-access-token"] = accessToken;
        // Retry the original request
        return apiSPInstance(error.config);
      } catch (refreshError) {
        // Handle errors that occurred during token refresh
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiSPInstance;
