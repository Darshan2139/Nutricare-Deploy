import mongoose, { Schema } from "mongoose";
const ChatMessageSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    message: { type: String, required: true },
    response: { type: String, required: true },
    category: { type: String, enum: ["nutrition", "pregnancy", "lactation", "general"], default: "general" },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });
export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);
