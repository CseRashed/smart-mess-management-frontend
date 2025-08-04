import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const useAxios = () => {
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API,
  });

  // ✅ Request interceptor – প্রতিবার নতুন টোকেন add
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response interceptor – যদি token invalid হয় (401, 403), তখন redirect
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/unauthorized');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
