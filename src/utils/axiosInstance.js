import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://retfarmer.org/retfarmer-api/", // URL de ton backend PHP
  withCredentials: true, // 🔥 Permet d'envoyer et recevoir les cookies de session
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
