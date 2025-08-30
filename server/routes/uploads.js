import { Router } from "express";
import { v2 as cloudinary } from "cloudinary";
// Configure Cloudinary using provided credentials or env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dx4kxhxno",
    api_key: process.env.CLOUDINARY_API_KEY || "452458768434938",
    api_secret: process.env.CLOUDINARY_API_SECRET || "WAcIcDMcffrXt8G8cA7SETcXNNc",
});
const router = Router();
// POST /api/uploads/image - expects base64 string or remote URL
router.post("/image", async (req, res) => {
    try {
        const { file, folder = "nutricare" } = req.body;
        if (!file)
            return res.status(400).json({ error: "file is required (base64 or URL)" });
        const result = await cloudinary.uploader.upload(file, { folder });
        res.json({ url: result.secure_url, publicId: result.public_id });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "Upload failed" });
    }
});
export default router;
