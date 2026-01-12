import { create } from "zustand";
import toast from "react-hot-toast";

import { axiosInstance } from "../lib/axios";
import { getErrorMessage } from "../utils/error";
import type {
  UserDTO,
  MessageDTO,
  ActiveTab,
  SendMessagePayload,
} from "../types/chat";
import { useAuthStore } from "./useAuthStore";

type ChatStore = {
  allContacts: UserDTO[];
  chats: UserDTO[]; // 後端 /messages/chats 的結構（若是 chat rooms，就改成 ChatDTO[]）
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
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: SendMessagePayload) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
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

  getMessagesByUserId: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get<MessageDTO[]>(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(getErrorMessage(error) || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData: SendMessagePayload) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!authUser?._id || !selectedUser?._id) {
      toast.error("Missing sender or receiver");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser?._id,
      receiverId: selectedUser?._id,
      text: messageData.text?.trim() || "",
      image: messageData.image ?? undefined,
      createdAt: new Date().toISOString(),
      isOptimistic: true, // flag to identify optimistic messages (optional)
    };
    // immidetaly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post<MessageDTO>(
        `/messages/send/${selectedUser?._id}`,
        messageData
      );
      set({ messages: messages.concat(res.data) });
    } catch (error) {
      set({ messages: messages });
      toast.error(getErrorMessage(error) || "Something went wrong");
    }
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket?.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");

        notificationSound.currentTime = 0; // reset to start
        notificationSound
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    socket?.off("newMessage");
  },
}));
