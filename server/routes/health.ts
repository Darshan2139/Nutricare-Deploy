import { Router } from "express";
import HealthEntryModel from "../models/HealthEntry";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/health/entries - Create manual health entry
router.post("/entries", async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const payload = req.body || {};
    const created = await HealthEntryModel.create({ ...payload, userId });
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create health entry" });
  }
});

// GET /api/health/entries - Get user's entries
router.get("/entries", async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const items = await HealthEntryModel.find({ userId }).sort({ createdAt: -1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch entries" });
  }
});

// GET /api/health/entries/:id
router.get("/entries/:id", async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const item = await HealthEntryModel.findOne({ _id: req.params.id, userId });
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch entry" });
  }
});

// PUT /api/health/entries/:id
router.put("/entries/:id", async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const updated = await HealthEntryModel.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: "Failed to update entry" });
  }
});

// DELETE /api/health/entries/:id
router.delete("/entries/:id", async (req, res) => {
  try {
    const userId = (req as AuthRequest).user?.id;
    const del = await HealthEntryModel.findOneAndDelete({ _id: req.params.id, userId });
    if (!del) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// GET /api/health/summary/:userId (simple summary)
router.get("/summary/:userId", async (req, res) => {
  try {
    const items = await HealthEntryModel.find({ userId: req.params.userId }).sort({ createdAt: -1 }).limit(10);
    res.json({ count: items.length, latest: items[0] || null });
  } catch (e) {
    res.status(500).json({ error: "Failed to get summary" });
  }
});

export default router;