import { Router } from "express";
import UserModel from "../models/User";
const router = Router();
// GET /api/users/me - current user's profile
router.get("/me", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            profilePhoto: user.profilePhoto,
            personalInfo: user.personalInfo,
            pregnancyInfo: user.pregnancyInfo,
            medicalHistory: user.medicalHistory,
            foodPreferences: user.foodPreferences,
            lifestyleInfo: user.lifestyleInfo,
            isProfileComplete: user.isProfileComplete,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
// PUT /api/users/me - update comprehensive profile
router.put("/me", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { name, profilePhoto, personalInfo, pregnancyInfo, medicalHistory, foodPreferences, lifestyleInfo, isProfileComplete } = req.body;
        // Validate required fields
        if (name && typeof name !== 'string') {
            return res.status(400).json({ error: "Name must be a string" });
        }
        if (name && name.trim().length === 0) {
            return res.status(400).json({ error: "Name cannot be empty" });
        }
        const updateData = {};
        if (name)
            updateData.name = name.trim();
        if (profilePhoto)
            updateData.profilePhoto = profilePhoto;
        if (personalInfo)
            updateData.personalInfo = personalInfo;
        if (pregnancyInfo)
            updateData.pregnancyInfo = pregnancyInfo;
        if (medicalHistory)
            updateData.medicalHistory = medicalHistory;
        if (foodPreferences)
            updateData.foodPreferences = foodPreferences;
        if (lifestyleInfo)
            updateData.lifestyleInfo = lifestyleInfo;
        if (isProfileComplete !== undefined)
            updateData.isProfileComplete = isProfileComplete;
        // Validate personal info if provided
        if (personalInfo) {
            if (personalInfo.height && (isNaN(personalInfo.height) || personalInfo.height <= 0)) {
                return res.status(400).json({ error: "Height must be a positive number" });
            }
            if (personalInfo.weight && (isNaN(personalInfo.weight) || personalInfo.weight <= 0)) {
                return res.status(400).json({ error: "Weight must be a positive number" });
            }
            if (personalInfo.activityLevel && !['sedentary', 'light', 'moderate', 'active', 'very_active'].includes(personalInfo.activityLevel)) {
                return res.status(400).json({ error: "Invalid activity level" });
            }
        }
        // Validate medical history if provided
        if (medicalHistory) {
            if (medicalHistory.bloodType && !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(medicalHistory.bloodType)) {
                return res.status(400).json({ error: "Invalid blood type" });
            }
        }
        const updated = await UserModel.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true });
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            id: String(updated._id),
            email: updated.email,
            name: updated.name,
            role: updated.role,
            profilePhoto: updated.profilePhoto,
            personalInfo: updated.personalInfo,
            pregnancyInfo: updated.pregnancyInfo,
            medicalHistory: updated.medicalHistory,
            foodPreferences: updated.foodPreferences,
            lifestyleInfo: updated.lifestyleInfo,
            isProfileComplete: updated.isProfileComplete,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt,
        });
    }
    catch (error) {
        console.error("Profile update error:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: "Validation error", details: error.message });
        }
        res.status(500).json({ error: "Failed to update profile" });
    }
});
// POST /api/users/upload-photo - upload profile photo
router.post("/upload-photo", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { photoData } = req.body; // Base64 encoded image
        if (!photoData) {
            return res.status(400).json({ error: "No photo data provided" });
        }
        // Validate base64 format
        if (!photoData.startsWith('data:image/')) {
            return res.status(400).json({ error: "Invalid image format. Please provide a valid image file." });
        }
        // Extract base64 data and validate size
        const base64Data = photoData.split(',')[1];
        if (!base64Data) {
            return res.status(400).json({ error: "Invalid image data format" });
        }
        // Calculate file size (base64 is ~33% larger than binary)
        const fileSizeInBytes = Math.ceil((base64Data.length * 3) / 4);
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (fileSizeInBytes > maxSizeInBytes) {
            return res.status(400).json({ error: "Image size should be less than 5MB" });
        }
        // Validate image format
        const imageFormat = photoData.match(/data:image\/([^;]+)/)?.[1];
        if (!imageFormat || !['jpeg', 'jpg', 'png', 'gif', 'webp'].includes(imageFormat.toLowerCase())) {
            return res.status(400).json({ error: "Unsupported image format. Please use JPEG, PNG, GIF, or WebP." });
        }
        // For now, we'll store the base64 data directly
        // In production, you'd want to upload to a cloud service like AWS S3, Cloudinary, or similar
        const updated = await UserModel.findByIdAndUpdate(userId, { profilePhoto: photoData }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            profilePhoto: updated.profilePhoto,
            message: "Profile photo updated successfully"
        });
    }
    catch (error) {
        console.error("Photo upload error:", error);
        res.status(500).json({ error: "Failed to upload photo" });
    }
});
// DELETE /api/users/me - delete user account
router.delete("/me", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const deleted = await UserModel.findByIdAndDelete(userId);
        if (!deleted) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "Account deleted successfully" });
    }
    catch (error) {
        console.error("Account deletion error:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});
// DELETE /api/users/photo - delete profile photo
router.delete("/photo", async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const updated = await UserModel.findByIdAndUpdate(userId, { profilePhoto: null }, { new: true });
        if (!updated) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({
            profilePhoto: null,
            message: "Profile photo deleted successfully"
        });
    }
    catch (error) {
        console.error("Photo deletion error:", error);
        res.status(500).json({ error: "Failed to delete profile photo" });
    }
});
export default router;
