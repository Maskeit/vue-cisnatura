import axios from "axios";
import { V_Global_API } from "./system";

const axiosInstance = axios.create({
  baseURL: V_Global_API,
  withCredentials: true, // Asegúrate de incluir las cookies si son necesarias
});
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;
