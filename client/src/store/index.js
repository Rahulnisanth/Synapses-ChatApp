import { create } from "zustand";
import { create_auth_slice } from "./slices/auth-slice";
import { create_chat_slice } from "./slices/contact-slice";

export const useAppStore = create((set, get) => ({
  ...create_auth_slice(set, get),
  ...create_chat_slice(set, get),
}));
