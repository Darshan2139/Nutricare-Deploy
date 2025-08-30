import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
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
}, { timestamps: true });
export default mongoose.models.User || mongoose.model("User", UserSchema);
