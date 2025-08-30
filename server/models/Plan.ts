import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPlan extends Document {
  userId: Types.ObjectId;
  healthEntryId: Types.ObjectId;
  planType: "ai_generated" | "custom";
  status: "active" | "completed" | "archived";
  overallScore: number;
  analysisDate: Date;
  recommendations: string[];
  nutritionalInsights: {
    strengths: string[];
    concerns: string[];
    priorities: string[];
  };
  weeklyMealPlan: Record<string, any>;
  supplements: string[];
  restrictions: string[];
  dailyTargets?: {
    calories: number;
    protein: number;
    iron: number;
    calcium: number;
    folate: number;
    vitaminD: number;
  };
  validFrom?: Date;
  validTo?: Date;
  isActive: boolean;
}

const PlanSchema = new Schema<IPlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    healthEntryId: { type: Schema.Types.ObjectId, ref: "HealthEntry", required: true },
    planType: { type: String, enum: ["ai_generated", "custom"], default: "ai_generated" },
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
    overallScore: { type: Number, default: 0 },
    analysisDate: { type: Date, default: Date.now },
    recommendations: [String],
    nutritionalInsights: {
      strengths: [String],
      concerns: [String],
      priorities: [String],
    },
    weeklyMealPlan: { type: Schema.Types.Mixed, default: {} },
    supplements: [String],
    restrictions: [String],
    dailyTargets: {
      calories: Number,
      protein: Number,
      iron: Number,
      calcium: Number,
      folate: Number,
      vitaminD: Number,
    },
    validFrom: Date,
    validTo: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model<IPlan>("Plan", PlanSchema);