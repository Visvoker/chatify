import mongoose, { Schema } from "mongoose";
import { MessageDoc } from "../type/message.js";

const messageSchema = new Schema<MessageDoc>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 2000 },
    image: { type: String },
  },
  { timestamps: true }
);

const Message = mongoose.model<MessageDoc>("Message", messageSchema);

export default Message;
