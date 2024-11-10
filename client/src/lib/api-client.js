import { HOST } from "@/utils/constants";
import axios from "axios";

export const api_client = axios.create({
  baseURL: HOST || "https://synapses-server-api.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
