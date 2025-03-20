import Axios from "axios";
import { log } from "./logger";

//  __DEV__
//   ? "http://192.168.254.118:5005/api/v1"
//   :

export const BASE_URL = "https://packcenter.1000miles.info/api";

export const api = Axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const { baseURL, url, method } = config;
  log.info(`[${method?.toUpperCase()}] >>> ${baseURL}${url}`);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const res = error.response;

    if (res && res.status >= 400) {
      let message = res.data?.message || error.message;

      if (res.status === 413) {
        message = "The test server has a 1MB limit for uploads.";
      }

      log.error({ message });

      alert(message);
    }
    return Promise.reject(error);
  }
);
