import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Heart, ChevronRight, ChevronLeft } from "lucide-react";
import { NutriCareLogo } from "@/components/NutriCareLogo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { profileAPI } from "../../shared/api";

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const totalSteps = 4;

  const [personalInfo, setPersonalInfo] = useState({
    age: "",
    height: "",
    weight: "",
    activityLevel: "",
    healthGoals: [] as string[],
  });

  const [pregnancyInfo, setPregnancyInfo] = useState({
    dueDate: "",
    gestationAge: "",
    trimester: "",
    isMultiple: false,
    multipleType: "",
    multipleCount: "",
    complications: "",
    expectedWeightGain: "",
    previousPregnancies: "",
    lastCheckupDate: "",
  });

  const [medicalHistory, setMedicalHistory] = useState({
    surgeries: "",
    chronicDiseases: [] as string[],
    allergies: "",
    currentMedications: "",
    bloodPressure: "",
    bloodType: "",
  });

  const [foodPreferences, setFoodPreferences] = useState({
    cuisineTypes: [] as string[],
    dietaryRestrictions: [] as string[],
    dislikedFoods: "",
  });

  const progressPercentage = (step / totalSteps) * 100;

  const handleNext = () => {
    // Validation for medical history step (step 3)
    if (step === 3) {
      if (medicalHistory.chronicDiseases.length === 0) {
        toast.error(
          "Please select your chronic diseases or 'None of the above'",
        );
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Transform the form data to match the API structure
      const profileData = {
        personalInfo: {
          height: personalInfo.height ? parseFloat(personalInfo.height) : undefined,
          weight: personalInfo.weight ? parseFloat(personalInfo.weight) : undefined,
          activityLevel: personalInfo.activityLevel as "sedentary" | "light" | "moderate" | "active" | "very_active" | undefined,
          healthGoals: personalInfo.healthGoals,
        },
        pregnancyInfo: (user?.role === "pregnant" || user?.role === "lactating") ? {
          dueDate: pregnancyInfo.dueDate || undefined,
          gestationAge: pregnancyInfo.gestationAge ? parseInt(pregnancyInfo.gestationAge) : undefined,
          trimester: pregnancyInfo.trimester ? parseInt(pregnancyInfo.trimester) as 1 | 2 | 3 : undefined,
          isMultiple: pregnancyInfo.isMultiple,
          multipleDetails: pregnancyInfo.isMultiple ? {
            type: pregnancyInfo.multipleType as "twins" | "triplets" | "other",
            count: pregnancyInfo.multipleCount ? parseInt(pregnancyInfo.multipleCount) : undefined,
          } : undefined,
          complications: pregnancyInfo.complications ? [pregnancyInfo.complications] : [],
          expectedWeightGain: pregnancyInfo.expectedWeightGain ? parseFloat(pregnancyInfo.expectedWeightGain) : undefined,
          previousPregnancies: {
            count: 0, // This would need to be parsed from the text input
            complications: [],
            outcomes: [],
          },
          lastCheckupDate: pregnancyInfo.lastCheckupDate || undefined,
        } : undefined,
        medicalHistory: {
          surgeries: medicalHistory.surgeries ? [{
            procedure: medicalHistory.surgeries,
            date: new Date().toISOString().split('T')[0], // Default to today
            complications: undefined,
          }] : [],
          chronicDiseases: medicalHistory.chronicDiseases,
          allergies: medicalHistory.allergies ? [medicalHistory.allergies] : [],
          currentMedications: medicalHistory.currentMedications ? [{
            name: medicalHistory.currentMedications,
            dosage: "As prescribed",
            frequency: "As prescribed",
          }] : [],
          bloodType: medicalHistory.bloodType || undefined,
        },
        foodPreferences: {
          cuisineTypes: foodPreferences.cuisineTypes,
          dietaryRestrictions: foodPreferences.dietaryRestrictions,
          dislikedFoods: foodPreferences.dislikedFoods ? [foodPreferences.dislikedFoods] : [],
        },
        isProfileComplete: true,
      };

      // Save the profile data to the backend
      await profileAPI.updateProfile(profileData);
      
      // Refresh the user profile data
      await refreshProfile();
      
      toast.success("Profile setup completed!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to save profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleHealthGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setPersonalInfo({
        ...personalInfo,
        healthGoals: [...personalInfo.healthGoals, goal],
      });
    } else {
      setPersonalInfo({
        ...personalInfo,
        healthGoals: personalInfo.healthGoals.filter((g) => g !== goal),
      });
    }
  };

  const handleChronicDiseaseChange = (disease: string, checked: boolean) => {
    if (checked) {
      setMedicalHistory({
        ...medicalHistory,
        chronicDiseases: [...medicalHistory.chronicDiseases, disease],
      });
    } else {
      setMedicalHistory({
        ...medicalHistory,
        chronicDiseases: medicalHistory.chronicDiseases.filter(
          (d) => d !== disease,
        ),
      });
    }
  };

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    if (checked) {
      setFoodPreferences({
        ...foodPreferences,
        cuisineTypes: [...foodPreferences.cuisineTypes, cuisine],
      });
    } else {
      setFoodPreferences({
        ...foodPreferences,
        cuisineTypes: foodPreferences.cuisineTypes.filter((c) => c !== cuisine),
      });
    }
  };

  const handleDietaryRestrictionChange = (
    restriction: string,
    checked: boolean,
  ) => {
    if (checked) {
      setFoodPreferences({
        ...foodPreferences,
        dietaryRestrictions: [
          ...foodPreferences.dietaryRestrictions,
          restriction,
        ],
      });
    } else {
      setFoodPreferences({
        ...foodPreferences,
        dietaryRestrictions: foodPreferences.dietaryRestrictions.filter(
          (r) => r !== restriction,
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-lavender-50 to-peach-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <NutriCareLogo size="md" />
            <span className="ml-2 text-2xl font-bold text-rose-900 font-quicksand">
              NutriCare
            </span>
          </div>
          <h1 className="text-3xl font-bold text-rose-900 mb-2">
            Complete Your Health Profile
          </h1>
          <p className="text-rose-600">
            Help us create the perfect nutrition plan for you
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-rose-600 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-rose-100 shadow-xl">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="text-rose-900">
                  Personal Information
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Tell us about your basic health metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-rose-700">
                      Age
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={personalInfo.age}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          age: e.target.value,
                        })
                      }
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-rose-700">
                      Height (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="165"
                      value={personalInfo.height}
                      onChange={(e) =>
                        setPersonalInfo({
                          ...personalInfo,
                          height: e.target.value,
                        })
                      }
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="weight" className="text-rose-700">
                    Current Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="60"
                    value={personalInfo.weight}
                    onChange={(e) =>
                      setPersonalInfo({
                        ...personalInfo,
                        weight: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label className="text-rose-700">Activity Level</Label>
                  <Select
                    value={personalInfo.activityLevel}
                    onValueChange={(value) =>
                      setPersonalInfo({ ...personalInfo, activityLevel: value })
                    }
                  >
                    <SelectTrigger className="border-rose-200 focus:border-rose-500">
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
                      <SelectItem value="very_active">
                        Very Active (very hard exercise, physical job)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-rose-700 mb-3 block">
                    Health Goals (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Healthy weight gain",
                      "Manage gestational diabetes",
                      "Increase energy",
                      "Improve nutrition",
                      "Reduce nausea",
                      "Better sleep",
                    ].map((goal) => (
                      <div key={goal} className="flex items-center space-x-2">
                        <Checkbox
                          id={goal}
                          checked={personalInfo.healthGoals.includes(goal)}
                          onCheckedChange={(checked) =>
                            handleHealthGoalChange(goal, checked as boolean)
                          }
                        />
                        <Label htmlFor={goal} className="text-sm text-rose-700">
                          {goal}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: Pregnancy Information */}
          {step === 2 && user?.role === "pregnant" && (
            <>
              <CardHeader>
                <CardTitle className="text-rose-900">
                  Pregnancy Information
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Help us understand your pregnancy journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate" className="text-rose-700">
                      Due Date
                    </Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={pregnancyInfo.dueDate}
                      onChange={(e) =>
                        setPregnancyInfo({
                          ...pregnancyInfo,
                          dueDate: e.target.value,
                        })
                      }
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gestationAge" className="text-rose-700">
                      Current Week
                    </Label>
                    <Input
                      id="gestationAge"
                      type="number"
                      placeholder="20"
                      value={pregnancyInfo.gestationAge}
                      onChange={(e) =>
                        setPregnancyInfo({
                          ...pregnancyInfo,
                          gestationAge: e.target.value,
                        })
                      }
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-rose-700">Current Trimester</Label>
                  <Select
                    value={pregnancyInfo.trimester}
                    onValueChange={(value) =>
                      setPregnancyInfo({ ...pregnancyInfo, trimester: value })
                    }
                  >
                    <SelectTrigger className="border-rose-200 focus:border-rose-500">
                      <SelectValue placeholder="Select trimester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        First Trimester (1-12 weeks)
                      </SelectItem>
                      <SelectItem value="2">
                        Second Trimester (13-26 weeks)
                      </SelectItem>
                      <SelectItem value="3">
                        Third Trimester (27-40 weeks)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isMultiple"
                    checked={pregnancyInfo.isMultiple}
                    onCheckedChange={(checked) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        isMultiple: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="isMultiple" className="text-rose-700">
                    Multiple pregnancy (twins, triplets, etc.)
                  </Label>
                </div>

                {pregnancyInfo.isMultiple && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-rose-700">Type</Label>
                      <Select
                        value={pregnancyInfo.multipleType}
                        onValueChange={(value) =>
                          setPregnancyInfo({
                            ...pregnancyInfo,
                            multipleType: value,
                          })
                        }
                      >
                        <SelectTrigger className="border-rose-200 focus:border-rose-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twins">Twins</SelectItem>
                          <SelectItem value="triplets">Triplets</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="multipleCount" className="text-rose-700">
                        Number of babies
                      </Label>
                      <Input
                        id="multipleCount"
                        type="number"
                        placeholder="2"
                        value={pregnancyInfo.multipleCount}
                        onChange={(e) =>
                          setPregnancyInfo({
                            ...pregnancyInfo,
                            multipleCount: e.target.value,
                          })
                        }
                        className="border-rose-200 focus:border-rose-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="complications" className="text-rose-700">
                    Any complications or concerns?
                  </Label>
                  <Textarea
                    id="complications"
                    placeholder="Please describe any pregnancy complications or concerns..."
                    value={pregnancyInfo.complications}
                    onChange={(e) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        complications: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="expectedWeightGain" className="text-rose-700">
                    Expected Weight Gain (kg)
                  </Label>
                  <Input
                    id="expectedWeightGain"
                    type="number"
                    placeholder="12"
                    value={pregnancyInfo.expectedWeightGain}
                    onChange={(e) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        expectedWeightGain: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="previousPregnancies"
                    className="text-rose-700"
                  >
                    Previous pregnancies
                  </Label>
                  <Textarea
                    id="previousPregnancies"
                    placeholder="Number of previous pregnancies and any relevant details..."
                    value={pregnancyInfo.previousPregnancies}
                    onChange={(e) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        previousPregnancies: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="lastCheckupDate" className="text-rose-700">
                    Last Checkup Date
                  </Label>
                  <Input
                    id="lastCheckupDate"
                    type="date"
                    value={pregnancyInfo.lastCheckupDate}
                    onChange={(e) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        lastCheckupDate: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2 Alternative: Lactation Information */}
          {step === 2 && user?.role === "lactating" && (
            <>
              <CardHeader>
                <CardTitle className="text-rose-900">
                  Lactation Information
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Tell us about your breastfeeding journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="babyAge" className="text-rose-700">
                    Baby's Age (months)
                  </Label>
                  <Input
                    id="babyAge"
                    type="number"
                    placeholder="3"
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
                <div>
                  <Label className="text-rose-700">Feeding Type</Label>
                  <Select>
                    <SelectTrigger className="border-rose-200 focus:border-rose-500">
                      <SelectValue placeholder="Select feeding type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">
                        Exclusive breastfeeding
                      </SelectItem>
                      <SelectItem value="combination">
                        Combination feeding
                      </SelectItem>
                      <SelectItem value="pumping">Pumping only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="lactationConcerns" className="text-rose-700">
                    Any lactation concerns?
                  </Label>
                  <Textarea
                    id="lactationConcerns"
                    placeholder="Low milk supply, engorgement, etc..."
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="lastCheckupDate" className="text-rose-700">
                    Last Checkup Date
                  </Label>
                  <Input
                    id="lastCheckupDate"
                    type="date"
                    value={pregnancyInfo.lastCheckupDate}
                    onChange={(e) =>
                      setPregnancyInfo({
                        ...pregnancyInfo,
                        lastCheckupDate: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: Medical History */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-rose-900">Medical History</CardTitle>
                <CardDescription className="text-rose-600">
                  Share your medical background for personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="surgeries" className="text-rose-700">
                    Past surgeries
                  </Label>
                  <Textarea
                    id="surgeries"
                    placeholder="List any previous surgeries and dates..."
                    value={medicalHistory.surgeries}
                    onChange={(e) =>
                      setMedicalHistory({
                        ...medicalHistory,
                        surgeries: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label className="text-rose-700 mb-3 block">
                    Chronic diseases (select all that apply) *
                  </Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Diabetes",
                        "Hypertension",
                        "Thyroid disorders",
                        "PCOS",
                        "Anemia",
                        "Heart disease",
                      ].map((disease) => (
                        <div
                          key={disease}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={disease}
                            checked={medicalHistory.chronicDiseases.includes(
                              disease,
                            )}
                            onCheckedChange={(checked) =>
                              handleChronicDiseaseChange(
                                disease,
                                checked as boolean,
                              )
                            }
                            disabled={medicalHistory.chronicDiseases.includes(
                              "None of the above",
                            )}
                          />
                          <Label
                            htmlFor={disease}
                            className={`text-sm text-rose-700 ${
                              medicalHistory.chronicDiseases.includes(
                                "None of the above",
                              )
                                ? "opacity-50"
                                : ""
                            }`}
                          >
                            {disease}
                          </Label>
                        </div>
                      ))}
                    </div>

                    {/* Separator */}
                    <div className="border-t border-rose-200 pt-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="none-chronic"
                          checked={medicalHistory.chronicDiseases.includes(
                            "None of the above",
                          )}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setMedicalHistory({
                                ...medicalHistory,
                                chronicDiseases: ["None of the above"],
                              });
                            } else {
                              setMedicalHistory({
                                ...medicalHistory,
                                chronicDiseases: [],
                              });
                            }
                          }}
                        />
                        <Label
                          htmlFor="none-chronic"
                          className="text-sm text-rose-700 font-medium"
                        >
                          None of the above
                        </Label>
                      </div>
                    </div>
                  </div>

                  {medicalHistory.chronicDiseases.length === 0 && (
                    <p className="text-red-500 text-sm mt-2">
                      * Please select at least one option or "None of the above"
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="allergies" className="text-rose-700">
                    Food allergies
                  </Label>
                  <Input
                    id="allergies"
                    placeholder="e.g., nuts, shellfish, dairy..."
                    value={medicalHistory.allergies}
                    onChange={(e) =>
                      setMedicalHistory({
                        ...medicalHistory,
                        allergies: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div>
                  <Label htmlFor="currentMedications" className="text-rose-700">
                    Current medications
                  </Label>
                  <Textarea
                    id="currentMedications"
                    placeholder="List current medications and supplements..."
                    value={medicalHistory.currentMedications}
                    onChange={(e) =>
                      setMedicalHistory({
                        ...medicalHistory,
                        currentMedications: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bloodPressure" className="text-rose-700">
                      Blood Pressure
                    </Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={medicalHistory.bloodPressure}
                      onChange={(e) =>
                        setMedicalHistory({
                          ...medicalHistory,
                          bloodPressure: e.target.value,
                        })
                      }
                      className="border-rose-200 focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodType" className="text-rose-700">
                      Blood Type
                    </Label>
                    <Select
                      value={medicalHistory.bloodType}
                      onValueChange={(value) =>
                        setMedicalHistory({
                          ...medicalHistory,
                          bloodType: value,
                        })
                      }
                    >
                      <SelectTrigger className="border-rose-200 focus:border-rose-500">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: Food Preferences */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="text-rose-900">
                  Food Preferences
                </CardTitle>
                <CardDescription className="text-rose-600">
                  Help us customize your meal plans to your taste
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-rose-700 mb-3 block">
                    Preferred cuisines (select all that apply)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "Indian",
                      "Italian",
                      "Mexican",
                      "Chinese",
                      "Mediterranean",
                      "American",
                      "Thai",
                      "Japanese",
                      "Middle Eastern",
                    ].map((cuisine) => (
                      <div
                        key={cuisine}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={cuisine}
                          checked={foodPreferences.cuisineTypes.includes(
                            cuisine,
                          )}
                          onCheckedChange={(checked) =>
                            handleCuisineChange(cuisine, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={cuisine}
                          className="text-sm text-rose-700"
                        >
                          {cuisine}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-rose-700 mb-3 block">
                    Dietary restrictions (select all that apply)
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Vegetarian",
                      "Vegan",
                      "Gluten-free",
                      "Dairy-free",
                      "Low-carb",
                      "Halal",
                      "Kosher",
                      "Low-sodium",
                    ].map((restriction) => (
                      <div
                        key={restriction}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={restriction}
                          checked={foodPreferences.dietaryRestrictions.includes(
                            restriction,
                          )}
                          onCheckedChange={(checked) =>
                            handleDietaryRestrictionChange(
                              restriction,
                              checked as boolean,
                            )
                          }
                        />
                        <Label
                          htmlFor={restriction}
                          className="text-sm text-rose-700"
                        >
                          {restriction}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="dislikedFoods" className="text-rose-700">
                    Foods you dislike or want to avoid
                  </Label>
                  <Textarea
                    id="dislikedFoods"
                    placeholder="e.g., mushrooms, spicy food, seafood..."
                    value={foodPreferences.dislikedFoods}
                    onChange={(e) =>
                      setFoodPreferences({
                        ...foodPreferences,
                        dislikedFoods: e.target.value,
                      })
                    }
                    className="border-rose-200 focus:border-rose-500"
                  />
                </div>
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between p-6 pt-0">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
              className="border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700"
              >
                {isLoading ? "Saving..." : "Complete Setup"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
