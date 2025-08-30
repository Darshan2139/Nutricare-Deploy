import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthRequest extends Request {
  user?: { id: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function signToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}