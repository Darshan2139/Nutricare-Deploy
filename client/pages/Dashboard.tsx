import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Upload,
  FileText,
  TrendingUp,
  Apple,
  Calendar,
  Clock,
  Check,
  MessageCircle,
  AlertTriangle,
  Sparkles,
  Play,
  Download,
  Target,
  RefreshCw,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSearchParams } from "react-router-dom";
import { EnhancedNavbar } from "@/components/EnhancedNavbar";
import { API_BASE } from "@/lib/api";
import { downloadDietPlan, downloadDietPlanAsText } from "@/utils/dietPlanPDF";
import { toast } from "sonner";

export default function Dashboard() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasReport, setHasReport] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [syncedDietPlan, setSyncedDietPlan] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [mealLoading, setMealLoading] = useState<string | null>(null);
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Check for synced diet plan
    const savedDietPlan = localStorage.getItem("generatedDietPlan");
    if (savedDietPlan) {
      try {
        const dietPlan = JSON.parse(savedDietPlan);
        setSyncedDietPlan(dietPlan);
      } catch (error) {
        console.error("Error parsing saved diet plan:", error);
      }
    }
  }, [activeTab]);

  // Fetch dashboard analytics data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE}/analytics/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDashboardData(result.data);
        console.log('Dashboard data fetched:', result.data);
      } else {
        console.error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Load existing completed meals from dashboard data
  useEffect(() => {
    if (dashboardData?.mealCompletion) {
      const completed = new Set<string>();
      // Load completed meals from the latest plan
      if (dashboardData.latestPlan && (dashboardData.latestPlan._id || dashboardData.latestPlan.id)) {
        // We'll populate this when we fetch meal tracking data
        const planId = dashboardData.latestPlan._id || dashboardData.latestPlan.id;
        fetchCompletedMeals(planId);
      }
      setCompletedMeals(completed);
    }
  }, [dashboardData]);

  // Fetch completed meals for the current plan
  const fetchCompletedMeals = async (planId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`${API_BASE}/analytics/meals/tracking?planId=${planId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const completedMealTypes = result.data
          .filter((meal: any) => meal.isCompleted)
          .map((meal: any) => meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1));
        
        setCompletedMeals(new Set(completedMealTypes));
      }
    } catch (error) {
      console.error('Error fetching completed meals:', error);
    }
  };

  // Refresh dashboard data when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchDashboardData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleFileUpload = () => {
    // Simulate file upload progress
    setUploadProgress(25);
    setTimeout(() => setUploadProgress(50), 500);
    setTimeout(() => setUploadProgress(75), 1000);
    setTimeout(() => {
      setUploadProgress(100);
      setHasReport(true);
    }, 1500);
  };

  // Handle meal completion
  const handleMealCompletion = async (mealType: string, mealName: string, calories: number) => {
    try {
      setMealLoading(mealType);
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error("Please log in to track meals");
        return;
      }

      // Get the current active plan from dashboard data
      if (!dashboardData?.latestPlan?._id && !dashboardData?.latestPlan?.id) {
        toast.error("No active diet plan found. Please generate a diet plan first.");
        return;
      }

      const planId = dashboardData.latestPlan._id || dashboardData.latestPlan.id;
      
      const response = await fetch(`${API_BASE}/analytics/meals/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: planId,
          mealType: mealType.toLowerCase(),
          mealName: mealName,
          date: new Date().toISOString().split('T')[0],
          notes: "Marked as completed from dashboard",
          caloriesConsumed: calories
        }),
      });

      if (response.ok) {
        // Update local state
        setCompletedMeals(prev => new Set([...prev, mealType]));
        
        // Refresh dashboard data
        await fetchDashboardData();
        
        toast.success(`${mealType} marked as completed!`);
      } else {
        const error = await response.json();
        toast.error(error.error?.message || "Failed to mark meal as completed");
      }
    } catch (error) {
      console.error("Error marking meal as completed:", error);
      toast.error("Failed to mark meal as completed");
    } finally {
      setMealLoading(null);
    }
  };

  // Helper function to get current weight
  const getCurrentWeight = () => {
    if (user?.personalInfo?.weight) {
      return `${user.personalInfo.weight} kg`;
    }
    return "Not set";
  };

  // Helper function to get nutrition score from real data
  const getNutritionScore = () => {
    if (dashboardData?.nutritionScore !== undefined) {
      return dashboardData.nutritionScore;
    }
    return 0;
  };

  // Helper function to get meal completion data
  const getMealCompletionData = () => {
    if (dashboardData?.mealCompletion) {
      return dashboardData.mealCompletion;
    }
    return {
      totalMeals: 0,
      completedMeals: 0,
      completionRate: 0,
      todayMeals: 0,
      todayCompleted: 0
    };
  };

  // Helper function to get next checkup date
  const getNextCheckup = () => {
    // If user has a last checkup date, calculate next checkup as 15 days from last checkup
    if (user?.pregnancyInfo?.lastCheckupDate) {
      const lastCheckup = new Date(user.pregnancyInfo.lastCheckupDate);
      const nextCheckup = new Date(lastCheckup);
      nextCheckup.setDate(nextCheckup.getDate() + 15); // Add 15 days
      
      const today = new Date();
      const daysUntilNext = Math.ceil((nextCheckup.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilNext > 0) {
        return {
          days: daysUntilNext,
          date: nextCheckup.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })
        };
      } else {
        // Next checkup has passed, show overdue
        return {
          days: 0,
          date: "Overdue - Please schedule"
        };
      }
    }
    
    // Fallback to due date calculation if no last checkup date
    if (user?.pregnancyInfo?.dueDate) {
      const dueDate = new Date(user.pregnancyInfo.dueDate);
      const today = new Date();
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue > 0) {
        return {
          days: daysUntilDue,
          date: dueDate.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })
        };
      }
    }
    
    return { days: 0, date: "Not scheduled" }; // Default fallback
  };

  // Check if user has completed profile setup
  const isProfileComplete = user?.isProfileComplete || false;

  const nextCheckup = getNextCheckup();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <EnhancedNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-rose-900">
              Your Nutrition Dashboard
            </h1>
            <Button
              onClick={fetchDashboardData}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh Data
            </Button>
          </div>
          <p className="text-rose-700">
            Track your health, enter health data manually, and get personalized
            meal plans
          </p>
          
          {/* Profile Completion Status */}
          {!isProfileComplete && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800">
                      Complete Your Profile Setup
                    </h3>
                    <p className="text-sm text-amber-700 mt-1">
                      To get personalized nutrition recommendations, please complete your health profile.
                    </p>
                  </div>
                </div>
                <Link to="/profile">
                  <Button 
                    size="sm" 
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-white/80 backdrop-blur-sm border border-rose-100">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Health Reports
            </TabsTrigger>
            <TabsTrigger
              value="meal-plan"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Meal Plan
            </TabsTrigger>
            <TabsTrigger
              value="diet-plan"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Diet Plan
            </TabsTrigger>
            <TabsTrigger
              value="tracking"
              className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
            >
              Tracking
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-rose-50 hover:to-rose-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-rose-700 group-hover:text-rose-800 transition-colors flex items-center">
                    <Heart className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:text-rose-600 transition-all" />
                    Weight Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-900 group-hover:scale-110 transition-transform">
                    {getCurrentWeight()}
                  </div>
                  <p className="text-xs text-sage-600 flex items-center group-hover:text-sage-700 transition-colors">
                    <TrendingUp className="h-3 w-3 mr-1 group-hover:scale-125 transition-transform" />
                    {user?.personalInfo?.weight ? "Current weight" : "Not set"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-emerald-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-rose-700 group-hover:text-emerald-800 transition-colors flex items-center">
                    <Sparkles className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:text-emerald-600 transition-all" />
                    Nutrition Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-900 group-hover:scale-110 group-hover:text-emerald-700 transition-all">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${getNutritionScore()}%`
                    )}
                  </div>
                  <Progress
                    value={loading ? 0 : getNutritionScore()}
                    className="h-2 mt-2 group-hover:scale-105 transition-transform"
                  />
                  {!loading && dashboardData?.hasHealthData && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Based on latest health data
                    </p>
                  )}
                  {!loading && !dashboardData?.hasHealthData && (
                    <p className="text-xs text-gray-500 mt-1">
                      Enter health data to get score
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-rose-700 group-hover:text-blue-800 transition-colors flex items-center">
                    <Apple className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:text-blue-600 transition-all" />
                    Meals Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-rose-900 group-hover:scale-110 group-hover:text-blue-700 transition-all">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      `${getMealCompletionData().completedMeals}/${getMealCompletionData().totalMeals}`
                    )}
                  </div>
                  <p className="text-xs text-sage-600 group-hover:text-blue-600 transition-colors">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-3 w-24 rounded"></div>
                    ) : getMealCompletionData().totalMeals > 0 ? (
                      `${getMealCompletionData().completionRate}% completion rate`
                    ) : (
                      "No meals tracked yet"
                    )}
                  </p>
                  {!loading && getMealCompletionData().todayMeals > 0 && (
                    <p className="text-xs text-blue-600 mt-1">
                      Today: {getMealCompletionData().todayCompleted}/{getMealCompletionData().todayMeals}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-rose-100 group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-gradient-to-br hover:from-purple-50 hover:to-purple-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-rose-700 group-hover:text-purple-800 transition-colors flex items-center">
                    <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:text-purple-600 transition-all" />
                    Next Checkup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-rose-900 group-hover:scale-110 group-hover:text-purple-700 transition-all">
                    {nextCheckup.days} days
                  </div>
                  <p className="text-xs text-sage-600 group-hover:text-purple-600 transition-colors">
                    {nextCheckup.date}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Essential Health Data Entry */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-rose-900">
                Essential Health Data Entry
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-rose-500 to-rose-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:rotate-1">
                  <CardHeader className="pb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardTitle className="flex items-center text-lg relative z-10 group-hover:scale-105 transition-transform">
                      <FileText className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Manual Health Entry
                    </CardTitle>
                    <CardDescription className="text-rose-100 text-sm relative z-10">
                      Enter your health data manually for personalized insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Link to="/manual-health-entry">
                      <Button
                        variant="secondary"
                        className="bg-white text-rose-600 hover:bg-rose-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Enter Health Data
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-2 hover:-rotate-1">
                  <CardHeader className="pb-3 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardTitle className="flex items-center text-lg relative z-10 group-hover:scale-105 transition-transform">
                      <Heart className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Health History
                    </CardTitle>
                    <CardDescription className="text-emerald-100 text-sm relative z-10">
                      View your manually entered health data and trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button
                      variant="secondary"
                      className="bg-white text-emerald-600 hover:bg-emerald-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                      onClick={() => setActiveTab("reports")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/exercise-videos">
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardTitle className="flex items-center relative z-10 group-hover:scale-105 transition-transform">
                      <Play className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Exercise Videos
                    </CardTitle>
                    <CardDescription className="text-purple-100 relative z-10">
                      Safe prenatal workouts and stretches
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button
                      variant="secondary"
                      className="bg-white text-purple-600 hover:bg-purple-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Watch Videos
                    </Button>
                  </CardContent>
                </Card>
              </Link>
              <Card
                className="bg-gradient-to-br from-lavender-500 to-lavender-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1"
                onClick={() => setActiveTab("meal-plan")}
              >
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardTitle className="flex items-center relative z-10 group-hover:scale-105 transition-transform">
                    <Apple className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                    Today's Meal Plan
                  </CardTitle>
                  <CardDescription className="text-lavender-100 relative z-10">
                    View your personalized nutrition plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Button
                    variant="secondary"
                    className="bg-white text-lavender-600 hover:bg-lavender-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    View Meals
                  </Button>
                </CardContent>
              </Card>

              <Link to="/chatbot">
                <Card className="bg-gradient-to-br from-sage-500 to-sage-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardTitle className="flex items-center relative z-10 group-hover:scale-105 transition-transform">
                      <MessageCircle className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      AI Nutritionist
                    </CardTitle>
                    <CardDescription className="text-sage-100 relative z-10">
                      Ask nutrition questions & bust myths
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button
                      variant="secondary"
                      className="bg-white text-sage-600 hover:bg-sage-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/emergency">
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white group cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                  <CardHeader className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardTitle className="flex items-center relative z-10 group-hover:scale-105 transition-transform">
                      <AlertTriangle className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                      Emergency Help
                    </CardTitle>
                    <CardDescription className="text-red-100 relative z-10">
                      Find nearby hospitals quickly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <Button
                      variant="secondary"
                      className="bg-white text-red-600 hover:bg-red-50 w-full group-hover:scale-105 group-hover:shadow-lg transition-all duration-300"
                    >
                      <Heart className="h-4 w-4 mr-2" />
                      Find Help
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </TabsContent>

          {/* Diet Plan Tab */}
          <TabsContent value="diet-plan" className="space-y-6">
            <div className="space-y-6">
              {/* AI-Generated Diet Plan Section */}
              <Card className="bg-gradient-to-br from-rose-50 to-lavender-50 border-rose-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-lavender-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Heart className="h-6 w-6 mr-3" />
                    AI-Generated Diet Plans
                  </CardTitle>
                  <CardDescription className="text-rose-100">
                    View and manage your personalized AI-generated nutrition plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {syncedDietPlan ? (
                    <div className="space-y-6">
                      {/* Current Diet Plan */}
                      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-bold mb-2">Active Diet Plan</h3>
                            <p className="text-green-100">
                              Generated on {new Date(syncedDietPlan.generatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold">{syncedDietPlan.overallScore}/100</div>
                            <p className="text-green-100 text-sm">Health Score</p>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white/20 rounded-lg p-3">
                            <div className="text-sm text-green-100">Recommendations</div>
                            <div className="text-xl font-bold">{syncedDietPlan.recommendations.length}</div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-3">
                            <div className="text-sm text-green-100">Supplements</div>
                            <div className="text-xl font-bold">{syncedDietPlan.supplements.length}</div>
                          </div>
                          <div className="bg-white/20 rounded-lg p-3">
                            <div className="text-sm text-green-100">Daily Calories</div>
                            <div className="text-xl font-bold">{syncedDietPlan.dailyTargets.calories}</div>
                          </div>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                          <Button
                            onClick={() => navigate("/diet-plan-results", {
                              state: { dietPlan: syncedDietPlan, healthData: null }
                            })}
                            className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300"
                          >
                            <Heart className="h-4 w-4 mr-2" />
                            View Full Plan
                          </Button>
                          <Button
                            onClick={() => {
                              try {
                                // Try PDF first, fallback to text if PDF fails
                                const pdfSuccess = downloadDietPlan(syncedDietPlan);
                                if (pdfSuccess) {
                                  toast.success("Diet plan PDF downloaded!");
                                } else {
                                  // Fallback to text download
                                  const textSuccess = downloadDietPlanAsText(syncedDietPlan);
                                  if (textSuccess) {
                                    toast.success("Diet plan downloaded as text file!");
                                  } else {
                                    toast.error("Failed to download diet plan");
                                  }
                                }
                              } catch (error) {
                                toast.error("Failed to download diet plan");
                              }
                            }}
                            className="bg-white text-green-600 hover:bg-green-50 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      </div>

                      {/* Key Recommendations */}
                      <div className="bg-white rounded-lg p-6 border border-rose-200">
                        <h4 className="text-lg font-semibold text-rose-900 mb-4">Key Recommendations</h4>
                        <div className="space-y-3">
                          {syncedDietPlan.recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start space-x-3 p-3 bg-rose-50 rounded-lg">
                              <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-rose-800">{rec}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Nutritional Insights */}
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-2">Strengths</h5>
                          <ul className="space-y-1 text-sm text-green-700">
                            {syncedDietPlan.nutritionalInsights.strengths.map((strength, index) => (
                              <li key={index} className="flex items-center">
                                <Check className="h-3 w-3 mr-2 text-green-600" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-red-200">
                          <h5 className="font-semibold text-red-800 mb-2">Concerns</h5>
                          <ul className="space-y-1 text-sm text-red-700">
                            {syncedDietPlan.nutritionalInsights.concerns.map((concern, index) => (
                              <li key={index} className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-2 text-red-600" />
                                {concern}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <h5 className="font-semibold text-blue-800 mb-2">Priorities</h5>
                          <ul className="space-y-1 text-sm text-blue-700">
                            {syncedDietPlan.nutritionalInsights.priorities.map((priority, index) => (
                              <li key={index} className="flex items-center">
                                <Target className="h-3 w-3 mr-2 text-blue-600" />
                                {priority}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="h-16 w-16 mx-auto mb-4 text-rose-300" />
                      <h3 className="text-xl font-semibold text-rose-900 mb-2">No Diet Plan Generated Yet</h3>
                      <p className="text-rose-600 mb-6">
                        Generate your first AI-powered personalized diet plan to get started
                      </p>
                      <Link to="/manual-health-entry">
                        <Button className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white">
                          <Heart className="h-4 w-4 mr-2" />
                          Generate Diet Plan
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="space-y-6">
              {/* Manual Health Entry Section */}
              <Card className="bg-gradient-to-br from-rose-50 to-lavender-50 border-rose-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-rose-500 to-lavender-500 text-white rounded-t-lg">
                  <CardTitle className="flex items-center text-xl">
                    <Heart className="h-6 w-6 mr-3" />
                    Manual Health Data Entry
                  </CardTitle>
                  <CardDescription className="text-rose-100">
                    Enter your health data manually for personalized nutritional
                    insights and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Health Entry */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-rose-900 mb-4">
                        Enter New Health Data
                      </h3>
                      <Link to="/manual-health-entry">
                        <Button className="w-full h-20 bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <div className="text-center">
                            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                            <div className="font-semibold">
                              Start Health Entry
                            </div>
                            <div className="text-xs opacity-90">
                              6-step comprehensive form
                            </div>
                          </div>
                        </Button>
                      </Link>

                      <div className="text-sm text-rose-700 bg-rose-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">What you'll enter:</h4>
                        <ul className="space-y-1 text-rose-600">
                          <li>��� Basic Demographics & Measurements</li>
                          <li>• Medical Information & Conditions</li>
                          <li>• Nutrition-related Lab Values</li>
                          <li>• Dietary Preferences & Restrictions</li>
                          <li>• Lifestyle & Habits</li>
                          <li>• Special Conditions & Notes</li>
                        </ul>
                      </div>
                    </div>

                    {/* Recent Entries */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-rose-900 mb-4">
                        Recent Health Entries
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 bg-white border border-rose-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-rose-900">
                              Complete Health Assessment
                            </h4>
                            <Badge className="bg-green-100 text-green-800">
                              Completed
                            </Badge>
                          </div>
                          <p className="text-sm text-rose-600 mb-2">
                            March 10, 2024
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs"
                            >
                              Generate Plan
                            </Button>
                          </div>
                        </div>

                        <div className="text-center py-8 text-rose-500">
                          <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No health data entries yet</p>
                          <p className="text-xs">
                            Start your first manual entry above
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Data Summary */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-rose-900">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Health Metrics Overview
                    </CardTitle>
                    <CardDescription className="text-rose-600">
                      Your latest manually entered health data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                        <span className="text-rose-700 font-medium">BMI</span>
                        <span className="text-rose-900 font-bold">22.5</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                        <span className="text-rose-700 font-medium">
                          Blood Pressure
                        </span>
                        <span className="text-rose-900 font-bold">120/80</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                        <span className="text-rose-700 font-medium">
                          Hemoglobin
                        </span>
                        <span className="text-rose-900 font-bold">
                          12.5 g/dL
                        </span>
                      </div>
                      <div className="text-center pt-4">
                        <Link to="/manual-health-entry">
                          <Button
                            variant="outline"
                            className="border-rose-300 text-rose-700"
                          >
                            Update Health Data
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                      <Sparkles className="h-5 w-5 mr-2" />
                      AI Insights & Recommendations
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      Based on your manually entered health data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <p className="text-purple-800 text-sm">
                          Your iron levels are within normal range
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                        <p className="text-purple-800 text-sm">
                          Consider increasing calcium intake
                        </p>
                      </div>
                      <div className="flex items-start space-x-3 p-3 bg-white/70 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <p className="text-purple-800 text-sm">
                          Your weight gain is on track
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Meal Plan Tab */}
          <TabsContent value="meal-plan" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Today's Meals */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-gradient-to-r from-rose-500 to-lavender-500 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2 flex items-center">
                        <Apple className="h-7 w-7 mr-3" />
                        Today's Personalized Meal Plan
                      </h2>
                      <p className="text-rose-100 opacity-90">
                        Nutrition tailored for your pregnancy journey
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">5/5</div>
                      <p className="text-sm text-rose-100">Meals planned</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/20 rounded-lg p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Daily Progress</span>
                      <span>40% Complete</span>
                    </div>
                    <div className="mt-2 bg-white/30 rounded-full h-2">
                      <div className="bg-white rounded-full h-2 w-2/5 transition-all duration-500"></div>
                    </div>
                  </div>
                </div>

                {/* Synced Diet Plan Banner */}
                {syncedDietPlan && (
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold">
                            AI-Generated Diet Plan Active
                          </h3>
                          <p className="text-green-100 text-sm">
                            Synced on{" "}
                            {new Date(
                              localStorage.getItem("dietPlanSyncDate") || "",
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {syncedDietPlan.overallScore}/100
                          </div>
                          <p className="text-green-100 text-sm">Health Score</p>
                        </div>
                        <Button
                          onClick={() =>
                            navigate("/diet-plan-results", {
                              state: {
                                dietPlan: syncedDietPlan,
                                healthData: null,
                              },
                            })
                          }
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                        >
                          View Full Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {(() => {
                  // Use synced diet plan if available, otherwise use default meals
                  if (syncedDietPlan && syncedDietPlan.weeklyMealPlan) {
                    const today = new Date()
                      .toLocaleDateString("en-US", { weekday: "long" })
                      .toLowerCase();
                    const todayMeals =
                      syncedDietPlan.weeklyMealPlan[today] ||
                      syncedDietPlan.weeklyMealPlan.monday ||
                      {};

                    return [
                      {
                        meal: "Breakfast",
                        time: "7:00 AM",
                        items: [
                          todayMeals.breakfast?.name || "No meal planned",
                        ],
                        calories: todayMeals.breakfast?.calories || 0,
                        completed: completedMeals.has("Breakfast"),
                        nutrients: todayMeals.breakfast?.nutrients || [],
                      },
                      {
                        meal: "Lunch",
                        time: "1:00 PM",
                        items: [todayMeals.lunch?.name || "No meal planned"],
                        calories: todayMeals.lunch?.calories || 0,
                        completed: completedMeals.has("Lunch"),
                        nutrients: todayMeals.lunch?.nutrients || [],
                      },
                      {
                        meal: "Dinner",
                        time: "7:00 PM",
                        items: [todayMeals.dinner?.name || "No meal planned"],
                        calories: todayMeals.dinner?.calories || 0,
                        completed: completedMeals.has("Dinner"),
                        nutrients: todayMeals.dinner?.nutrients || [],
                      },
                    ];
                  }

                  // Default meals when no diet plan is synced
                  return [
                    {
                      meal: "Breakfast",
                      time: "7:00 AM",
                      items: [
                        "Spinach and feta omelet",
                        "Whole grain toast",
                        "Orange juice",
                      ],
                      calories: 420,
                      completed: completedMeals.has("Breakfast"),
                      nutrients: [],
                    },
                    {
                      meal: "Mid-Morning Snack",
                      time: "10:00 AM",
                      items: [
                        "Greek yogurt with berries",
                        "Almonds (10 pieces)",
                      ],
                      calories: 180,
                      completed: completedMeals.has("Mid-Morning Snack"),
                      nutrients: [],
                    },
                    {
                      meal: "Lunch",
                      time: "1:00 PM",
                      items: [
                        "Quinoa salad with chickpeas",
                        "Grilled chicken breast",
                        "Avocado",
                      ],
                      calories: 520,
                      completed: completedMeals.has("Lunch"),
                      nutrients: [],
                    },
                    {
                      meal: "Afternoon Snack",
                      time: "4:00 PM",
                      items: ["Apple slices with peanut butter", "Herbal tea"],
                      calories: 150,
                      completed: completedMeals.has("Afternoon Snack"),
                      nutrients: [],
                    },
                    {
                      meal: "Dinner",
                      time: "7:00 PM",
                      items: [
                        "Salmon with sweet potato",
                        "Steamed broccoli",
                        "Brown rice",
                      ],
                      calories: 480,
                      completed: completedMeals.has("Dinner"),
                      nutrients: [],
                    },
                  ];
                })().map((meal, index) => (
                  <Card
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm transition-all duration-300 cursor-pointer group transform hover:scale-105 hover:shadow-2xl hover:-translate-y-1 ${
                      meal.completed
                        ? "border-sage-200 bg-gradient-to-r from-sage-50/50 to-green-50/50 shadow-sage-100 hover:shadow-sage-200 hover:border-sage-300"
                        : "border-rose-100 hover:border-rose-300 hover:shadow-rose-200 hover:bg-gradient-to-r hover:from-rose-50/30 hover:to-peach-50/30"
                    }`}
                  >
                    <CardContent className="p-4 relative overflow-hidden">
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>

                      {meal.completed && (
                        <div className="absolute top-2 right-2 z-10">
                          <div className="w-6 h-6 bg-gradient-to-r from-sage-400 to-green-500 rounded-full flex items-center justify-center shadow-lg animate-pulse group-hover:scale-110 transition-transform duration-300">
                            <Check className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-3 relative z-10">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                              meal.completed
                                ? "bg-gradient-to-br from-sage-500 to-green-600 shadow-lg shadow-sage-200 group-hover:shadow-sage-300"
                                : "bg-gradient-to-br from-rose-500 to-rose-600 shadow-lg shadow-rose-200 group-hover:shadow-rose-300"
                            }`}
                          >
                            {meal.completed ? (
                              <Check className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
                            ) : (
                              <Clock className="h-5 w-5 text-white transition-transform group-hover:scale-110" />
                            )}
                          </div>
                          <div>
                            <h3
                              className={`font-semibold transition-all duration-300 group-hover:scale-105 ${
                                meal.completed
                                  ? "text-sage-900 group-hover:text-sage-700"
                                  : "text-rose-900 group-hover:text-rose-700"
                              }`}
                            >
                              {meal.meal}
                            </h3>
                            <p
                              className={`text-sm transition-colors ${
                                meal.completed
                                  ? "text-sage-600 group-hover:text-sage-500"
                                  : "text-rose-600 group-hover:text-rose-500"
                              }`}
                            >
                              {meal.time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="outline"
                            className={`transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ${
                              meal.completed
                                ? "text-sage-700 border-sage-300 bg-sage-50 group-hover:bg-sage-100"
                                : "text-peach-700 border-peach-300 bg-peach-50 group-hover:bg-peach-100"
                            }`}
                          >
                            {meal.calories} cal
                          </Badge>
                        </div>
                      </div>
                      <ul className="space-y-1 mb-3 relative z-10">
                        {meal.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className={`text-sm flex items-center transition-all duration-300 group-hover:translate-x-1 ${
                              meal.completed
                                ? "text-sage-700 group-hover:text-sage-600"
                                : "text-rose-700 group-hover:text-rose-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-2 transition-all duration-300 group-hover:scale-125 ${
                                meal.completed
                                  ? "bg-sage-300 group-hover:bg-sage-400"
                                  : "bg-rose-300 group-hover:bg-rose-400"
                              }`}
                            ></span>
                            {item}
                          </li>
                        ))}
                      </ul>

                      {/* Show nutrients if available from synced diet plan */}
                      {meal.nutrients && meal.nutrients.length > 0 && (
                        <div className="mb-3 relative z-10">
                          <span className="text-xs font-medium text-rose-700 mb-1 block">
                            Key Nutrients:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {meal.nutrients.map(
                              (nutrient: string, nutrientIndex: number) => (
                                <Badge
                                  key={nutrientIndex}
                                  variant="outline"
                                  className="text-xs border-rose-300 text-rose-700 bg-rose-50"
                                >
                                  {nutrient}
                                </Badge>
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {!meal.completed && (
                        <Button
                          onClick={() => handleMealCompletion(meal.meal, meal.items[0], meal.calories)}
                          disabled={mealLoading === meal.meal}
                          size="sm"
                          className="bg-sage-500 hover:bg-sage-600 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg relative z-10"
                        >
                          {mealLoading === meal.meal ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Marking...
                            </>
                          ) : (
                            'Mark as Eaten'
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Sidebar with Nutrition Summary and Upload History */}
              <div className="space-y-4">
                {/* Nutrition Summary */}
                <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
                  <CardHeader>
                    <CardTitle className="text-rose-900">Daily Goals</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-rose-700">Calories</span>
                        <span className="text-rose-900">1180 / 1750</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-rose-700">Iron</span>
                        <span className="text-rose-900">12mg / 18mg</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-rose-700">Calcium</span>
                        <span className="text-rose-900">800mg / 1000mg</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-rose-700">Protein</span>
                        <span className="text-rose-900">45g / 60g</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Health Data History in Meal Plan */}
                <Card className="bg-gradient-to-br from-purple-50 to-lavender-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-purple-900 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Health Data History
                    </CardTitle>
                    <CardDescription className="text-purple-600">
                      Track your manually entered health data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {dashboardData?.recentHealthEntries && dashboardData.recentHealthEntries.length > 0 ? (
                      dashboardData.recentHealthEntries.map((entry: any, index: number) => (
                        <div
                          key={index}
                          className="p-3 bg-white/70 rounded-lg border border-purple-100 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                              <TrendingUp className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-purple-900 text-sm">
                                Health Assessment
                              </h4>
                              <p className="text-xs text-purple-600">
                                {new Date(entry.entryDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              completed
                            </Badge>
                            <span className="text-xs text-purple-600 font-medium">
                              {entry.weight ? `${entry.weight}kg` : 'Data recorded'}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-purple-600">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No health data entries yet</p>
                        <p className="text-xs">Start tracking your health journey</p>
                      </div>
                    )}

                    <Link to="/manual-health-entry">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Enter New Health Data
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
                <CardHeader>
                  <CardTitle className="text-rose-900">
                    Weight Tracking
                  </CardTitle>
                  <CardDescription>
                    Monitor your healthy weight gain
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center p-8">
                    <div className="text-3xl font-bold text-rose-900 mb-2">
                      65.2 kg
                    </div>
                    <p className="text-sage-600">Current weight</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-rose-100">
                <CardHeader>
                  <CardTitle className="text-rose-900">Meal History</CardTitle>
                  <CardDescription>Your nutrition journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {["Yesterday", "2 days ago", "3 days ago"].map(
                      (day, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-rose-50 rounded-lg"
                        >
                          <span className="text-rose-700">{day}</span>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="outline"
                              className="text-sage-700 border-sage-300"
                            >
                              5/5 meals
                            </Badge>
                            <span className="text-sm text-rose-600">
                              95% nutrition goal
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
