import axios from "axios";

const apiInstance = axios.create({
  baseURL: "https://sellingpartnerapi-na.amazon.com",
  withCredentials: true,
});

const apiADSInstance = axios.create({
  baseURL: "https://advertising-api.amazon.com",
  withCredentials: true,
});

export { apiADSInstance, apiInstance };
