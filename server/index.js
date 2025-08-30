import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/database.js";
import { handleDemo } from "./routes/demo.js";
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleGetProfile,
} from "./routes/auth.js";
import { handleChatMessage, handleGetChatHistory } from "./routes/chatbot.js";
import {
  handleFindNearbyHospitals,
  handleGetHospitalDetails,
  handleGeocodeAddress,
} from "./routes/hospitals.js";
import { requireAuth } from "./middleware/auth.js";
import healthRoutes from "./routes/health.js";
import plansRoutes from "./routes/plans.js";
import uploadsRoutes from "./routes/uploads.js";
import usersRoutes from "./routes/users.js";
import analyticsRoutes from "./routes/analytics.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect DB with provided URI or env
const mongoUri = process.env.MONGO_URI || "mongodb+srv://Nutricare:Nutricare@nc.5phuf38.mongodb.net/?retryWrites=true&w=majority&appName=NC";
connectDatabase(mongoUri).catch((e) => {
  console.error("Failed to connect MongoDB", e);
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/ping", (_req, res) => {
  res.json({ message: "OK" });
});

app.get("/api/demo", handleDemo);

// Authentication routes
app.post("/api/auth/register", handleRegister);
app.post("/api/auth/login", handleLogin);
app.post("/api/auth/logout", handleLogout);
app.get("/api/auth/profile", requireAuth, handleGetProfile);

// Chatbot routes
app.post("/api/chatbot/message", requireAuth, handleChatMessage);
app.get("/api/chatbot/history/:userId", requireAuth, handleGetChatHistory);

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

// Serve static files if needed
app.use(express.static('public'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
