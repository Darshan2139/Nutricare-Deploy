import mongoose, { Schema } from "mongoose";
const PlanSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
