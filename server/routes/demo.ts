import { RequestHandler } from "express";

export const handleDemo: RequestHandler = async (_req, res) => {
  res.json({ message: "Demo endpoint OK" });
};
