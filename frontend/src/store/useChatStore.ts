import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../utils/error";
import type { UserDTO, MessageDTO, ActiveTab } from "../types/chat";

type ChatStore = {
  allContacts: UserDTO[];
  chats: UserDTO[]; // 或你後端 /messages/chats 的結構（若是 chat rooms，就改成 ChatDTO[]）
  messages: MessageDTO[];
  activeTab: ActiveTab;
  selectedUser: UserDTO | null;

  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;

  toggleSound: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedUser: (selectedUser: UserDTO | null) => void;

  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
};

const readSoundEnabled = () => {
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem("isSoundEnabled");
    return raw ? JSON.parse(raw) === true : true;
  } catch {
    return true;
  }
};

export const useChatStore = create<ChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: readSoundEnabled(),

  toggleSound: () => {
    const next = !get().isSoundEnabled;
    try {
      localStorage.setItem("isSoundEnabled", JSON.stringify(next));
    } catch {
      // ignore (private mode / storage full)
    }
    set({ isSoundEnabled: next });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get<UserDTO[]>("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMyChatPartners: async () => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<UserDTO[]>("/messages/chats");
      set({ chats: res.data });
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      set({ isMessagesLoading: false });
    }
  },
}));
