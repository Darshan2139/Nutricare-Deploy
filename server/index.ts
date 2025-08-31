import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database";
import { handleDemo } from "./routes/demo";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetProfile,
} from "./routes/auth";
import { handleChatMessage, handleGetChatHistory, callGemini } from "./routes/chatbot";
import {
  handleFindNearbyHospitals,
  handleGetHospitalDetails,
  handleGeocodeAddress,
} from "./routes/hospitals";
import { requireAuth } from "./middleware/auth";
import healthRoutes from "./routes/health";
import plansRoutes from "./routes/plans";
import uploadsRoutes from "./routes/uploads";
import usersRoutes from "./routes/users";
import analyticsRoutes from "./routes/analytics";

export function createServer() {
  const app = express();

  // Connect DB with provided URI or env
  const mongoUri = process.env.MONGO_URI || "mongodb+srv://Nutricare:Nutricare@nc.5phuf38.mongodb.net/?retryWrites=true&w=majority&appName=NC";
  connectDatabase(mongoUri).catch((e) => {
    console.error("Failed to connect MongoDB", e);
  });

  // CORS configuration
  const corsOptions = {
    origin: [
      'https://nutricare-ai.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:4173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  };
  
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // Handle preflight requests
  app.options('*', cors(corsOptions));

  // Debug middleware to log all requests
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - Origin: ${req.headers.origin}`);
    next();
  });

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "OK" });
  });

  // Test chatbot endpoint
  app.post("/api/chatbot/test", async (req, res) => {
    try {
      const { message } = req.body;
      console.log("Test chatbot request:", message);
      
      const response = await callGemini(message || "What foods are good for pregnancy?");
      console.log("Test response:", response);
      
      res.json({ 
        message: message || "What foods are good for pregnancy?",
        response: response,
        timestamp: new Date()
      });
    } catch (error) {
      console.error("Test chatbot error:", error);
      res.status(500).json({ error: "Test failed" });
    }
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);
  app.post("/api/auth/logout", handleLogout);
  app.get("/api/auth/profile", requireAuth, handleGetProfile);

  // Chatbot routes
  app.post("/api/chatbot/message", handleChatMessage);
  app.get("/api/chatbot/history/:userId", handleGetChatHistory);

  // Emergency/Hospital routes
  app.get("/api/hospitals/nearby", handleFindNearbyHospitals);
  app.get("/api/hospitals/:id", handleGetHospitalDetails);
  app.post("/api/hospitals/geocode", handleGeocodeAddress);

  // Domain routes
  app.use("/api/health", requireAuth, healthRoutes);
  app.use("/api/plans", requireAuth, plansRoutes);
  app.use("/api/uploads", requireAuth, uploadsRoutes);
  app.use("/api/users", requireAuth, usersRoutes);
  app.use("/api/analytics", requireAuth, analyticsRoutes);

  return app;
}
