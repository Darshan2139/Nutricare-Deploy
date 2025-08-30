import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Sparkles,
  Download,
  RefreshCw,
  Clock,
  Apple,
  Utensils,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";
import { SmartDietGenerator } from "@/components/SmartDietGenerator";

interface MealPlan {
  day: string;
  meals: {
    type: "breakfast" | "lunch" | "dinner" | "snack";
    time: string;
    name: string;
    ingredients: string[];
    calories: number;
    nutrients: {
      protein: number;
      carbs: number;
      fat: number;
      fiber: number;
      iron: number;
      calcium: number;
      folate: number;
    };
    preparation: string;
  }[];
  totalCalories: number;
  totalNutrients: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    iron: number;
    calcium: number;
    folate: number;
  };
}

export default function DietPlanGenerator() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [weeklyPlan, setWeeklyPlan] = useState<MealPlan[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Mock check for reports - in real app, this would come from user's data
  const [hasReports] = useState(true); // Set to true to show the enhanced experience
  const [reportData] = useState({
    hasBloodTest: true,
    deficiencies: ["iron", "vitamin_d", "folate"],
    recommendations: ["increase_iron", "add_calcium"],
  });

  const generateDietPlan = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    try {
      // Simulate AI diet plan generation with progress
      const progressSteps = [
        { progress: 20, message: "Analyzing your health profile..." },
        { progress: 40, message: "Processing medical reports..." },
        { progress: 60, message: "Calculating nutritional needs..." },
        { progress: 80, message: "Generating personalized meals..." },
        { progress: 100, message: "Finalizing your diet plan..." },
      ];

      for (const step of progressSteps) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setGenerationProgress(step.progress);
        toast.info(step.message);
      }

      // Mock weekly plan data
      const mockWeeklyPlan: MealPlan[] = [
        {
          day: "Monday",
          meals: [
            {
              type: "breakfast",
              time: "7:00 AM",
              name: "Iron-Rich Spinach Omelet",
              ingredients: [
                "2 large eggs",
                "1 cup fresh spinach",
                "1/4 cup feta cheese",
                "1 slice whole grain toast",
                "1 glass fortified orange juice",
              ],
              calories: 420,
              nutrients: {
                protein: 22,
                carbs: 35,
                fat: 18,
                fiber: 4,
                iron: 4.5,
                calcium: 280,
                folate: 150,
              },
              preparation:
                "Sauté spinach, whisk eggs with feta, cook omelet. Serve with toast and orange juice.",
            },
            {
              type: "snack",
              time: "10:00 AM",
              name: "Greek Yogurt with Berries",
              ingredients: [
                "1 cup Greek yogurt",
                "1/2 cup mixed berries",
                "1 tbsp chopped almonds",
                "1 tsp honey",
              ],
              calories: 180,
              nutrients: {
                protein: 15,
                carbs: 20,
                fat: 4,
                fiber: 3,
                iron: 0.5,
                calcium: 200,
                folate: 25,
              },
              preparation:
                "Mix yogurt with honey, top with berries and almonds.",
            },
            {
              type: "lunch",
              time: "1:00 PM",
              name: "Quinoa Power Bowl",
              ingredients: [
                "1 cup cooked quinoa",
                "4 oz grilled chicken breast",
                "1/2 avocado",
                "1/2 cup chickpeas",
                "Mixed greens",
                "Lemon-tahini dressing",
              ],
              calories: 520,
              nutrients: {
                protein: 35,
                carbs: 45,
                fat: 18,
                fiber: 12,
                iron: 3.2,
                calcium: 120,
                folate: 180,
              },
              preparation:
                "Combine quinoa, chicken, and vegetables. Drizzle with dressing.",
            },
            {
              type: "snack",
              time: "4:00 PM",
              name: "Apple with Almond Butter",
              ingredients: ["1 medium apple", "2 tbsp almond butter"],
              calories: 190,
              nutrients: {
                protein: 6,
                carbs: 25,
                fat: 12,
                fiber: 5,
                iron: 0.8,
                calcium: 60,
                folate: 8,
              },
              preparation: "Slice apple and serve with almond butter.",
            },
            {
              type: "dinner",
              time: "7:00 PM",
              name: "Salmon with Sweet Potato",
              ingredients: [
                "5 oz baked salmon",
                "1 medium roasted sweet potato",
                "1 cup steamed broccoli",
                "1/2 cup brown rice",
              ],
              calories: 480,
              nutrients: {
                protein: 35,
                carbs: 50,
                fat: 15,
                fiber: 8,
                iron: 2.1,
                calcium: 180,
                folate: 120,
              },
              preparation:
                "Bake salmon with herbs, roast sweet potato, steam broccoli, cook rice.",
            },
          ],
          totalCalories: 1790,
          totalNutrients: {
            protein: 113,
            carbs: 175,
            fat: 67,
            fiber: 32,
            iron: 11.1,
            calcium: 840,
            folate: 483,
          },
        },
        // Add more days with similar structure...
      ];

      setWeeklyPlan(mockWeeklyPlan);
      setHasGenerated(true);
      toast.success("Your personalized diet plan is ready!");
    } catch (error) {
      toast.error("Failed to generate diet plan. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPlan = () => {
    // Create downloadable content
    const planData = {
      user: user?.name,
      generatedDate: new Date().toLocaleDateString(),
      weeklyPlan,
    };

    const dataStr = JSON.stringify(planData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `nutricare-diet-plan-${new Date().toISOString().split("T")[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success("Diet plan downloaded successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-rose-900 mb-2">
            AI Diet Plan Generator
          </h1>
          <p className="text-rose-700">
            Get your personalized weekly nutrition plan powered by our advanced
            AI model
          </p>
        </div>

        {!hasGenerated ? (
          <SmartDietGenerator hasReports={hasReports} reportData={reportData} />
        ) : (
          <div className="space-y-6">
            {/* Plan Header */}
            <Card className="bg-gradient-to-r from-rose-500 to-lavender-500 text-white">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      Your Personalized Weekly Plan
                    </CardTitle>
                    <CardDescription className="text-white/90 text-lg">
                      Generated specifically for {user?.name} •{" "}
                      {user?.role === "pregnant" ? "Pregnancy" : "Lactation"}{" "}
                      Nutrition
                    </CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={downloadPlan}
                      variant="secondary"
                      className="bg-white text-rose-600 hover:bg-rose-50"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      onClick={generateDietPlan}
                      variant="secondary"
                      className="bg-white text-rose-600 hover:bg-rose-50"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Daily Plans */}
            {weeklyPlan.map((dayPlan, dayIndex) => (
              <Card
                key={dayIndex}
                className="bg-white/80 backdrop-blur-sm border-rose-100"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-rose-900">
                      {dayPlan.day}
                    </CardTitle>
                    <Badge className="bg-sage-500 text-white">
                      {dayPlan.totalCalories} calories
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid lg:grid-cols-4 gap-6">
                    {/* Meals */}
                    <div className="lg:col-span-3 space-y-4">
                      {dayPlan.meals.map((meal, mealIndex) => (
                        <div
                          key={mealIndex}
                          className="bg-rose-50 rounded-lg p-4 border border-rose-100"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-rose-900 capitalize">
                                {meal.type}
                              </h4>
                              <p className="text-sm text-rose-600 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {meal.time}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-peach-300 text-peach-700"
                            >
                              {meal.calories} cal
                            </Badge>
                          </div>

                          <h5 className="font-medium text-rose-800 mb-2">
                            {meal.name}
                          </h5>

                          <div className="mb-3">
                            <p className="text-sm font-medium text-rose-700 mb-1">
                              Ingredients:
                            </p>
                            <ul className="text-sm text-rose-600 space-y-0.5">
                              {meal.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-rose-300 rounded-full mr-2"></span>
                                  {ingredient}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-white rounded p-3">
                            <p className="text-sm font-medium text-rose-700 mb-1">
                              Preparation:
                            </p>
                            <p className="text-sm text-rose-600">
                              {meal.preparation}
                            </p>
                          </div>

                          <div className="grid grid-cols-4 gap-2 mt-3">
                            <div className="text-center">
                              <div className="text-sm font-medium text-sage-700">
                                {meal.nutrients.protein}g
                              </div>
                              <div className="text-xs text-sage-600">
                                Protein
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-sage-700">
                                {meal.nutrients.iron}mg
                              </div>
                              <div className="text-xs text-sage-600">Iron</div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-sage-700">
                                {meal.nutrients.calcium}mg
                              </div>
                              <div className="text-xs text-sage-600">
                                Calcium
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-sm font-medium text-sage-700">
                                {meal.nutrients.folate}mcg
                              </div>
                              <div className="text-xs text-sage-600">
                                Folate
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Daily Summary */}
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sage-900 text-lg">
                            Daily Totals
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sage-700">Calories</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalCalories}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sage-700">Protein</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalNutrients.protein}g
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sage-700">Iron</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalNutrients.iron}mg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sage-700">Calcium</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalNutrients.calcium}mg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sage-700">Folate</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalNutrients.folate}mcg
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sage-700">Fiber</span>
                            <span className="font-medium text-sage-900">
                              {dayPlan.totalNutrients.fiber}g
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="border-rose-300 text-rose-700 hover:bg-rose-50"
                >
                  Back to Dashboard
                </Button>
              </Link>
              <Button
                onClick={() => navigate("/meal-tracking")}
                className="bg-sage-500 hover:bg-sage-600"
              >
                <Apple className="h-4 w-4 mr-2" />
                Start Meal Tracking
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
