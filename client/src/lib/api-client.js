import { HOST } from "@/utils/constants";
import axios from "axios";

const baseURL = HOST || "https://synapses-chat-app-server.vercel.app";

export const api_client = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
