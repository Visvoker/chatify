// types/chat.ts
export type MongoId = string;

export type UserDTO = {
  _id: MongoId;
  email: string;
  fullName: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ChatPartnerDTO = UserDTO & {
  lastMessageAt: string;
  lastMessageText?: string;
  lastMessageImage?: string;
  lastMessageSenderId?: string;
};

export type MessageDTO = {
  _id: MongoId;
  senderId: MongoId;
  receiverId: MongoId;
  text?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ActiveTab = "chats" | "contacts";

export type SendMessagePayload = {
  text?: string;
  image?: string | null;
};
