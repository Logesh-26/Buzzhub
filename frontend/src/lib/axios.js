import axios from "axios";


export const axiosInstance = axios.create({
    baseURL: "https://buzzhub-backend-8z53.onrender.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
      },
});