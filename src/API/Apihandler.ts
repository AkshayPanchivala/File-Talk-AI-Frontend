import { useState, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../constant";
import { toast } from "react-toastify";

const apiClient = axios.create({
  baseURL: baseUrl, // 🔁 Change to your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally log errors
    // console.error('[Response Error]', error);
    return Promise.reject(error);
  }
);

const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (method: string, url: string, data: any = null, config = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient({
          method,
          url,
          data,
          ...config,
        });
        return response.data;
      } catch (err: any) {
        console.log("Error", err);
        setError(err.response?.data?.error ||err.response?.data?.message|| err.message || err|| "Unknown error" );
        if(err.response?.data?.error ||err.response?.data?.message|| err.message || err|| "Unknown error"){
           toast.error(
        `Error: ${err.response?.data?.error || err.response?.data?.message || err.message || err || "Unknown error"}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
        }
      );
        }else{
          toast.error(
            `currentely server is down, please try again later`,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: localStorage.getItem("theme") === "dark" ? "dark" : "light",
            }
          );
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { request, loading, error };
};

export default useAxios;
