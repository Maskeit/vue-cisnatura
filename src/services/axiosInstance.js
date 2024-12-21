import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://cisnaturatienda.local/api", // Cambia si tienes otra base
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;