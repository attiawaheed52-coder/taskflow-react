import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, "");

export const API_BASE_URL = configuredBaseUrl || (import.meta.env.DEV ? "http://localhost:3000" : "");

export const api = axios.create({
  baseURL: API_BASE_URL,
});