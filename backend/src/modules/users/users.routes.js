import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { requireAuth } from "../../middleware/auth.js";
import {
  loginLimiter,
  registerLimiter,
  verifyLimiter,
  historyLimiter,
} from "../../middleware/rateLimit.js";
import {
  registerSchema,
  loginSchema,
  addHistorySchema,
} from "./users.validation.js";
import {
  register,
  login,
  verify,
  addHistory,
  getHistory,
} from "./users.controller.js";

const router = Router();

router.post("/register", registerLimiter, validate(registerSchema), register);
router.post("/login", loginLimiter, validate(loginSchema), login);
router.get("/verify", verifyLimiter, requireAuth, verify);
router.post("/add_to_activity", historyLimiter, requireAuth, validate(addHistorySchema), addHistory);
router.get("/get_all_activity", historyLimiter, requireAuth, getHistory);

export default router;
