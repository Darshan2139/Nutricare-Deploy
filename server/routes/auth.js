import bcrypt from "bcryptjs";
import { signToken } from "../middleware/auth";
import UserModel from "../models/User";
export const handleRegister = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const existing = await UserModel.findOne({ email });
        if (existing)
            return res.status(400).json({ error: "User already exists" });
        const hashed = await bcrypt.hash(password, 10);
        const created = await UserModel.create({
            email,
            name,
            role,
            password: hashed,
        });
        const token = signToken(String(created._id));
        res.status(201).json({
            user: {
                id: String(created._id),
                email: created.email,
                name: created.name,
                role: created.role,
                profilePhoto: created.profilePhoto,
                personalInfo: created.personalInfo,
                pregnancyInfo: created.pregnancyInfo,
                medicalHistory: created.medicalHistory,
                foodPreferences: created.foodPreferences,
                lifestyleInfo: created.lifestyleInfo,
                isProfileComplete: created.isProfileComplete,
                createdAt: created.createdAt.toISOString(),
                updatedAt: created.updatedAt.toISOString(),
            },
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Registration failed" });
    }
};
export const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Email and password required" });
        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = signToken(String(user._id));
        res.json({
            user: {
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
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
            },
            token,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Login failed" });
    }
};
export const handleLogout = async (_req, res) => {
    res.json({ message: "Logged out successfully" });
};
export const handleGetProfile = async (req, res) => {
    try {
        const authReq = req;
        if (!authReq.user?.id)
            return res.status(401).json({ error: "Unauthorized" });
        const user = await UserModel.findById(authReq.user.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json({
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
            profilePhoto: user.profilePhoto,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to get profile" });
    }
};
