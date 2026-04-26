import { Router } from "express";

import { validate } from "../../middleware/validate.js";
import { tokenLimiter } from "../../middleware/rateLimit.js";
import { getTokenSchema } from "./meet.validation.js";
import { getToken } from "./meet.controller.js";

const router = Router();

router.get("/get-token", tokenLimiter, validate(getTokenSchema), getToken);

export default router;
