import axios from "axios";

const axiosInstance = axios.create({
  //baseURL: "https://retfarmer.org/retfarmer-api/", // Change this to your PHP backend URL
  baseURL: "http://localhost/agricore-api/",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // To handle cookies (if required)
});

export default axiosInstance;
