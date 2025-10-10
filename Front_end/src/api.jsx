import axios from "axios";
import { API_BASE } from "./config";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = token;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;
