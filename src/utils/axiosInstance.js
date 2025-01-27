import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://retfarmer.org/retfarmer-api/", // Change this to your PHP backend URL
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // To handle cookies (if required)
});

export default axiosInstance;
