import axios from "axios";
import { V_Global_API, system } from "./system";

const axiosInstance = axios.create({
  baseURL: V_Global_API,
  withCredentials: true, // Asegúrate de incluir las cookies si son necesarias
});
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${system.authToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
