import { create } from "zustand";
import toast from "react-hot-toast";

import type { AuthUser, SignupPayload } from "../types/auth";

import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../utils/error";

type AuthStore = {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: SignupPayload) => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("auth/signup", data);
      set({ authUser: res.data });

      toast.success("Account created successfully!");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
