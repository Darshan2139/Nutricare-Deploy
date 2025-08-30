import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
export function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = header.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = { id: payload.id };
        next();
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
}
export function signToken(id) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
}
