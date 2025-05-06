import { useState, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../constant";

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
        setError(err.response?.data?.message || err.message || "Unknown error");
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
