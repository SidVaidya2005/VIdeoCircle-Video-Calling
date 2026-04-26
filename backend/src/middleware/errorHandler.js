import { logger } from "../utils/logger.js";

export function errorHandler(err, req, res, next) {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.message || "Internal server error";

  if (status >= 500) {
    logger.error(`${req.method} ${req.originalUrl} →`, err);
  }

  res.status(status).json({ status, message });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ status: 404, message: `Not found: ${req.method} ${req.originalUrl}` });
}
