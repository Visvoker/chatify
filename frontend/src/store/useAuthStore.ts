import { create } from "zustand";
import toast from "react-hot-toast";

import type {
  AuthUser,
  LoginPayload,
  SignupPayload,
  UpdateProfilePayload,
} from "../types/auth";

import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../utils/error";

type AuthStore = {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: SignupPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfilePayload) => Promise<void>;
  onlineUsers: string[];
};

export const useAuthStore = create<AuthStore>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  onlineUsers: [],

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

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("auth/login", data);
      set({ authUser: res.data });

      toast.success("Logged in successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
      console.log("Logout error:", error);
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.log("Error in update profile:", error);
    }
  },
}));
