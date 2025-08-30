import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "pregnant" | "lactating";
  profilePhoto?: string;
  personalInfo?: {
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    emergencyContact?: string;
    bio?: string;
    height?: number;
    weight?: number;
    activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
    healthGoals?: string[];
  };
  pregnancyInfo?: {
    dueDate?: string;
    gestationAge?: number;
    trimester?: 1 | 2 | 3;
    isMultiple?: boolean;
    multipleType?: "twins" | "triplets" | "other";
    multipleCount?: number;
    complications?: string[];
    expectedWeightGain?: number;
    previousPregnancies?: {
      count: number;
      complications?: string[];
      outcomes?: string[];
    };
    lastCheckupDate?: string;
  };
  medicalHistory?: {
    surgeries?: {
      procedure: string;
      date: string;
      complications?: string;
    }[];
    chronicDiseases?: string[];
    allergies?: string[];
    currentMedications?: {
      name: string;
      dosage: string;
      frequency: string;
    }[];
    bloodType?: string;
  };
  foodPreferences?: {
    cuisineTypes?: string[];
    dietaryRestrictions?: string[];
    dietPreference?: "vegetarian" | "non-vegetarian" | "vegan";
    foodAllergies?: string[];
    religiousCulturalRestrictions?: string[];
    dislikedFoods?: string[];
  };
  lifestyleInfo?: {
    sleepHours?: number;
    waterIntake?: number;
    currentSupplements?: string[];
    isHighRisk?: boolean;
  };
  isProfileComplete?: boolean;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["pregnant", "lactating"], required: true },
    profilePhoto: String,
    personalInfo: {
      phone: String,
      address: String,
      dateOfBirth: String,
      emergencyContact: String,
      bio: String,
      height: Number,
      weight: Number,
      activityLevel: String,
      healthGoals: [String],
    },
    pregnancyInfo: {
      dueDate: String,
      gestationAge: Number,
      trimester: Number,
      isMultiple: Boolean,
      multipleType: String,
      multipleCount: Number,
      complications: [String],
      expectedWeightGain: Number,
      previousPregnancies: {
        count: Number,
        complications: [String],
        outcomes: [String],
      },
      lastCheckupDate: String,
    },
    medicalHistory: {
      surgeries: [
        {
          procedure: String,
          date: String,
          complications: String,
        },
      ],
      chronicDiseases: [String],
      allergies: [String],
      currentMedications: [
        {
          name: String,
          dosage: String,
          frequency: String,
        },
      ],
      bloodType: String,
    },
    foodPreferences: {
      cuisineTypes: [String],
      dietaryRestrictions: [String],
      dietPreference: String,
      foodAllergies: [String],
      religiousCulturalRestrictions: [String],
      dislikedFoods: [String],
    },
    lifestyleInfo: {
      sleepHours: Number,
      waterIntake: Number,
      currentSupplements: [String],
      isHighRisk: Boolean,
    },
    isProfileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);