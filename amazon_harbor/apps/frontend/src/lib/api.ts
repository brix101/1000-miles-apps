import useBoundStore from "@/hooks/useBoundStore";
import axios from "axios";

const state = useBoundStore.getInitialState();

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// // Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Retrieve the JSON object from localStorage
    const storedStateString = localStorage.getItem("amazon-harbor");
    const storedState = storedStateString
      ? JSON.parse(storedStateString)
      : null;

    const accessToken = storedState?.state?.auth?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const accessToken = response.headers["x-access-token"];
    if (accessToken) {
      state.setAccessToken(accessToken);
    }
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Check if the error is due to an expired token
    if (error.response && error.response.status === 401) {
      // Refresh the access token
      try {
        const response = await axios.post(
          error.response.config.baseURL + "/auth/refresh",
          {}
        );

        if (response.data) {
          error.config.headers.Authorization = `Bearer ${response.data.accessToken}`;
          state.setAuthUser(response.data);
        }

        return error;
      } catch (refreshError) {
        // Handle errors that occurred during token refresh
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
