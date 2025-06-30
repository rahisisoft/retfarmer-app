// utils/axiosInstance.js
import axios from "axios";


// Crée une instance d'Axios
const axiosInstance = axios.create({
  baseURL: "http://localhost/agricore_api/", // ✅ Modifie selon ton API
  //baseURL: "https://retfarmer.org/retfarmer-api/", // ✅ Modifie selon ton API
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour ajouter le token (si présent)
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
