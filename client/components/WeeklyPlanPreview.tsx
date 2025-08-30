import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Apple,
  Clock,
  TrendingUp,
  Sparkles,
  Download,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function WeeklyPlanPreview() {
  const { user } = useAuth();

  const todaysMeals = [
    {
      type: "Breakfast",
      time: "7:00 AM",
      name: "Iron-Rich Spinach Omelet",
      calories: 420,
      completed: true,
    },
    {
      type: "Snack",
      time: "10:00 AM",
      name: "Greek Yogurt with Berries",
      calories: 180,
      completed: true,
    },
    {
      type: "Lunch",
      time: "1:00 PM",
      name: "Quinoa Power Bowl",
      calories: 520,
      completed: false,
    },
    {
      type: "Snack",
      time: "4:00 PM",
      name: "Apple with Almond Butter",
      calories: 190,
      completed: false,
    },
    {
      type: "Dinner",
      time: "7:00 PM",
      name: "Salmon with Sweet Potato",
      calories: 480,
      completed: false,
    },
  ];

  const nutritionProgress = {
    calories: { current: 1180, target: 1750, percentage: 67 },
    protein: { current: 45, target: 60, percentage: 75 },
    iron: { current: 12, target: 18, percentage: 67 },
    calcium: { current: 800, target: 1000, percentage: 80 },
  };

  const completedMeals = todaysMeals.filter((meal) => meal.completed).length;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-rose-900 mb-4">
            Today's Nutrition Plan
          </h2>
          <p className="text-lg text-rose-700">
            Your personalized meal plan generated specifically for your{" "}
            {user?.role === "pregnant" ? "pregnancy" : "lactation"} journey
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Meals */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
              <CardHeader>
                <CardTitle className="text-rose-900 flex items-center justify-between">
                  <span className="flex items-center">
                    <Apple className="h-5 w-5 mr-2" />
                    Today's Meals
                  </span>
                  <Badge className="bg-sage-500 text-white">
                    {completedMeals}/{todaysMeals.length} completed
                  </Badge>
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Track your daily nutrition goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todaysMeals.map((meal, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-md ${
                      meal.completed
                        ? "bg-sage-50 border-sage-200 opacity-75"
                        : "bg-rose-50 border-rose-200 hover:border-rose-300"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-rose-900">
                          {meal.name}
                        </h4>
                        <p className="text-sm text-rose-600 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {meal.time} ��� {meal.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className="text-peach-700 border-peach-300"
                        >
                          {meal.calories} cal
                        </Badge>
                        {meal.completed && (
                          <div className="text-sage-600 text-sm mt-1">
                            ✓ Completed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4">
                  <Link to="/dashboard">
                    <Button className="w-full bg-rose-500 hover:bg-rose-600">
                      View Full Meal Plan
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nutrition Summary */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-lavender-50 to-lavender-100 border-lavender-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lavender-900 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Daily Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(nutritionProgress).map(([key, data]) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-lavender-700 capitalize">
                        {key === "calories"
                          ? "Calories"
                          : key === "protein"
                            ? "Protein (g)"
                            : key === "iron"
                              ? "Iron (mg)"
                              : "Calcium (mg)"}
                      </span>
                      <span className="text-lavender-900">
                        {data.current}/{data.target}
                      </span>
                    </div>
                    <Progress
                      value={data.percentage}
                      className="h-2 bg-lavender-200"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-peach-50 to-peach-100 border-peach-200 shadow-xl">
              <CardHeader>
                <CardTitle className="text-peach-900 flex items-center">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/diet-plan-generator">
                  <Button
                    variant="outline"
                    className="w-full border-peach-300 text-peach-700 hover:bg-peach-50"
                  >
                    Generate New Plan
                  </Button>
                </Link>
                <Link to="/chatbot">
                  <Button
                    variant="outline"
                    className="w-full border-peach-300 text-peach-700 hover:bg-peach-50"
                  >
                    Ask AI Nutritionist
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full border-peach-300 text-peach-700 hover:bg-peach-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
