import type { Types } from "mongoose";

export type UserDoc = {
  _id: Types.ObjectId;
  email: string;
  fullName: string;
  password: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
};
