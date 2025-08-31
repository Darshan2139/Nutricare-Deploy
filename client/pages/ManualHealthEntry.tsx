import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { API_BASE } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ChevronRight,
  ChevronLeft,
  Calculator,
  Download,
  FileText,
  User,
  Activity,
  Pill,
} from "lucide-react";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ManualHealthEntry } from "@shared/types";

export default function ManualHealthEntryPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const totalSteps = 6;

  // Diet plan generation states
  const [generateDietPlan, setGenerateDietPlan] = useState(false);
  const [showAnalysisAnimation, setShowAnalysisAnimation] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [generatedDietPlan, setGeneratedDietPlan] = useState<any>(null);

  // Animation steps for AI analysis
  const analysisSteps = [
    { title: "Model Think", subtitle: "AI processing your data", icon: "🤖" },
    { title: "AI Analysis", subtitle: "Analyzing health markers", icon: "🧠" },
    { title: "Health Report", subtitle: "Generating insights", icon: "📋" },
    { title: "Diet Plan", subtitle: "Creating personalized plan", icon: "🍎" },
  ];

  // Profile data that can be pre-filled
  const [profileData, setProfileData] = useState<any>(null);

  // Manual entry form state
  const [healthEntry, setHealthEntry] = useState<Partial<ManualHealthEntry>>({
    entryDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  // Calculate BMI automatically
  const calculateBMI = (height: number, weight: number) => {
    if (height && weight) {
      const heightInMeters = height / 100;
      return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
    }
    return undefined;
  };

  // Update BMI when height or weight changes
  useEffect(() => {
    if (healthEntry.height && healthEntry.weight) {
      const bmi = calculateBMI(healthEntry.height, healthEntry.weight);
      setHealthEntry((prev) => ({ ...prev, bmi }));
    }
  }, [healthEntry.height, healthEntry.weight]);

  // Fetch profile data to pre-fill fields
  const fetchProfileData = async () => {
    setFetchingProfile(true);
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock profile data - replace with actual API call
      const mockProfileData = {
        age: 28,
        height: 165,
        weight: 65,
        trimester: 2,
        activityLevel: "moderate",
        dietPreference: "vegetarian",
        foodAllergies: ["nuts"],
        religiousCulturalRestrictions: ["jain"],
        sleepHours: 7,
        waterIntake: 2.5,
        currentSupplements: ["folic acid", "iron"],
        isHighRisk: false,
      };

      setProfileData(mockProfileData);
      setHealthEntry((prev) => ({
        ...prev,
        ...mockProfileData,
        trimester: mockProfileData.trimester as 1 | 2 | 3,
        bmi: calculateBMI(mockProfileData.height, mockProfileData.weight),
      }));

      toast.success("Profile data loaded successfully!");
    } catch (error) {
      toast.error("Failed to fetch profile data");
    } finally {
      setFetchingProfile(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setHealthEntry((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayInputChange = (field: string, values: string[]) => {
    setHealthEntry((prev) => ({ ...prev, [field]: values }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (shouldGeneratePlan: boolean = false) => {
    setIsLoading(true);
    try {
      // Simulate API call to save health entry
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const entryData: ManualHealthEntry = {
        id: `entry_${Date.now()}`,
        userId: user?.id || "",
        ...healthEntry,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as ManualHealthEntry;

      console.log("Health entry data:", entryData);
      toast.success("Health data saved successfully!");

      // Only generate diet plan if explicitly requested via shouldGeneratePlan parameter
      if (shouldGeneratePlan) {
        await handleDietPlanGeneration(entryData);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Failed to save health data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDietPlanGeneration = async (entryData: ManualHealthEntry) => {
    console.log("Starting diet plan generation with Gemini API...");
    setShowAnalysisAnimation(true);
    setAnalysisStep(0);

    try {
      // Animate through each step
      for (let i = 0; i < analysisSteps.length; i++) {
        console.log(`Animation step ${i + 1}: ${analysisSteps[i].title}`);
        setAnalysisStep(i);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Call Gemini API to generate diet plan
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE}/plans/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          healthData: entryData,
          userPreferences: {
            cuisinePreference: ['Indian', 'Mediterranean'],
            mealCount: 3,
            calorieTarget: 2200
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate diet plan');
      }

      const result = await response.json();
      const dietPlan = result.data;

      console.log("Generated diet plan:", dietPlan);
      setGeneratedDietPlan(dietPlan);
      setShowAnalysisAnimation(false);

      // First, save the health entry to get its ID
      let healthEntryId = null;
      try {
        const healthEntryResponse = await fetch(`${API_BASE}/health/entries`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...entryData,
            entryDate: new Date().toISOString().split('T')[0]
          }),
        });

        if (healthEntryResponse.ok) {
          const savedHealthEntry = await healthEntryResponse.json();
          healthEntryId = savedHealthEntry._id;
          console.log("Health entry saved:", savedHealthEntry);
        }
      } catch (healthError) {
        console.error("Error saving health entry:", healthError);
      }

      // Then save the diet plan to the database
      if (healthEntryId) {
        try {
          const saveResponse = await fetch(`${API_BASE}/plans/save`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              healthEntryId: healthEntryId,
              planType: "ai_generated",
              status: "active",
              overallScore: dietPlan.overallScore || 85,
              analysisDate: new Date().toISOString(),
              recommendations: dietPlan.recommendations || [],
              nutritionalInsights: dietPlan.nutritionalInsights || {
                strengths: [],
                concerns: [],
                priorities: []
              },
              weeklyMealPlan: dietPlan.weeklyMealPlan || {},
              supplements: dietPlan.supplements || [],
              restrictions: dietPlan.restrictions || [],
              dailyTargets: dietPlan.dailyTargets || {
                calories: 2200,
                protein: 75,
                iron: 27,
                calcium: 1000,
                folate: 600,
                vitaminD: 600
              },
              isActive: true
            }),
          });

          if (saveResponse.ok) {
            const savedPlan = await saveResponse.json();
            console.log("Diet plan saved to database:", savedPlan);
            
            // Store the saved plan in localStorage for dashboard access
            localStorage.setItem("generatedDietPlan", JSON.stringify(savedPlan.data));
          } else {
            console.error("Failed to save diet plan to database");
          }
        } catch (saveError) {
          console.error("Error saving diet plan to database:", saveError);
        }
      }

      // Navigate to diet plan results page
      navigate("/diet-plan-results", {
        state: { dietPlan, healthData: entryData },
      });

    } catch (error) {
      console.error("Error generating diet plan:", error);
      setShowAnalysisAnimation(false);
      toast.error(error instanceof Error ? error.message : "Failed to generate diet plan");
    }
  };

  const progressPercentage = (step / totalSteps) * 100;

  const medicalConditionOptions = [
    "None",
    "Diabetes",
    "Hypertension",
    "Thyroid disorders",
    "Heart disease",
    "Kidney disease",
    "Liver disease",
    "Asthma",
    "Depression",
    "Anxiety",
  ];

  const supplementOptions = [
    "Iron",
    "Folic Acid",
    "Multivitamins",
    "Vitamin D",
    "Calcium",
    "Omega-3",
    "Vitamin B12",
    "Probiotics",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 p-4 relative">
      {/* Analysis Animation Overlay */}
      {showAnalysisAnimation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <Card className="bg-white shadow-2xl max-w-md w-full mx-4 border-0">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="text-6xl mb-4 animate-bounce">
                  {analysisSteps[analysisStep]?.icon}
                </div>
                <h2 className="text-2xl font-bold text-rose-900 mb-2">
                  {analysisSteps[analysisStep]?.title}
                </h2>
                <p className="text-rose-600">
                  {analysisSteps[analysisStep]?.subtitle}
                </p>
              </div>

              <div className="space-y-3">
                {analysisSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-500 ${
                      index < analysisStep
                        ? "bg-green-100 text-green-800"
                        : index === analysisStep
                          ? "bg-rose-100 text-rose-800 shadow-md"
                          : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <div className="text-2xl">{step.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-sm opacity-80">{step.subtitle}</div>
                    </div>
                    {index < analysisStep && (
                      <div className="text-green-600">✓</div>
                    )}
                    {index === analysisStep && (
                      <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <Progress
                  value={(analysisStep / (analysisSteps.length - 1)) * 100}
                  className="h-2"
                />
                <p className="text-sm text-rose-600 mt-2">
                  Processing step {analysisStep + 1} of {analysisSteps.length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <NutriCareLogo size="md" />
            <span className="ml-2 text-2xl font-bold text-rose-900 font-quicksand">
              NutriCare
            </span>
          </div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">
            Manual Health Data Entry
          </h1>
          <p className="text-rose-700 max-w-2xl mx-auto">
            Enter your current health metrics and lab values for personalized
            nutrition recommendations
          </p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-rose-600 mb-2">
              <span>
                Step {step} of {totalSteps}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Fetch Profile Data Button */}
        <div className="mb-6 text-center">
          <Button
            onClick={fetchProfileData}
            disabled={fetchingProfile}
            variant="outline"
            className="border-rose-300 text-rose-700 hover:bg-rose-50"
          >
            <Download className="h-4 w-4 mr-2" />
            {fetchingProfile ? "Loading..." : "Fetch Data from Profile"}
          </Button>
          {profileData && (
            <Badge variant="secondary" className="ml-2">
              Profile data loaded
            </Badge>
          )}
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center text-rose-900">
              {step === 1 && <User className="h-5 w-5 mr-2" />}
              {step === 2 && <FileText className="h-5 w-5 mr-2" />}
              {step === 3 && <Heart className="h-5 w-5 mr-2" />}
              {step === 4 && <Activity className="h-5 w-5 mr-2" />}
              {step === 5 && <Activity className="h-5 w-5 mr-2" />}
              {step === 6 && <Pill className="h-5 w-5 mr-2" />}
              {step === 1 && "Basic Demographics"}
              {step === 2 && "Medical Information"}
              {step === 3 && "Lab Values & Vitamins"}
              {step === 4 && "Dietary Preferences"}
              {step === 5 && "Lifestyle & Habits"}
              {step === 6 && "Special Conditions"}
            </CardTitle>
            <CardDescription className="text-rose-600">
              {step === 1 && "Enter your basic demographic information"}
              {step === 2 && "Provide current medical information and history"}
              {step === 3 && "Enter your recent lab test results"}
              {step === 4 &&
                "Specify your dietary preferences and restrictions"}
              {step === 5 && "Share your lifestyle and daily habits"}
              {step === 6 && "Add any special conditions or supplements"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Basic Demographics */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age">Age *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      value={healthEntry.age || ""}
                      onChange={(e) =>
                        handleInputChange("age", Number(e.target.value))
                      }
                      min="18"
                      max="50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="trimester">Pregnancy Stage *</Label>
                    <Select
                      value={healthEntry.trimester?.toString() || ""}
                      onValueChange={(value) =>
                        handleInputChange("trimester", Number(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select trimester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Trimester</SelectItem>
                        <SelectItem value="2">2nd Trimester</SelectItem>
                        <SelectItem value="3">3rd Trimester</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="height">Height (cm) *</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="165"
                      value={healthEntry.height || ""}
                      onChange={(e) =>
                        handleInputChange("height", Number(e.target.value))
                      }
                      min="100"
                      max="220"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={healthEntry.weight || ""}
                      onChange={(e) =>
                        handleInputChange("weight", Number(e.target.value))
                      }
                      min="30"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bmi">BMI</Label>
                    <div className="flex">
                      <Input
                        id="bmi"
                        type="number"
                        placeholder="Auto-calculated"
                        value={healthEntry.bmi || ""}
                        onChange={(e) =>
                          handleInputChange("bmi", Number(e.target.value))
                        }
                        step="0.1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => {
                          if (healthEntry.height && healthEntry.weight) {
                            const bmi = calculateBMI(
                              healthEntry.height,
                              healthEntry.weight,
                            );
                            setHealthEntry((prev) => ({ ...prev, bmi }));
                          }
                        }}
                      >
                        <Calculator className="h-4 w-4" />
                      </Button>
                    </div>
                    {healthEntry.bmi && (
                      <p className="text-sm text-gray-600 mt-1">
                        BMI: {healthEntry.bmi} -{" "}
                        {healthEntry.bmi < 18.5
                          ? "Underweight"
                          : healthEntry.bmi < 25
                            ? "Normal"
                            : healthEntry.bmi < 30
                              ? "Overweight"
                              : "Obese"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Medical Information */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hemoglobin">Hemoglobin Level (g/dL)</Label>
                    <Input
                      id="hemoglobin"
                      type="number"
                      placeholder="12.0"
                      value={healthEntry.hemoglobinLevel || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "hemoglobinLevel",
                          Number(e.target.value),
                        )
                      }
                      step="0.1"
                      min="5"
                      max="20"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 11.0-15.0 g/dL for pregnant women
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="bloodSugar">
                      Blood Sugar/Glucose (mg/dL)
                    </Label>
                    <Input
                      id="bloodSugar"
                      type="number"
                      placeholder="90"
                      value={healthEntry.bloodSugar || ""}
                      onChange={(e) =>
                        handleInputChange("bloodSugar", Number(e.target.value))
                      }
                      min="50"
                      max="400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Fasting normal: 70-100 mg/dL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="systolic">Blood Pressure - Systolic</Label>
                    <Input
                      id="systolic"
                      type="number"
                      placeholder="120"
                      value={healthEntry.bloodPressure?.systolic || ""}
                      onChange={(e) =>
                        handleInputChange("bloodPressure", {
                          ...healthEntry.bloodPressure,
                          systolic: Number(e.target.value),
                        })
                      }
                      min="80"
                      max="200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="diastolic">
                      Blood Pressure - Diastolic
                    </Label>
                    <Input
                      id="diastolic"
                      type="number"
                      placeholder="80"
                      value={healthEntry.bloodPressure?.diastolic || ""}
                      onChange={(e) =>
                        handleInputChange("bloodPressure", {
                          ...healthEntry.bloodPressure,
                          diastolic: Number(e.target.value),
                        })
                      }
                      min="50"
                      max="120"
                    />
                  </div>
                </div>

                <div>
                  <Label>Medical History (Pre-existing conditions)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {medicalConditionOptions.map((condition) => (
                      <div
                        key={condition}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={condition}
                          checked={
                            healthEntry.medicalHistory?.includes(condition) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            const current = healthEntry.medicalHistory || [];
                            if (checked) {
                              handleArrayInputChange("medicalHistory", [
                                ...current,
                                condition,
                              ]);
                            } else {
                              handleArrayInputChange(
                                "medicalHistory",
                                current.filter((c) => c !== condition),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={condition} className="text-sm">
                          {condition}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Lab Values & Vitamins */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vitaminD">Vitamin D (ng/mL)</Label>
                    <Input
                      id="vitaminD"
                      type="number"
                      placeholder="30"
                      value={healthEntry.vitaminD || ""}
                      onChange={(e) =>
                        handleInputChange("vitaminD", Number(e.target.value))
                      }
                      step="0.1"
                      min="0"
                      max="150"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 30-100 ng/mL
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="vitaminB12">Vitamin B12 (pg/mL)</Label>
                    <Input
                      id="vitaminB12"
                      type="number"
                      placeholder="400"
                      value={healthEntry.vitaminB12 || ""}
                      onChange={(e) =>
                        handleInputChange("vitaminB12", Number(e.target.value))
                      }
                      min="0"
                      max="2000"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 200-900 pg/mL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vitaminA">Vitamin A (mg/L)</Label>
                    <Input
                      id="vitaminA"
                      type="number"
                      placeholder="0.5"
                      value={healthEntry.vitaminA || ""}
                      onChange={(e) =>
                        handleInputChange("vitaminA", Number(e.target.value))
                      }
                      step="0.01"
                      min="0"
                      max="5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 0.3-0.7 mg/L
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="vitaminC">Vitamin C (mg/dL)</Label>
                    <Input
                      id="vitaminC"
                      type="number"
                      placeholder="1.0"
                      value={healthEntry.vitaminC || ""}
                      onChange={(e) =>
                        handleInputChange("vitaminC", Number(e.target.value))
                      }
                      step="0.1"
                      min="0"
                      max="10"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 0.4-2.0 mg/dL
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="calcium">Calcium (mg/dL)</Label>
                    <Input
                      id="calcium"
                      type="number"
                      placeholder="9.5"
                      value={healthEntry.calcium || ""}
                      onChange={(e) =>
                        handleInputChange("calcium", Number(e.target.value))
                      }
                      step="0.1"
                      min="5"
                      max="15"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 8.5-10.5 mg/dL
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="serumFerritin">
                      Serum Ferritin (ng/mL)
                    </Label>
                    <Input
                      id="serumFerritin"
                      type="number"
                      placeholder="30"
                      value={healthEntry.ironLevels?.serumFerritin || ""}
                      onChange={(e) =>
                        handleInputChange("ironLevels", {
                          ...healthEntry.ironLevels,
                          serumFerritin: Number(e.target.value),
                        })
                      }
                      min="0"
                      max="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Normal range: 15-150 ng/mL
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Dietary Preferences */}
            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <Label>Diet Preference *</Label>
                  <Select
                    value={healthEntry.dietPreference || ""}
                    onValueChange={(value) =>
                      handleInputChange("dietPreference", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your diet preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="non-vegetarian">
                        Non-Vegetarian
                      </SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Food Allergies</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "Nuts",
                      "Lactose",
                      "Gluten",
                      "Eggs",
                      "Soy",
                      "Fish",
                      "Shellfish",
                      "Sesame",
                    ].map((allergy) => (
                      <div
                        key={allergy}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={allergy}
                          checked={
                            healthEntry.foodAllergies?.includes(allergy) ||
                            false
                          }
                          onCheckedChange={(checked) => {
                            const current = healthEntry.foodAllergies || [];
                            if (checked) {
                              handleArrayInputChange("foodAllergies", [
                                ...current,
                                allergy,
                              ]);
                            } else {
                              handleArrayInputChange(
                                "foodAllergies",
                                current.filter((a) => a !== allergy),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={allergy} className="text-sm">
                          {allergy}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Religious/Cultural Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {[
                      "Halal",
                      "Kosher",
                      "Jain",
                      "Buddhist",
                      "Hindu",
                      "None",
                    ].map((restriction) => (
                      <div
                        key={restriction}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={restriction}
                          checked={
                            healthEntry.religiousCulturalRestrictions?.includes(
                              restriction,
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            const current =
                              healthEntry.religiousCulturalRestrictions || [];
                            if (checked) {
                              handleArrayInputChange(
                                "religiousCulturalRestrictions",
                                [...current, restriction],
                              );
                            } else {
                              handleArrayInputChange(
                                "religiousCulturalRestrictions",
                                current.filter((r) => r !== restriction),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={restriction} className="text-sm">
                          {restriction}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Lifestyle & Habits */}
            {step === 5 && (
              <div className="space-y-4">
                <div>
                  <Label>Physical Activity Level *</Label>
                  <Select
                    value={healthEntry.activityLevel || ""}
                    onValueChange={(value) =>
                      handleInputChange("activityLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your activity level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">
                        Sedentary (little to no exercise)
                      </SelectItem>
                      <SelectItem value="light">
                        Light (light exercise 1-3 days/week)
                      </SelectItem>
                      <SelectItem value="moderate">
                        Moderate (moderate exercise 3-5 days/week)
                      </SelectItem>
                      <SelectItem value="active">
                        Active (hard exercise 6-7 days/week)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sleepHours">Sleep Hours per Night</Label>
                    <Input
                      id="sleepHours"
                      type="number"
                      placeholder="8"
                      value={healthEntry.sleepHours || ""}
                      onChange={(e) =>
                        handleInputChange("sleepHours", Number(e.target.value))
                      }
                      min="4"
                      max="12"
                      step="0.5"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 7-9 hours
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="waterIntake">
                      Water Intake (liters/day)
                    </Label>
                    <Input
                      id="waterIntake"
                      type="number"
                      placeholder="2.5"
                      value={healthEntry.waterIntake || ""}
                      onChange={(e) =>
                        handleInputChange("waterIntake", Number(e.target.value))
                      }
                      min="1"
                      max="5"
                      step="0.1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Recommended: 2.5-3.0 liters during pregnancy
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Special Conditions */}
            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <Label>Multiple Pregnancy</Label>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="singleton"
                        checked={!healthEntry.isMultiple}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("isMultiple", false);
                            handleInputChange("multipleType", "");
                          }
                        }}
                      />
                      <Label htmlFor="singleton">Singleton</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="twins"
                        checked={
                          healthEntry.isMultiple &&
                          healthEntry.multipleType === "twins"
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("isMultiple", true);
                            handleInputChange("multipleType", "twins");
                          }
                        }}
                      />
                      <Label htmlFor="twins">Twins</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="triplets"
                        checked={
                          healthEntry.isMultiple &&
                          healthEntry.multipleType === "triplets"
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleInputChange("isMultiple", true);
                            handleInputChange("multipleType", "triplets");
                          }
                        }}
                      />
                      <Label htmlFor="triplets">Triplets</Label>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="highRisk"
                    checked={healthEntry.isHighRisk || false}
                    onCheckedChange={(checked) =>
                      handleInputChange("isHighRisk", checked)
                    }
                  />
                  <Label htmlFor="highRisk">
                    High-risk pregnancy (as determined by doctor)
                  </Label>
                </div>

                <div>
                  <Label>Current Supplements</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {supplementOptions.map((supplement) => (
                      <div
                        key={supplement}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={supplement}
                          checked={
                            healthEntry.currentSupplements?.includes(
                              supplement,
                            ) || false
                          }
                          onCheckedChange={(checked) => {
                            const current =
                              healthEntry.currentSupplements || [];
                            if (checked) {
                              handleArrayInputChange("currentSupplements", [
                                ...current,
                                supplement,
                              ]);
                            } else {
                              handleArrayInputChange(
                                "currentSupplements",
                                current.filter((s) => s !== supplement),
                              );
                            }
                          }}
                        />
                        <Label htmlFor={supplement} className="text-sm">
                          {supplement}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional information or notes..."
                    value={healthEntry.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <Separator />
            <div className="flex justify-between pt-4">
              <Button
                onClick={handlePrevious}
                disabled={step === 1}
                variant="outline"
                className="border-rose-300 text-rose-700 hover:bg-rose-50"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {step < totalSteps ? (
                <Button
                  onClick={handleNext}
                  className="bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2 justify-end">
                    <Checkbox
                      id="generateDietPlan"
                      checked={generateDietPlan}
                      onCheckedChange={(checked) =>
                        setGenerateDietPlan(checked as boolean)
                      }
                    />
                    <Label
                      htmlFor="generateDietPlan"
                      className="text-sm text-rose-700 font-medium"
                    >
                      Enable AI Diet Plan Generation
                      <span className="block text-xs text-rose-600 font-normal mt-1">
                        Check this to enable the "Generate Diet Plan" button
                      </span>
                    </Label>
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleSubmit(false)}
                      disabled={
                        isLoading || showAnalysisAnimation || generateDietPlan
                      }
                      variant="outline"
                      className={`border-rose-300 text-rose-700 hover:bg-rose-50 ${
                        generateDietPlan ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading && !showAnalysisAnimation
                        ? "Saving..."
                        : "Save Health Data Only"}
                      <FileText className="h-4 w-4 ml-2" />
                    </Button>
                    <Button
                      onClick={() => {
                        console.log("Generate Diet Plan button clicked!");
                        handleSubmit(true);
                      }}
                      disabled={
                        isLoading || showAnalysisAnimation || !generateDietPlan
                      }
                      className={`bg-rose-500 hover:bg-rose-600 text-white ${
                        !generateDietPlan ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading && showAnalysisAnimation
                        ? "Analyzing..."
                        : "Generate Diet Plan"}
                      <Heart className="h-4 w-4 ml-2" />
                      {showAnalysisAnimation && (
                        <span className="ml-2 text-xs">(Animation Active)</span>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
