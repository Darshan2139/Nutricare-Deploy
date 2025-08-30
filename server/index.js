import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || "mongodb+srv://Nutricare:Nutricare@nc.5phuf38.mongodb.net/?retryWrites=true&w=majority&appName=NC";

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Demo endpoint
app.get("/api/demo", (_req, res) => {
  res.json({ message: "NutriCare API is working!" });
});

// Basic auth endpoints (simplified for deployment)
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    
    // Basic validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    // For now, just return success (you can add actual user creation later)
    res.json({ 
      message: "User registered successfully",
      user: { email, name, role }
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    
    // For now, just return success (you can add actual authentication later)
    res.json({ 
      message: "Login successful",
      token: "dummy-token-" + Date.now(),
      user: { email, name: "User" }
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// Protected route example
app.get("/api/auth/profile", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    user: { 
      email: "user@example.com", 
      name: "Test User",
      role: "pregnant"
    }
  });
});

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
  console.log(`Health check: http://localhost:${PORT}/api/ping`);
});
