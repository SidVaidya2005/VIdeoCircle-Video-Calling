import { findUserByToken } from "../modules/users/users.service.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ status: 401, message: "Missing bearer token" });
    }

    const token = auth.slice(7);
    const user = await findUserByToken(token);
    if (!user) {
      return res.status(401).json({ status: 401, message: "Invalid or expired token" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
