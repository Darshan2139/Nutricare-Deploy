import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Download, 
  Share, 
  Calendar, 
  Target, 
  TrendingUp, 
  Apple, 
  Pill, 
  AlertTriangle, 
  CheckCircle,
  Heart,
  Utensils,
  Clock,
  FileText
} from "lucide-react";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import { toast } from "sonner";
import { downloadDietPlan, downloadDietPlanAsText } from "@/utils/dietPlanPDF";

export default function DietPlanResults() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get diet plan data from navigation state
  const { dietPlan, healthData } = location.state || {};

  useEffect(() => {
    if (!dietPlan) {
      toast.error("No diet plan data found");
      navigate("/manual-health-entry");
    }
  }, [dietPlan, navigate]);

  if (!dietPlan) {
    return null;
  }

  const handleSyncToMealPlan = () => {
    // Store diet plan in localStorage for Dashboard to read
    localStorage.setItem('generatedDietPlan', JSON.stringify(dietPlan));
    localStorage.setItem('dietPlanSyncDate', new Date().toISOString());

    toast.success("Diet plan synced to your meal plan!");
    navigate("/dashboard?tab=meal-plan");
  };

  const handleSavePlan = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error("Please log in to save your diet plan");
        return;
      }

      const response = await fetch(`${API_BASE}/plans/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietPlan),
      });

      if (response.ok) {
        toast.success("Diet plan saved successfully!");
      } else {
        toast.error("Failed to save diet plan");
      }
    } catch (error) {
      toast.error("Error saving diet plan");
    }
  };

  const handleDownloadPlan = () => {
    try {
      // Prepare diet plan data for PDF
      const pdfData = {
        ...dietPlan,
        healthData: {
          age: healthData?.age,
          height: healthData?.height,
          weight: healthData?.weight,
          trimester: healthData?.trimester,
          dietPreference: healthData?.dietPreference
        }
      };
      
      // Try PDF first, fallback to text if PDF fails
      const pdfSuccess = downloadDietPlan(pdfData);
      if (pdfSuccess) {
        toast.success("Diet plan PDF downloaded successfully!");
      } else {
        // Fallback to text download
        const textSuccess = downloadDietPlanAsText(pdfData);
        if (textSuccess) {
          toast.success("Diet plan downloaded as text file!");
        } else {
          toast.error("Failed to download diet plan");
        }
      }
    } catch (error) {
      console.error("Error downloading diet plan:", error);
      toast.error("Failed to download diet plan");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center">
                <NutriCareLogo size="sm" />
                <span className="ml-2 text-lg font-bold text-rose-900 font-quicksand">
                  NutriCare
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleDownloadPlan}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Plan
              </Button>
              <Button
                onClick={handleSavePlan}
                variant="outline"
                size="sm"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                Save Plan
              </Button>
              <Button
                onClick={handleSyncToMealPlan}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Sync to Meal Plan
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-4xl font-bold text-rose-900 mb-3">
              Your Personalized Diet Plan
            </h1>
            <p className="text-rose-700 text-lg">
              AI-generated nutrition plan based on your health data
            </p>
            <p className="text-rose-600 text-sm mt-2">
              Generated on {new Date(dietPlan.generatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Overall Health Score */}
        <Card className="mb-8 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-purple-900 text-xl">
              <Target className="h-6 w-6 mr-3" />
              Overall Health Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-5xl font-bold text-purple-900 mb-2">
                  {dietPlan.overallScore}/100
                </div>
                <p className="text-purple-700 text-lg">Health Score</p>
                <p className="text-purple-600 text-sm mt-1">
                  Based on your manual health data entry
                </p>
              </div>
              <div className="w-32 h-32 relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-purple-200"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(dietPlan.overallScore * 352) / 100} 352`}
                    className="text-purple-600"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-900">
                    {dietPlan.overallScore}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different sections */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/80 backdrop-blur-sm border border-rose-100 grid grid-cols-4 w-full">
            <TabsTrigger value="overview" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Health Insights
            </TabsTrigger>
            <TabsTrigger value="meal-plan" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Weekly Meal Plan
            </TabsTrigger>
            <TabsTrigger value="supplements" className="data-[state=active]:bg-rose-500 data-[state=active]:text-white">
              Supplements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Key Recommendations */}
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-rose-900">
                    <Target className="h-5 w-5 mr-2" />
                    Key Recommendations
                  </CardTitle>
                  <CardDescription>Priority actions for optimal nutrition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.recommendations && Array.isArray(dietPlan.recommendations) ? (
                      dietPlan.recommendations.map((recommendation: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-rose-50 rounded-lg"
                        >
                          <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-rose-800 text-sm flex-1">
                            {recommendation}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-rose-600">
                        No recommendations available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-rose-900">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Diet Plan Summary
                  </CardTitle>
                  <CardDescription>Your personalized nutrition approach</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800 font-medium">Recommended Supplements</span>
                      <Badge className="bg-green-100 text-green-800">
                        {dietPlan.supplements && Array.isArray(dietPlan.supplements) ? dietPlan.supplements.length : 0} items
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Meal Plan Duration</span>
                      <Badge className="bg-blue-100 text-blue-800">7 days</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-800 font-medium">Dietary Restrictions</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {dietPlan.restrictions && Array.isArray(dietPlan.restrictions) ? dietPlan.restrictions.length : 0} items
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Health Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-900">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Health Strengths
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Areas where you're doing well
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.nutritionalInsights?.strengths && Array.isArray(dietPlan.nutritionalInsights.strengths) ? (
                      dietPlan.nutritionalInsights.strengths.map((strength: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-white/70 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-800 text-sm">{strength}</span>
                      </div>
                    ))
                    ) : (
                      <div className="text-center py-4 text-green-600">
                        No strengths data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Concerns */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-orange-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Areas of Concern
                  </CardTitle>
                  <CardDescription className="text-orange-700">
                    Areas that need attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.nutritionalInsights?.concerns && Array.isArray(dietPlan.nutritionalInsights.concerns) ? (
                      dietPlan.nutritionalInsights.concerns.map((concern: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-white/70 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-800 text-sm">{concern}</span>
                      </div>
                    ))
                    ) : (
                      <div className="text-center py-4 text-orange-600">
                        No concerns data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Priorities */}
              <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-rose-900">
                    <Target className="h-5 w-5 mr-2" />
                    Priority Actions
                  </CardTitle>
                  <CardDescription className="text-rose-700">
                    Most important steps to take
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.nutritionalInsights?.priorities && Array.isArray(dietPlan.nutritionalInsights.priorities) ? (
                      dietPlan.nutritionalInsights.priorities.map((priority: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-white/70 rounded-lg">
                        <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <span className="text-rose-800 text-sm">{priority}</span>
                      </div>
                    ))
                    ) : (
                      <div className="text-center py-4 text-rose-600">
                        No priorities data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="meal-plan" className="space-y-6">
            <div className="grid gap-6">
              {dietPlan.weeklyMealPlan && typeof dietPlan.weeklyMealPlan === 'object' ? (
                Object.entries(dietPlan.weeklyMealPlan).map(([day, meals]: [string, any]) => (
                <Card key={day} className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-rose-900 capitalize">
                      <Calendar className="h-5 w-5 mr-2" />
                      {day}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      {meals && typeof meals === 'object' ? (
                        Object.entries(meals).map(([mealType, meal]: [string, any]) => (
                        <div key={mealType} className="p-4 bg-rose-50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-3">
                            <Utensils className="h-4 w-4 text-rose-600" />
                            <h4 className="font-medium text-rose-900 capitalize">{mealType}</h4>
                          </div>
                          <h5 className="font-medium text-rose-800 mb-2">{meal.name}</h5>
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="h-3 w-3 text-rose-600" />
                            <span className="text-sm text-rose-700">{meal.calories} calories</span>
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs text-rose-600 font-medium">Key Nutrients:</span>
                            <div className="flex flex-wrap gap-1">
                              {meal.nutrients && Array.isArray(meal.nutrients) ? (
                                meal.nutrients.map((nutrient: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs border-rose-300 text-rose-700">
                                    {nutrient}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-xs text-rose-500">No nutrient data available</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                      ) : (
                        <div className="col-span-3 text-center py-4 text-rose-600">
                          No meals available for this day
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                  <CardContent className="text-center py-8">
                    <p className="text-rose-600">No meal plan data available</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Supplements Tab */}
          <TabsContent value="supplements" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recommended Supplements */}
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-rose-900">
                    <Pill className="h-5 w-5 mr-2" />
                    Recommended Supplements
                  </CardTitle>
                  <CardDescription>Based on your health data analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.supplements && Array.isArray(dietPlan.supplements) ? (
                      dietPlan.supplements.map((supplement: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-rose-50 rounded-lg">
                          <Pill className="h-5 w-5 text-rose-600" />
                          <span className="text-rose-800 font-medium">{supplement}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-rose-600">
                        No supplements recommended at this time
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Dietary Restrictions */}
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-rose-900">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Important Restrictions
                  </CardTitle>
                  <CardDescription>Foods and habits to avoid</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dietPlan.restrictions && Array.isArray(dietPlan.restrictions) ? (
                      dietPlan.restrictions.map((restriction: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                          <span className="text-orange-800 font-medium">{restriction}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-orange-600">
                        No specific restrictions at this time
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={() => navigate("/manual-health-entry")}
            variant="outline"
            className="border-rose-300 text-rose-700 hover:bg-rose-50"
          >
            Enter New Health Data
          </Button>
          <Button
            onClick={handleSyncToMealPlan}
            className="bg-rose-500 hover:bg-rose-600 text-white"
          >
            <Heart className="h-4 w-4 mr-2" />
            Apply This Plan
          </Button>
        </div>
      </div>
    </div>
  );
}

