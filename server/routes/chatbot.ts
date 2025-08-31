import { RequestHandler } from "express";
import ChatMessageModel from "../models/ChatMessage";
import { AuthRequest } from "../middleware/auth";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyBgqcTUb9JMiYC_pq2A41hjBP3s9a615UE");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const handleChatMessage: RequestHandler = async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const { message } = req.body as { message: string };

    if (!message || !userId) {
      return res.status(400).json({ error: "Message is required" });
    }

    const category = categorizeMessage(message);
    // Allow pregnancy, nutrition, and lactation questions
    if (!(category === "pregnancy" || category === "nutrition" || category === "lactation")) {
      return res.json({
        id: undefined,
        userId,
        message,
        response: "I can only answer pregnancy, nutrition, and lactation-related questions.",
        timestamp: new Date(),
        category: "general",
      });
    }

    const response = await callGemini(message);

    const doc = await ChatMessageModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      message,
      response,
      category,
      timestamp: new Date(),
    });

    res.json({
      id: String(doc._id),
      userId,
      message: doc.message,
      response: doc.response,
      timestamp: doc.timestamp,
      category: doc.category,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
};

export const handleGetChatHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const authUser = (req as AuthRequest).user?.id;
    if (!authUser || authUser !== userId) return res.status(403).json({ error: "Forbidden" });

    const items = await ChatMessageModel.find({ userId }).sort({ createdAt: 1 } as any);
    res.json(
      items.map((i) => ({
        id: String(i._id),
        userId: String(i.userId),
        message: i.message,
        response: i.response,
        timestamp: i.timestamp,
        category: i.category,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: "Failed to get chat history" });
  }
};

async function callGemini(prompt: string): Promise<string> {
  // Enhanced prompt for accurate, concise nutrition advice
  const enhancedPrompt = `You are a certified nutrition expert specializing in pregnancy and lactation. Provide ONLY evidence-based, medically accurate information.

CRITICAL GUIDELINES:
1. Keep responses to EXACTLY 2-3 lines maximum
2. Use **bold text** for key terms only
3. Provide ONLY medically proven facts
4. If unsure about accuracy, say "Consult your healthcare provider"
5. Focus on safety and evidence-based recommendations
6. Avoid speculation or unproven claims
7. Be direct and factual - no lengthy explanations
8. ALWAYS provide a helpful response - never say "I can't help" or similar

User question: ${prompt}

Provide a brief, accurate response (2-3 lines only):`;

  try {
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Ensure we always return a helpful response
    if (!text || text.trim().length === 0) {
      return "**For personalized advice**, consult your healthcare provider. **I provide general guidance only** based on evidence-based nutrition information.";
    }
    
    return text;
  } catch (e) {
    console.error("Gemini error", e);
    return "**For personalized advice**, consult your healthcare provider. **I provide general guidance only** based on evidence-based nutrition information.";
  }
}

function categorizeMessage(message: string): "nutrition" | "pregnancy" | "lactation" | "general" {
  const lower = message.toLowerCase();
  
  // Pregnancy-related keywords
  if (lower.includes("pregnancy") || lower.includes("pregnant") || lower.includes("gestation") || 
      lower.includes("trimester") || lower.includes("fetus") || lower.includes("baby") ||
      lower.includes("delivery") || lower.includes("labor") || lower.includes("birth")) {
    return "pregnancy";
  }
  
  // Lactation-related keywords
  if (lower.includes("breastfeed") || lower.includes("lactation") || lower.includes("milk supply") ||
      lower.includes("nursing") || lower.includes("breast milk") || lower.includes("pumping")) {
    return "lactation";
  }
  
  // Nutrition-related keywords (comprehensive)
  if (lower.includes("nutrition") || lower.includes("food") || lower.includes("eat") ||
      lower.includes("diet") || lower.includes("meal") || lower.includes("supplement") ||
      lower.includes("vitamin") || lower.includes("mineral") || lower.includes("protein") ||
      lower.includes("carbohydrate") || lower.includes("fat") || lower.includes("fiber") ||
      lower.includes("calorie") || lower.includes("nutrient") || lower.includes("caffeine") ||
      lower.includes("coffee") || lower.includes("tea") || lower.includes("alcohol") ||
      lower.includes("fish") || lower.includes("meat") || lower.includes("vegetable") ||
      lower.includes("fruit") || lower.includes("dairy") || lower.includes("milk") ||
      lower.includes("water") || lower.includes("hydration") || lower.includes("iron") ||
      lower.includes("calcium") || lower.includes("folic acid") || lower.includes("folate") ||
      lower.includes("omega") || lower.includes("dha") || lower.includes("epa") ||
      lower.includes("avoid") || lower.includes("safe") || lower.includes("unsafe") ||
      lower.includes("healthy") || lower.includes("unhealthy") || lower.includes("organic") ||
      lower.includes("processed") || lower.includes("raw") || lower.includes("cooked") ||
      // Common food items
      lower.includes("almond") || lower.includes("walnut") || lower.includes("cashew") || lower.includes("peanut") ||
      lower.includes("rice") || lower.includes("bread") || lower.includes("pasta") || lower.includes("potato") ||
      lower.includes("tomato") || lower.includes("carrot") || lower.includes("spinach") || lower.includes("broccoli") ||
      lower.includes("apple") || lower.includes("banana") || lower.includes("orange") || lower.includes("grape") ||
      lower.includes("chicken") || lower.includes("beef") || lower.includes("pork") || lower.includes("lamb") ||
      lower.includes("egg") || lower.includes("cheese") || lower.includes("yogurt") || lower.includes("butter") ||
      lower.includes("sugar") || lower.includes("salt") || lower.includes("oil") || lower.includes("honey") ||
      lower.includes("chocolate") || lower.includes("cake") || lower.includes("cookie") || lower.includes("ice cream") ||
      // Food-related terms
      lower.includes("snack") || lower.includes("breakfast") || lower.includes("lunch") || lower.includes("dinner") ||
      lower.includes("ingredient") || lower.includes("recipe") || lower.includes("cooking") || lower.includes("baking") ||
      lower.includes("fresh") || lower.includes("frozen") || lower.includes("canned") || lower.includes("dried") ||
      lower.includes("spice") || lower.includes("herb") || lower.includes("seasoning") || lower.includes("flavor") ||
      // Health-related food terms
      lower.includes("benefit") || lower.includes("good") || lower.includes("bad") || lower.includes("harmful") ||
      lower.includes("nutritious") || lower.includes("wholesome") || lower.includes("natural") || lower.includes("artificial")) {
    return "nutrition";
  }
  
  return "general";
}
