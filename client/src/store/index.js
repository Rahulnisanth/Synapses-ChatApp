import { create } from "zustand";
import { create_auth_slice } from "./slices/auth-slice";

export const useAppStore = create((set, get) => ({
  ...create_auth_slice(set, get),
}));
