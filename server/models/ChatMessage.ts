import mongoose, { Schema, Document, Types } from "mongoose";

export interface IChatMessage extends Document {
  userId: Types.ObjectId;
  message: string;
  response: string;
  category: "nutrition" | "pregnancy" | "lactation" | "general";
  timestamp: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    category: { type: String, enum: ["nutrition", "pregnancy", "lactation", "general"], default: "general" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);