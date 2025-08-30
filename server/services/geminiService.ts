import { GoogleGenerativeAI } from "@google/generative-ai";
import { ManualHealthEntry } from "@shared/types";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface DietPlanRequest {
  healthData: ManualHealthEntry;
  userPreferences?: {
    cuisinePreference?: string[];
    mealCount?: number;
    calorieTarget?: number;
  };
}

export interface GeneratedDietPlan {
  id: string;
  userId: string;
  healthEntryId: string;
  generatedAt: string;
  overallScore: number;
  recommendations: string[];
  nutritionalInsights: {
    strengths: string[];
    concerns: string[];
    priorities: string[];
  };
  weeklyMealPlan: {
    [day: string]: {
      breakfast?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      lunch?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      dinner?: { name: string; calories: number; nutrients: string[]; ingredients?: string[]; instructions?: string };
      snacks?: Array<{ name: string; calories: number; nutrients: string[]; time: string }>;
    };
  };
  supplements: string[];
  restrictions: string[];
  dailyTargets: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    vitaminD: number;
  };
}

export class GeminiService {
  private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async generateDietPlan(request: DietPlanRequest): Promise<GeneratedDietPlan> {
    try {
      const prompt = this.buildPrompt(request.healthData, request.userPreferences);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response from Gemini
      const dietPlanData = this.parseGeminiResponse(text);
      
      return {
        id: `plan_${Date.now()}`,
        userId: request.healthData.userId,
        healthEntryId: request.healthData.id || "",
        generatedAt: new Date().toISOString(),
        ...dietPlanData
      };
    } catch (error) {
      console.error("Error generating diet plan with Gemini:", error);
      throw new Error("Failed to generate diet plan");
    }
  }

  private buildPrompt(healthData: ManualHealthEntry, userPreferences?: any): string {
    const {
      age,
      height,
      weight,
      bmi,
      trimester,
      hemoglobinLevel,
      bloodSugar,
      bloodPressure,
      medicalHistory,
      vitaminD,
      vitaminB12,
      vitaminA,
      vitaminC,
      calcium,
      ironLevels,
      dietPreference,
      foodAllergies,
      religiousCulturalRestrictions,
      activityLevel,
      sleepHours,
      waterIntake,
      isMultiple,
      multipleType,
      isHighRisk,
      currentSupplements,
      notes
    } = healthData;

    return `You are an expert nutritionist specializing in maternal health and pregnancy nutrition for Gujarati women. Generate a comprehensive, personalized diet plan specifically tailored for Gujarati cuisine and dietary preferences.

IMPORTANT GUJARATI DIETARY CONSIDERATIONS:
- This diet plan is specifically for Gujarati women
- In Gujarat, eggs are considered non-vegetarian
- If user is vegetarian, DO NOT include eggs in any meals
- If user is non-vegetarian, you can include eggs and other non-veg options
- Focus on traditional Gujarati foods and cooking methods
- Include popular Gujarati dishes like dhokla, thepla, kadhi, dal, roti, etc.
- Consider Gujarati meal timing and eating habits

HEALTH PROFILE:
- Age: ${age} years
- Height: ${height} cm, Weight: ${weight} kg, BMI: ${bmi}
- Pregnancy Stage: ${trimester} trimester
- Multiple Pregnancy: ${isMultiple ? `Yes (${multipleType})` : 'No'}
- High Risk: ${isHighRisk ? 'Yes' : 'No'}

MEDICAL DATA:
- Hemoglobin: ${hemoglobinLevel} g/dL (Normal: 11.0-15.0 g/dL)
- Blood Sugar: ${bloodSugar} mg/dL (Normal: 70-100 mg/dL)
- Blood Pressure: ${bloodPressure?.systolic}/${bloodPressure?.diastolic} mmHg
- Medical History: ${medicalHistory?.join(', ') || 'None'}

VITAMIN & MINERAL LEVELS:
- Vitamin D: ${vitaminD} ng/mL (Normal: 30-100 ng/mL)
- Vitamin B12: ${vitaminB12} pg/mL (Normal: 200-900 pg/mL)
- Vitamin A: ${vitaminA} mg/L (Normal: 0.3-0.7 mg/L)
- Vitamin C: ${vitaminC} mg/dL (Normal: 0.4-2.0 mg/dL)
- Calcium: ${calcium} mg/dL (Normal: 8.5-10.5 mg/dL)
- Serum Ferritin: ${ironLevels?.serumFerritin} ng/mL (Normal: 15-150 ng/mL)

DIETARY PREFERENCES:
- Diet Type: ${dietPreference} (IMPORTANT: If vegetarian, NO eggs. If non-vegetarian, can include eggs)
- Food Allergies: ${foodAllergies?.join(', ') || 'None'}
- Religious/Cultural Restrictions: ${religiousCulturalRestrictions?.join(', ') || 'None'}

LIFESTYLE:
- Activity Level: ${activityLevel}
- Sleep: ${sleepHours} hours/night
- Water Intake: ${waterIntake} liters/day
- Current Supplements: ${currentSupplements?.join(', ') || 'None'}

ADDITIONAL NOTES: ${notes || 'None'}

Please generate a comprehensive 7-day Gujarati diet plan in the following JSON format:

{
  "overallScore": 85,
  "recommendations": [
    "Increase iron-rich Gujarati foods like bajra roti, jowar roti, and green leafy vegetables",
    "Include calcium-rich foods like curd, paneer, and sesame seeds"
  ],
  "nutritionalInsights": {
    "strengths": ["Good vitamin D levels", "Adequate water intake"],
    "concerns": ["Low iron levels", "Below optimal calcium"],
    "priorities": ["Iron supplementation", "Calcium-rich diet"]
  },
  "weeklyMealPlan": {
    "monday": {
      "breakfast": {
        "name": "Bajra roti with methi thepla and curd",
        "calories": 320,
        "nutrients": ["Iron", "Folate", "Calcium"],
        "ingredients": ["Bajra flour", "Methi leaves", "Curd", "Ghee", "Spices"],
        "instructions": "Mix bajra flour with methi, make rotis, serve with curd"
      },
      "lunch": {
        "name": "Toor dal with brown rice and bhindi sabzi",
        "calories": 480,
        "nutrients": ["Iron", "Protein", "Folate"],
        "ingredients": ["Toor dal", "Brown rice", "Bhindi", "Onions", "Tomatoes", "Spices"],
        "instructions": "Cook dal with rice, prepare bhindi sabzi with spices"
      },
      "dinner": {
        "name": "Jowar roti with palak paneer",
        "calories": 520,
        "nutrients": ["Protein", "Iron", "Calcium"],
        "ingredients": ["Jowar flour", "Palak", "Paneer", "Onions", "Spices"],
        "instructions": "Make jowar rotis, prepare palak paneer curry"
      },
      "snacks": [
        {
          "name": "Dhokla with green chutney",
          "calories": 180,
          "nutrients": ["Protein", "B-vitamins"],
          "time": "10:00 AM"
        }
      ]
    },
    "tuesday": {
      "breakfast": {
        "name": "Ragi dosa with coconut chutney",
        "calories": 320,
        "nutrients": ["Iron", "Calcium", "Protein"],
        "ingredients": ["Ragi flour", "Rice flour", "Coconut", "Spices"],
        "instructions": "Make ragi dosa batter, prepare coconut chutney"
      },
      "lunch": {
        "name": "Moong dal khichdi with kadhi",
        "calories": 480,
        "nutrients": ["Protein", "Iron", "Probiotics"],
        "ingredients": ["Moong dal", "Rice", "Curd", "Besan", "Spices"],
        "instructions": "Cook khichdi, prepare kadhi with curd and besan"
      },
      "dinner": {
        "name": "Bajra roti with dal fry and salad",
        "calories": 520,
        "nutrients": ["Iron", "Protein", "Fiber"],
        "ingredients": ["Bajra flour", "Mixed dal", "Vegetables", "Spices"],
        "instructions": "Make bajra rotis, prepare dal fry, serve with salad"
      },
      "snacks": [
        {
          "name": "Roasted chana with jaggery",
          "calories": 180,
          "nutrients": ["Protein", "Iron"],
          "time": "10:00 AM"
        }
      ]
    }
  },
  "supplements": [
    "Iron (18mg daily)",
    "Folic acid (400mcg)",
    "Vitamin D (1000 IU)"
  ],
  "restrictions": [
    "Limit caffeine with iron-rich meals",
    "Avoid raw fish",
    "Moderate sodium intake"
  ],
  "dailyTargets": {
    "calories": 2200,
    "protein": 75,
    "iron": 27,
    "calcium": 1000,
    "folate": 600,
    "vitaminD": 600
  }
}

GUJARATI DIETARY GUIDELINES:
1. Focus on traditional Gujarati foods: roti, dal, sabzi, kadhi, thepla, dhokla
2. Include iron-rich Gujarati foods: bajra, jowar, ragi, green leafy vegetables
3. Use calcium-rich foods: curd, paneer, sesame seeds, ragi
4. Include protein sources: dal, legumes, paneer, curd
5. Consider Gujarati meal timing: breakfast (8-9 AM), lunch (1-2 PM), dinner (8-9 PM)
6. Include traditional snacks: dhokla, thepla, roasted chana, fruits
7. Use Gujarati cooking methods: steaming, roasting, slow cooking
8. Include probiotic foods: curd, kadhi, fermented foods
9. Consider seasonal availability of Gujarati vegetables
10. Respect dietary preferences: NO eggs for vegetarians, can include for non-vegetarians

Generate a complete 7-day meal plan with breakfast, lunch, dinner, and 2-3 snacks per day. Make sure all nutritional targets are met and the plan is safe for pregnancy. Include traditional Gujarati dishes and cooking methods.`;
  }

  private parseGeminiResponse(response: string): any {
    try {
      // Extract JSON from the response (Gemini might include markdown formatting)
      const jsonMatch = response.match(/```json\s*([\s\S]*?)\s*```/) || 
                       response.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error("No valid JSON found in response");
      }

      const jsonString = jsonMatch[1] || jsonMatch[0];
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing Gemini response:", error);
      console.log("Raw response:", response);
      
      // Return a fallback diet plan if parsing fails
      return this.getFallbackDietPlan();
    }
  }

  private getFallbackDietPlan(): any {
    return {
      overallScore: 75,
      recommendations: [
        "Increase iron-rich Gujarati foods like bajra roti and green leafy vegetables",
        "Include calcium-rich foods like curd, paneer, and sesame seeds",
        "Maintain adequate protein intake through dal and legumes"
      ],
      nutritionalInsights: {
        strengths: ["Good overall health", "Adequate water intake"],
        concerns: ["May need iron supplementation", "Monitor calcium intake"],
        priorities: ["Iron-rich Gujarati diet", "Calcium supplementation"]
      },
      weeklyMealPlan: {
        monday: {
          breakfast: {
            name: "Bajra roti with methi thepla and curd",
            calories: 320,
            nutrients: ["Iron", "Folate", "Calcium"],
            ingredients: ["Bajra flour", "Methi leaves", "Curd", "Ghee", "Spices"],
            instructions: "Mix bajra flour with methi, make rotis, serve with curd"
          },
          lunch: {
            name: "Toor dal with brown rice and bhindi sabzi",
            calories: 480,
            nutrients: ["Iron", "Protein", "Folate"],
            ingredients: ["Toor dal", "Brown rice", "Bhindi", "Onions", "Tomatoes", "Spices"],
            instructions: "Cook dal with rice, prepare bhindi sabzi with spices"
          },
          dinner: {
            name: "Jowar roti with palak paneer",
            calories: 520,
            nutrients: ["Protein", "Iron", "Calcium"],
            ingredients: ["Jowar flour", "Palak", "Paneer", "Onions", "Spices"],
            instructions: "Make jowar rotis, prepare palak paneer curry"
          },
          snacks: [
            {
              name: "Dhokla with green chutney",
              calories: 180,
              nutrients: ["Protein", "B-vitamins"],
              time: "10:00 AM"
            }
          ]
        },
        tuesday: {
          breakfast: {
            name: "Ragi dosa with coconut chutney",
            calories: 320,
            nutrients: ["Iron", "Calcium", "Protein"],
            ingredients: ["Ragi flour", "Rice flour", "Coconut", "Spices"],
            instructions: "Make ragi dosa batter, prepare coconut chutney"
          },
          lunch: {
            name: "Moong dal khichdi with kadhi",
            calories: 480,
            nutrients: ["Protein", "Iron", "Probiotics"],
            ingredients: ["Moong dal", "Rice", "Curd", "Besan", "Spices"],
            instructions: "Cook khichdi, prepare kadhi with curd and besan"
          },
          dinner: {
            name: "Bajra roti with dal fry and salad",
            calories: 520,
            nutrients: ["Iron", "Protein", "Fiber"],
            ingredients: ["Bajra flour", "Mixed dal", "Vegetables", "Spices"],
            instructions: "Make bajra rotis, prepare dal fry, serve with salad"
          },
          snacks: [
            {
              name: "Roasted chana with jaggery",
              calories: 180,
              nutrients: ["Protein", "Iron"],
              time: "10:00 AM"
            }
          ]
        },
        wednesday: {
          breakfast: {
            name: "Thepla with curd and pickle",
            calories: 320,
            nutrients: ["Iron", "Protein", "Probiotics"],
            ingredients: ["Wheat flour", "Methi", "Curd", "Pickle", "Spices"],
            instructions: "Make thepla with methi, serve with curd and pickle"
          },
          lunch: {
            name: "Rajma dal with jeera rice",
            calories: 480,
            nutrients: ["Protein", "Iron", "Fiber"],
            ingredients: ["Rajma", "Rice", "Cumin", "Spices"],
            instructions: "Cook rajma dal, prepare jeera rice"
          },
          dinner: {
            name: "Bajra roti with aloo sabzi",
            calories: 520,
            nutrients: ["Iron", "Carbohydrates", "Vitamins"],
            ingredients: ["Bajra flour", "Potatoes", "Onions", "Spices"],
            instructions: "Make bajra rotis, prepare aloo sabzi"
          },
          snacks: [
            {
              name: "Fruit chaat with chaat masala",
              calories: 180,
              nutrients: ["Vitamins", "Fiber"],
              time: "10:00 AM"
            }
          ]
        },
        thursday: {
          breakfast: {
            name: "Poha with peanuts and vegetables",
            calories: 320,
            nutrients: ["Iron", "Protein", "Vitamins"],
            ingredients: ["Poha", "Peanuts", "Vegetables", "Spices"],
            instructions: "Prepare poha with peanuts and vegetables"
          },
          lunch: {
            name: "Chana dal with roti and sabzi",
            calories: 480,
            nutrients: ["Protein", "Iron", "Fiber"],
            ingredients: ["Chana dal", "Wheat roti", "Mixed vegetables", "Spices"],
            instructions: "Cook chana dal, make rotis, prepare sabzi"
          },
          dinner: {
            name: "Jowar roti with dal and salad",
            calories: 520,
            nutrients: ["Iron", "Protein", "Vitamins"],
            ingredients: ["Jowar flour", "Mixed dal", "Salad vegetables"],
            instructions: "Make jowar rotis, prepare dal, serve with salad"
          },
          snacks: [
            {
              name: "Roasted makhana with spices",
              calories: 180,
              nutrients: ["Protein", "Iron"],
              time: "10:00 AM"
            }
          ]
        },
        friday: {
          breakfast: {
            name: "Upma with vegetables and coconut",
            calories: 320,
            nutrients: ["Iron", "Protein", "Fiber"],
            ingredients: ["Semolina", "Vegetables", "Coconut", "Spices"],
            instructions: "Prepare upma with vegetables and coconut"
          },
          lunch: {
            name: "Masoor dal with brown rice",
            calories: 480,
            nutrients: ["Protein", "Iron", "Fiber"],
            ingredients: ["Masoor dal", "Brown rice", "Spices"],
            instructions: "Cook masoor dal with brown rice"
          },
          dinner: {
            name: "Bajra roti with paneer sabzi",
            calories: 520,
            nutrients: ["Iron", "Protein", "Calcium"],
            ingredients: ["Bajra flour", "Paneer", "Vegetables", "Spices"],
            instructions: "Make bajra rotis, prepare paneer sabzi"
          },
          snacks: [
            {
              name: "Mixed nuts and dry fruits",
              calories: 180,
              nutrients: ["Protein", "Iron", "Vitamins"],
              time: "10:00 AM"
            }
          ]
        },
        saturday: {
          breakfast: {
            name: "Idli with sambar and chutney",
            calories: 320,
            nutrients: ["Protein", "Iron", "Probiotics"],
            ingredients: ["Rice", "Urad dal", "Sambar", "Coconut chutney"],
            instructions: "Make idli batter, prepare sambar and chutney"
          },
          lunch: {
            name: "Moong dal with roti and sabzi",
            calories: 480,
            nutrients: ["Protein", "Iron", "Vitamins"],
            ingredients: ["Moong dal", "Wheat roti", "Mixed vegetables", "Spices"],
            instructions: "Cook moong dal, make rotis, prepare sabzi"
          },
          dinner: {
            name: "Jowar roti with dal and salad",
            calories: 520,
            nutrients: ["Iron", "Protein", "Fiber"],
            ingredients: ["Jowar flour", "Mixed dal", "Salad vegetables"],
            instructions: "Make jowar rotis, prepare dal, serve with salad"
          },
          snacks: [
            {
              name: "Roasted chana with jaggery",
              calories: 180,
              nutrients: ["Protein", "Iron"],
              time: "10:00 AM"
            }
          ]
        },
        sunday: {
          breakfast: {
            name: "Dosa with potato filling and chutney",
            calories: 320,
            nutrients: ["Iron", "Protein", "Carbohydrates"],
            ingredients: ["Rice", "Urad dal", "Potatoes", "Coconut chutney"],
            instructions: "Make dosa batter, prepare potato filling and chutney"
          },
          lunch: {
            name: "Toor dal with jeera rice and sabzi",
            calories: 480,
            nutrients: ["Protein", "Iron", "Fiber"],
            ingredients: ["Toor dal", "Rice", "Cumin", "Mixed vegetables", "Spices"],
            instructions: "Cook toor dal, prepare jeera rice and sabzi"
          },
          dinner: {
            name: "Bajra roti with dal and salad",
            calories: 520,
            nutrients: ["Iron", "Protein", "Vitamins"],
            ingredients: ["Bajra flour", "Mixed dal", "Salad vegetables"],
            instructions: "Make bajra rotis, prepare dal, serve with salad"
          },
          snacks: [
            {
              name: "Fruit chaat with chaat masala",
              calories: 180,
              nutrients: ["Vitamins", "Fiber"],
              time: "10:00 AM"
            }
          ]
        }
      },
      supplements: [
        "Iron (18mg daily)",
        "Folic acid (400mcg)",
        "Vitamin D (1000 IU)"
      ],
      restrictions: [
        "Limit caffeine",
        "Avoid raw fish",
        "Moderate sodium intake"
      ],
      dailyTargets: {
        calories: 2200,
        protein: 75,
        iron: 27,
        calcium: 1000,
        folate: 600,
        vitaminD: 600
      }
    };
  }
}

export const geminiService = new GeminiService();
