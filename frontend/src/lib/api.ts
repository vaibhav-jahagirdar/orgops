import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { authStore } from "@/store/authStore";


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  withCredentials: true,
});


const refreshClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
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
    console.log("---- INTERCEPTOR START ----");

    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    console.log("Error details:", {
      url: originalRequest?.url,
      status: error.response?.status,
      hasResponse: !!error.response,
      message: error.message,
    });


    if (!originalRequest) {
      console.log("No original request → abort");
      return Promise.reject(error);
    }


    if (!error.response) {
      console.log("No response (network/CORS issue)");
      return Promise.reject(error);
    }

 
    if (error.response.status !== 401) {
      console.log("Not 401 → skipping refresh");
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      console.log("Already retried → logout");
      authStore.getState().logout();
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      console.log("Refresh endpoint failed → logout");
      authStore.getState().logout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      console.log("Already refreshing → queueing request");

      return new Promise((resolve, reject) => {
        queue.push({
          resolve: () => {
            console.log("Retrying queued request:", originalRequest.url);
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log("Calling refresh endpoint...");

      const res = await refreshClient.post("/auth/refresh");

      console.log("Refresh success:", res.data);

      processQueue();

      console.log("Retrying original request:", originalRequest.url);
      return api(originalRequest);
    } catch (err) {
      console.log("Refresh failed → logout");

      processQueue(err);
      authStore.getState().logout();

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);