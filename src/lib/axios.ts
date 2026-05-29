import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { assertPublicEcommerceEndpoint } from "@/lib/endpoints";
import { getStoredToken } from "@/lib/auth-storage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://demoprojectspring-production.up.railway.app/api/v1";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.url) {
    config.url = assertPublicEcommerceEndpoint(config.url);
  }

  const token = getStoredToken();
  if (token) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set("Authorization", `Bearer ${token}`);
    config.headers = headers;
  }

  return config;
});

