export interface User {
  id: string;
  email: string;
  name: string;
  role: "pregnant" | "lactating";
  profilePhoto?: string;
  personalInfo?: PersonalInfo;
  pregnancyInfo?: PregnancyInfo;
  medicalHistory?: MedicalHistory;
  foodPreferences?: FoodPreferences;
  lifestyleInfo?: LifestyleInfo;
  isProfileComplete?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: "pregnant" | "lactating";
}

export interface PersonalInfo {
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  bio?: string;
  height?: number; // in cm
  weight?: number; // in kg
  bmi?: number; // auto-calculated or manual entry
  bodyMeasurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
  };
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  healthGoals?: string[];
  sleepHours?: number;
  waterIntake?: number; // liters per day
}

export interface PregnancyInfo {
  userId: string;
  dueDate: string;
  gestationAge: number; // in weeks
  trimester: 1 | 2 | 3;
  isMultiple: boolean;
  multipleDetails?: {
    type: "twins" | "triplets" | "other";
    count: number;
  };
  complications: string[];
  expectedWeightGain: number;
  previousPregnancies: {
    count: number;
    complications?: string[];
    outcomes?: string[];
  };
  lastCheckupDate?: string;
  isHighRisk: boolean;
  currentSupplements: string[]; // iron, folic acid, multivitamins, etc.
}

export interface MedicalHistory {
  userId: string;
  surgeries: {
    procedure: string;
    date: string;
    complications?: string;
  }[];
  chronicDiseases: string[];
  allergies: string[];
  currentMedications: {
    name: string;
    dosage: string;
    frequency: string;
  }[];
  bloodPressure: {
    systolic: number;
    diastolic: number;
    recordedAt: string;
  }[];
  bloodType: string;
  bloodTestResults: {
    testType: string;
    results: Record<string, any>;
    reportUrl?: string;
    uploadedAt: string;
  }[];
}

// New interface for comprehensive health data entry
export interface HealthMetrics {
  userId: string;
  // Medical Information
  hemoglobinLevel?: number; // g/dL - anemia risk
  bloodSugar?: number; // mg/dL - gestational diabetes risk
  bloodPressure?: {
    systolic: number;
    diastolic: number;
    recordedAt: string;
  };
  medicalHistory: string[]; // diabetes, hypertension, thyroid, etc.

  // Nutrition-related Lab Values
  vitaminD?: number; // ng/mL
  vitaminB12?: number; // pg/mL
  vitaminA?: number; // mg/L
  vitaminC?: number; // mg/dL
  calcium?: number; // mg/dL
  ironLevels?: {
    serumFerritin?: number;
    hemoglobin?: number; // if ferritin missing
  };

  recordedAt: string;
  notes?: string;
}

export interface FoodPreferences {
  userId: string;
  cuisineTypes: string[]; // 'Indian', 'Italian', 'Mexican', etc.
  dietaryRestrictions: string[]; // 'vegetarian', 'vegan', 'gluten-free', etc.
  dietPreference: "vegetarian" | "non-vegetarian" | "vegan";
  foodAllergies: string[]; // nuts, lactose, gluten, etc.
  religiousCulturalRestrictions: string[]; // halal, jain, kosher, etc.
  allergies: string[];
  dislikedFoods: string[];
  cravings: {
    food: string;
    intensity: 1 | 2 | 3 | 4 | 5;
    recordedAt: string;
  }[];
}

export interface LifestyleInfo {
  sleepHours?: number;
  waterIntake?: number; // liters per day
  currentSupplements?: string[];
  isHighRisk?: boolean;
}

// New interface for manual health data entry
export interface ManualHealthEntry {
  id: string;
  userId: string;
  entryDate: string;

  // Basic Demographics (some from profile)
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  bmi?: number;
  trimester?: 1 | 2 | 3;

  // Medical Information
  hemoglobinLevel?: number;
  bloodSugar?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  medicalHistory?: string[];

  // Nutrition-related Lab Values
  vitaminD?: number;
  vitaminB12?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  ironLevels?: {
    serumFerritin?: number;
    hemoglobin?: number;
  };

  // Dietary Preferences (some from profile)
  dietPreference?: string;
  foodAllergies?: string[];
  religiousCulturalRestrictions?: string[];

  // Lifestyle & Habits (some from profile)
  activityLevel?: string;
  sleepHours?: number;
  waterIntake?: number;

  // Special Conditions
  isMultiple?: boolean;
  multipleType?: string;
  isHighRisk?: boolean;
  currentSupplements?: string[];

  notes?: string;
  createdAt: string;
  updatedAt: string;
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
      breakfast?: { name: string; calories: number; nutrients: string[] };
      lunch?: { name: string; calories: number; nutrients: string[] };
      dinner?: { name: string; calories: number; nutrients: string[] };
    };
  };
  supplements: string[];
  restrictions: string[];
}

export interface DietPlan {
  id: string;
  userId: string;
  generatedAt: string;
  validFrom: string;
  validTo: string;
  meals: {
    type: "breakfast" | "lunch" | "dinner" | "snack";
    time: string;
    foods: {
      name: string;
      quantity: string;
      calories: number;
      nutrients: Record<string, number>;
    }[];
    totalCalories: number;
    totalNutrients: Record<string, number>;
  }[];
  weeklyGoals: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    vitamins: Record<string, number>;
  };
  feedback?: {
    rating: 1 | 2 | 3 | 4 | 5;
    comments: string;
    adjustments: string[];
  };
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  specialties: string[];
  location: {
    lat: number;
    lng: number;
  };
  distance?: number; // in km
  rating?: number;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: string;
  category: "nutrition" | "pregnancy" | "lactation" | "general";
}

export interface UserLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  week: number; // week of pregnancy or postpartum
  reportType: "blood_test" | "ultrasound" | "general_checkup" | "other";
  reportUrl: string;
  uploadedAt: string;
  aiAnalysis?: {
    recommendations: string[];
    concerns: string[];
    dietAdjustments: string[];
  };
}
