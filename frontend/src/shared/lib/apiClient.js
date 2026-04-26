import axios from "axios";
import { env } from "./env";
import { storage } from "./storage";

export const apiClient = axios.create({
  baseURL: `${env.serverUrl}/api/v1`,
});

apiClient.interceptors.request.use((config) => {
  const token = storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
