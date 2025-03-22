import { V1_BASE_URL } from "@/constant/server.constant";
import { useBoundStore } from "@/store";
import axios, { AxiosError } from "axios";

const store = useBoundStore.getState();
const v1ApiClient = axios.create({
  baseURL: V1_BASE_URL,
  withCredentials: true,
});

v1ApiClient.interceptors.request.use((request) => {
  const accessToken = store.auth.accessToken;

  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
  }

  return request;
});

v1ApiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async (error: AxiosError) => {
    // const config = error.config;
    // const accessToken = store.auth.accessToken;

    if (error.response?.status === 401) {
      store.logout();
      // if (accessToken) {
      //   config.headers.Authorization = `Bearer ${accessToken}`;
      // }
      // return axios(config);
    }
    // if (error.response?.status === 401) {
    //   store.logout();
    // }

    return Promise.reject(error);
  }
);

export { v1ApiClient };
