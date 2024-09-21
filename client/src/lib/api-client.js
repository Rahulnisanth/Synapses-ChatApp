import { HOST } from "@/utils/constants";
import axios from "axios";

export const api_client = axios.create({
  baseURL: HOST,
  withCredentials: true,
});
