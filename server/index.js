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

// User profile endpoints (to fix 405 errors)
app.get("/api/users/me", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    id: "1",
    email: "user@example.com", 
    name: "Test User",
    role: "pregnant",
    profilePhoto: null,
    isProfileComplete: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.put("/api/users/me", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    id: "1",
    email: "user@example.com", 
    name: req.body.name || "Test User",
    role: "pregnant",
    profilePhoto: null,
    isProfileComplete: req.body.isProfileComplete || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.post("/api/users/upload-photo", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    profilePhoto: "https://via.placeholder.com/150",
    message: "Photo uploaded successfully"
  });
});

app.delete("/api/users/photo", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    profilePhoto: null,
    message: "Photo deleted successfully"
  });
});

// Essential endpoints for frontend functionality
app.get("/api/analytics/dashboard", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({
    totalMeals: 12,
    completedMeals: 8,
    healthEntries: 5,
    currentPlan: {
      id: "1",
      name: "Pregnancy Nutrition Plan",
      status: "active"
    },
    recentActivity: [
      { type: "meal", description: "Breakfast logged", time: new Date().toISOString() },
      { type: "health", description: "Weight recorded", time: new Date().toISOString() }
    ]
  });
});

app.get("/api/analytics/meals/tracking", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({
    meals: [
      { id: "1", name: "Breakfast", completed: true, time: "08:00" },
      { id: "2", name: "Lunch", completed: false, time: "12:00" },
      { id: "3", name: "Dinner", completed: false, time: "18:00" }
    ]
  });
});

app.post("/api/analytics/meals/complete", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    message: "Meal marked as completed",
    mealId: req.body.mealId
  });
});

app.get("/api/health/entries", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({
    entries: [
      { id: "1", type: "weight", value: 65, unit: "kg", date: new Date().toISOString() },
      { id: "2", type: "blood_pressure", systolic: 120, diastolic: 80, date: new Date().toISOString() }
    ]
  });
});

app.post("/api/plans/generate", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({
    message: "Diet plan generated successfully",
    plan: {
      id: "plan-" + Date.now(),
      name: "Custom Pregnancy Diet Plan",
      meals: [
        { name: "Breakfast", foods: ["Oatmeal", "Banana", "Milk"] },
        { name: "Lunch", foods: ["Grilled Chicken", "Brown Rice", "Vegetables"] },
        { name: "Dinner", foods: ["Salmon", "Quinoa", "Broccoli"] }
      ],
      recommendations: ["Eat more protein", "Stay hydrated", "Include folate-rich foods"]
    }
  });
});

app.post("/api/plans/save", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({ 
    message: "Diet plan saved successfully",
    planId: "saved-plan-" + Date.now()
  });
});

app.post("/api/chatbot/message", (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  
  res.json({
    message: "AI response",
    response: "Thank you for your message. I'm here to help with your nutrition questions!",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/hospitals/nearby", (req, res) => {
  const { lat, lng, radius } = req.query;
  
  res.json({
    hospitals: [
      {
        id: "1",
        name: "City General Hospital",
        address: "123 Main St, City",
        distance: "2.5 km",
        phone: "+1-555-0123"
      },
      {
        id: "2", 
        name: "Women's Health Center",
        address: "456 Health Ave, City",
        distance: "3.1 km",
        phone: "+1-555-0456"
      }
    ]
  });
});

app.post("/api/hospitals/geocode", (req, res) => {
  res.json({
    lat: 40.7128,
    lng: -74.0060,
    address: "New York, NY, USA"
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
