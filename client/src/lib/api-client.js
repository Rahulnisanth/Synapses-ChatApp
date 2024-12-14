import { HOST } from "@/utils/constants";
import axios from "axios";

export const api_client = axios.create({
  baseURL: "https://synapses-chat-app-server.vercel.app",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
