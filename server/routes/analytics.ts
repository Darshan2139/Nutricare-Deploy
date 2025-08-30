import { Router } from "express";
import { AuthRequest } from "../middleware/auth";
import HealthEntry from "../models/HealthEntry";
import Plan from "../models/Plan";
import MealTracking from "../models/MealTracking";

const router = Router();

// Get dashboard analytics including nutrition score and meal completion
router.get("/dashboard", async (req, res) => {
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

    // Get the most recent health entry
    const latestHealthEntry = await HealthEntry.findOne({ userId })
      .sort({ entryDate: -1 })
      .limit(1);

    // Get the most recent active plan
    const latestPlan = await Plan.findOne({ 
      userId, 
      isActive: true 
    }).sort({ createdAt: -1 });

    // Calculate nutrition score based on health data
    let nutritionScore = 0;
    if (latestHealthEntry) {
      const healthData = latestHealthEntry;
      
      // Calculate score based on various health parameters
      let scoreComponents = 0;
      let totalComponents = 0;

      // Hemoglobin score (normal range: 11.0-15.0 g/dL for pregnant women)
      if (healthData.hemoglobinLevel) {
        totalComponents++;
        if (healthData.hemoglobinLevel >= 11.0 && healthData.hemoglobinLevel <= 15.0) {
          scoreComponents += 1;
        } else if (healthData.hemoglobinLevel >= 10.0 && healthData.hemoglobinLevel < 11.0) {
          scoreComponents += 0.7;
        } else if (healthData.hemoglobinLevel > 15.0 && healthData.hemoglobinLevel <= 16.0) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.3;
        }
      }

      // Blood sugar score (normal range: 70-100 mg/dL)
      if (healthData.bloodSugar) {
        totalComponents++;
        if (healthData.bloodSugar >= 70 && healthData.bloodSugar <= 100) {
          scoreComponents += 1;
        } else if (healthData.bloodSugar >= 60 && healthData.bloodSugar < 70) {
          scoreComponents += 0.7;
        } else if (healthData.bloodSugar > 100 && healthData.bloodSugar <= 120) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.3;
        }
      }

      // BMI score (healthy range: 18.5-24.9)
      if (healthData.bmi) {
        totalComponents++;
        if (healthData.bmi >= 18.5 && healthData.bmi <= 24.9) {
          scoreComponents += 1;
        } else if (healthData.bmi >= 17.0 && healthData.bmi < 18.5) {
          scoreComponents += 0.6;
        } else if (healthData.bmi > 24.9 && healthData.bmi <= 29.9) {
          scoreComponents += 0.7;
        } else {
          scoreComponents += 0.4;
        }
      }

      // Vitamin D score (normal range: 30-100 ng/mL)
      if (healthData.vitaminD) {
        totalComponents++;
        if (healthData.vitaminD >= 30 && healthData.vitaminD <= 100) {
          scoreComponents += 1;
        } else if (healthData.vitaminD >= 20 && healthData.vitaminD < 30) {
          scoreComponents += 0.6;
        } else if (healthData.vitaminD > 100 && healthData.vitaminD <= 150) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.3;
        }
      }

      // Calcium score (normal range: 8.5-10.5 mg/dL)
      if (healthData.calcium) {
        totalComponents++;
        if (healthData.calcium >= 8.5 && healthData.calcium <= 10.5) {
          scoreComponents += 1;
        } else if (healthData.calcium >= 8.0 && healthData.calcium < 8.5) {
          scoreComponents += 0.6;
        } else if (healthData.calcium > 10.5 && healthData.calcium <= 11.0) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.3;
        }
      }

      // Iron levels score (serum ferritin normal range: 15-150 ng/mL)
      if (healthData.ironLevels?.serumFerritin) {
        totalComponents++;
        if (healthData.ironLevels.serumFerritin >= 15 && healthData.ironLevels.serumFerritin <= 150) {
          scoreComponents += 1;
        } else if (healthData.ironLevels.serumFerritin >= 10 && healthData.ironLevels.serumFerritin < 15) {
          scoreComponents += 0.6;
        } else if (healthData.ironLevels.serumFerritin > 150 && healthData.ironLevels.serumFerritin <= 200) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.3;
        }
      }

      // Water intake score (recommended: 2.5-3.5 liters for pregnant women)
      if (healthData.waterIntake) {
        totalComponents++;
        if (healthData.waterIntake >= 2.5 && healthData.waterIntake <= 3.5) {
          scoreComponents += 1;
        } else if (healthData.waterIntake >= 2.0 && healthData.waterIntake < 2.5) {
          scoreComponents += 0.7;
        } else if (healthData.waterIntake > 3.5 && healthData.waterIntake <= 4.0) {
          scoreComponents += 0.9;
        } else {
          scoreComponents += 0.4;
        }
      }

      // Sleep score (recommended: 7-9 hours)
      if (healthData.sleepHours) {
        totalComponents++;
        if (healthData.sleepHours >= 7 && healthData.sleepHours <= 9) {
          scoreComponents += 1;
        } else if (healthData.sleepHours >= 6 && healthData.sleepHours < 7) {
          scoreComponents += 0.7;
        } else if (healthData.sleepHours > 9 && healthData.sleepHours <= 10) {
          scoreComponents += 0.8;
        } else {
          scoreComponents += 0.4;
        }
      }

      // Calculate final nutrition score
      if (totalComponents > 0) {
        nutritionScore = Math.round((scoreComponents / totalComponents) * 100);
      }
    }

    // Calculate meal completion data
    let mealCompletionData = {
      totalMeals: 0,
      completedMeals: 0,
      completionRate: 0,
      todayMeals: 0,
      todayCompleted: 0
    };

    if (latestPlan) {
      // Get today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get meal tracking data for the current plan
      const mealTracking = await MealTracking.find({
        userId,
        planId: latestPlan._id
      });

      // Calculate total meals in the plan
      if (latestPlan.weeklyMealPlan) {
        const days = Object.keys(latestPlan.weeklyMealPlan);
        days.forEach(day => {
          const dayMeals = latestPlan.weeklyMealPlan[day];
          if (dayMeals) {
            if (dayMeals.breakfast) mealCompletionData.totalMeals++;
            if (dayMeals.lunch) mealCompletionData.totalMeals++;
            if (dayMeals.dinner) mealCompletionData.totalMeals++;
            if (dayMeals.snacks && Array.isArray(dayMeals.snacks)) {
              mealCompletionData.totalMeals += dayMeals.snacks.length;
            }
          }
        });
      }

      // Calculate completed meals
      mealCompletionData.completedMeals = mealTracking.filter(meal => meal.isCompleted).length;

      // Calculate today's meals
      const todayMeals = mealTracking.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate.getTime() === today.getTime();
      });

      mealCompletionData.todayMeals = todayMeals.length;
      mealCompletionData.todayCompleted = todayMeals.filter(meal => meal.isCompleted).length;

      // Calculate completion rate
      if (mealCompletionData.totalMeals > 0) {
        mealCompletionData.completionRate = Math.round((mealCompletionData.completedMeals / mealCompletionData.totalMeals) * 100);
      }
    }

    // Get recent health entries for trends
    const recentHealthEntries = await HealthEntry.find({ userId })
      .sort({ entryDate: -1 })
      .limit(5)
      .select('entryDate weight bmi hemoglobinLevel bloodSugar');

    res.json({
      success: true,
      data: {
        nutritionScore,
        mealCompletion: mealCompletionData,
        latestHealthEntry: latestHealthEntry ? {
          entryDate: latestHealthEntry.entryDate,
          weight: latestHealthEntry.weight,
          bmi: latestHealthEntry.bmi,
          hemoglobinLevel: latestHealthEntry.hemoglobinLevel,
          bloodSugar: latestHealthEntry.bloodSugar
        } : null,
        latestPlan: latestPlan ? {
          _id: latestPlan._id,
          id: latestPlan._id,
          overallScore: latestPlan.overallScore,
          createdAt: latestPlan.createdAt,
          status: latestPlan.status
        } : null,
        recentHealthEntries,
        hasHealthData: !!latestHealthEntry,
        hasActivePlan: !!latestPlan
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard analytics:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch dashboard analytics",
        code: "ANALYTICS_FETCH_ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

// Mark meal as completed
router.post("/meals/complete", async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const { planId, mealType, mealName, date, notes, caloriesConsumed, nutrientsConsumed } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    if (!planId || !mealType || !mealName || !date) {
      return res.status(400).json({
        success: false,
        error: {
          message: "Missing required fields",
          code: "MISSING_FIELDS"
        }
      });
    }

    // Check if meal tracking already exists for this meal
    const existingTracking = await MealTracking.findOne({
      userId,
      planId,
      mealType,
      date: new Date(date)
    });

    if (existingTracking) {
      // Update existing tracking
      existingTracking.isCompleted = true;
      existingTracking.completedAt = new Date();
      existingTracking.notes = notes;
      existingTracking.caloriesConsumed = caloriesConsumed;
      existingTracking.nutrientsConsumed = nutrientsConsumed;
      await existingTracking.save();
    } else {
      // Create new tracking
      const mealTracking = new MealTracking({
        userId,
        planId,
        mealType,
        mealName,
        date: new Date(date),
        isCompleted: true,
        completedAt: new Date(),
        notes,
        caloriesConsumed,
        nutrientsConsumed
      });
      await mealTracking.save();
    }

    res.json({
      success: true,
      message: "Meal marked as completed successfully"
    });

  } catch (error) {
    console.error("Error marking meal as completed:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to mark meal as completed",
        code: "MEAL_COMPLETION_ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

// Get meal tracking for a specific date range
router.get("/meals/tracking", async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    const { startDate, endDate, planId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: {
          message: "User not authenticated",
          code: "UNAUTHORIZED"
        }
      });
    }

    const query: any = { userId };
    
    if (planId) {
      query.planId = planId;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const mealTracking = await MealTracking.find(query)
      .sort({ date: -1, mealType: 1 });

    res.json({
      success: true,
      data: mealTracking
    });

  } catch (error) {
    console.error("Error fetching meal tracking:", error);
    res.status(500).json({
      success: false,
      error: {
        message: "Failed to fetch meal tracking",
        code: "MEAL_TRACKING_FETCH_ERROR",
        details: error instanceof Error ? error.message : "Unknown error"
      }
    });
  }
});

export default router;
