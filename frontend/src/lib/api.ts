import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStore } from "@/store/authStore";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  withCredentials: true,
});


let isRefreshing = false;

let queue: {
  resolve: () => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error?: any) => {
  queue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve();
  });
  queue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;


    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error);
    }

   
    if (originalRequest._retry) {
      authStore.getState().logout();
      return Promise.reject(error);
    }

    
    if (originalRequest.url?.includes("/auth/refresh")) {
      authStore.getState().logout();
      return Promise.reject(error);
    }


    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");

      processQueue();

      return api(originalRequest);
    } catch (err) {
      processQueue(err);

      authStore.getState().logout();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);