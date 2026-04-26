import rateLimit from "express-rate-limit";

const baseConfig = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
};

export const loginLimiter = rateLimit(baseConfig);
export const registerLimiter = rateLimit(baseConfig);
export const verifyLimiter = rateLimit(baseConfig);
export const historyLimiter = rateLimit(baseConfig);
export const tokenLimiter = rateLimit(baseConfig);
