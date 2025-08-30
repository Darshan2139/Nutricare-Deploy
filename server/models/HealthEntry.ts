import mongoose, { Schema, Document, Types } from "mongoose";

export interface IHealthEntry extends Document {
  userId: Types.ObjectId;
  entryDate: Date;
  age?: number;
  height?: number;
  weight?: number;
  bmi?: number;
  trimester?: 1 | 2 | 3;
  hemoglobinLevel?: number;
  bloodSugar?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  medicalHistory?: string[];
  vitaminD?: number;
  vitaminB12?: number;
  vitaminA?: number;
  vitaminC?: number;
  calcium?: number;
  ironLevels?: { serumFerritin?: number; hemoglobin?: number };
  dietPreference?: string;
  foodAllergies?: string[];
  religiousCulturalRestrictions?: string[];
  activityLevel?: string;
  sleepHours?: number;
  waterIntake?: number;
  isMultiple?: boolean;
  multipleType?: string;
  isHighRisk?: boolean;
  currentSupplements?: string[];
  notes?: string;
}

const HealthEntrySchema = new Schema<IHealthEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    entryDate: { type: Date, required: true },
    age: Number,
    height: Number,
    weight: Number,
    bmi: Number,
    trimester: Number,
    hemoglobinLevel: Number,
    bloodSugar: Number,
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    medicalHistory: [String],
    vitaminD: Number,
    vitaminB12: Number,
    vitaminA: Number,
    vitaminC: Number,
    calcium: Number,
    ironLevels: {
      serumFerritin: Number,
      hemoglobin: Number,
    },
    dietPreference: String,
    foodAllergies: [String],
    religiousCulturalRestrictions: [String],
    activityLevel: String,
    sleepHours: Number,
    waterIntake: Number,
    isMultiple: Boolean,
    multipleType: String,
    isHighRisk: Boolean,
    currentSupplements: [String],
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.HealthEntry || mongoose.model<IHealthEntry>("HealthEntry", HealthEntrySchema);