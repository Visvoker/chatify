import mongoose, { Schema } from "mongoose";
import { UserDoc } from "../type/user.js";

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDoc>("User", userSchema);

export default User;
