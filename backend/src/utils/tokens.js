import crypto from "crypto";

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function generateSessionToken() {
  return crypto.randomBytes(20).toString("hex");
}

export function sessionExpiry() {
  return new Date(Date.now() + SESSION_TTL_MS);
}

export function isExpired(date) {
  return !date || new Date(date).getTime() < Date.now();
}
