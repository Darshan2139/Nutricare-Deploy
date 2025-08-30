import { Router } from "express";
import { geminiService, DietPlanRequest } from "../services/geminiService";
import { ManualHealthEntry } from "@shared/types";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// Generate AI-powered diet plan using Gemini API
router.post("/generate", async (req, res) => {
  try {
    const { healthData, userPreferences } = req.body as {
      healthData: ManualHealthEntry;
      userPreferences?: any;
    };

    if (!healthData) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Health data is required",
          code: "MISSING_HEALTH_DATA"
        }
      });
    }

    // Add user ID from authenticated request
    const authReq = req as AuthRequest;
    const enrichedHealthData = {
      ...healthData,
      userId: authReq.user?.id || healthData.userId
    };

    const request: DietPlanRequest = {
      healthData: enrichedHealthData,
      userPreferences
    };

    console.log("Generating diet plan with Gemini API...");
    const dietPlan = await geminiService.generateDietPlan(request);

    res.json({
      success: true,
      data: dietPlan,
      message: "Diet plan generated successfully"
    });

  } catch (error) {
    console.error("Error generating diet plan:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to generate diet plan",
        code: "GENERATION_FAILED",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

// Get user's diet plans
router.get("/", async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    // TODO: Implement database storage and retrieval
    // For now, return empty array
    res.json({
      success: true,
      data: [],
      message: "No diet plans found"
    });

  } catch (error) {
    console.error("Error fetching diet plans:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch diet plans",
        code: "FETCH_FAILED"
      }
    });
  }
});

// Get specific diet plan
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    // TODO: Implement database retrieval
    res.status(404).json({
      success: false,
      error: {
        message: "Diet plan not found",
        code: "NOT_FOUND"
      }
    });

  } catch (error) {
    console.error("Error fetching diet plan:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch diet plan",
        code: "FETCH_FAILED"
      }
    });
  }
});

// Save diet plan to database
router.post("/save", async (req, res) => {
  try {
    const dietPlanData = req.body;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    // Create new plan in database
    const Plan = require("../models/Plan").default;
    const newPlan = new Plan({
      ...dietPlanData,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedPlan = await newPlan.save();

    res.json({
      success: true,
      data: savedPlan,
      message: "Diet plan saved successfully"
    });

  } catch (error) {
    console.error("Error saving diet plan:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to save diet plan",
        code: "SAVE_FAILED",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

// Delete diet plan
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    // TODO: Implement database deletion
    res.json({
      success: true,
      message: "Diet plan deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting diet plan:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to delete diet plan",
        code: "DELETE_FAILED"
      }
    });
  }
});

export default router;