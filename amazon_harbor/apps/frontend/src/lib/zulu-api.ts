import axios from "axios";

const zuluApi = axios.create({
  baseURL: "/zulu",
  withCredentials: true,
});

export default zuluApi;
