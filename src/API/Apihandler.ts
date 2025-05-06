// import { useState, useCallback } from 'react';
// const BaseUrl = "http://127.0.0.1:8000/api/v1/chatbot/conversation/";

// const useApi = () => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const fetchData = useCallback(async (url:string, options = {}) => {
//     setLoading(true);
//     setError(null);

//     try {
//       // Example interceptor logic: add headers (e.g., auth token)
//       const token = localStorage.getItem('token'); // or useContext/Auth context
//       const defaultHeaders = {
//         'Content-Type': 'application/json',
//       };

//       const response = await fetch(BaseUrl+url, {
//         ...options,
//         headers: {
//           ...defaultHeaders
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }

//       const data = await response.json();
//       return data;
//     } catch (err:any) {
//       setError(err.message || 'Unknown error');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   return { fetchData, loading, error };
// };

// export default useApi;

// useAxios.js
import { useState, useCallback } from "react";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/chatbot/", // 🔁 Change to your base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Optionally log requests
    // console.log('[Request]', config);
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
