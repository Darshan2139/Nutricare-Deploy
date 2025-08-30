import mongoose, { Schema } from "mongoose";
const MealTrackingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    planId: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    date: { type: Date, required: true },
    mealType: {
        type: String,
        enum: ["breakfast", "lunch", "dinner", "snack"],
        required: true
    },
    mealName: { type: String, required: true },
    isCompleted: { type: Boolean, default: false },
    completedAt: Date,
    notes: String,
    caloriesConsumed: Number,
    nutrientsConsumed: {
        protein: Number,
        iron: Number,
        calcium: Number,
        folate: Number,
        vitaminD: Number,
    },
}, { timestamps: true });
// Compound index for efficient queries
MealTrackingSchema.index({ userId: 1, date: 1, mealType: 1 });
MealTrackingSchema.index({ userId: 1, planId: 1 });
export default mongoose.models.MealTracking || mongoose.model("MealTracking", MealTrackingSchema);
