import { describe, it, expect } from "vitest";
import request from "supertest";

import { createApp } from "../createApp.js";

const app = createApp();

describe("app smoke tests", () => {
  it("returns 404 with a structured error for unknown routes", async () => {
    const res = await request(app).get("/nonexistent-route");
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({ status: 404 });
    expect(res.body.message).toContain("Not found");
  });

  it("accepts CORS preflight requests", async () => {
    const res = await request(app)
      .options("/api/v1/users/login")
      .set("Origin", "http://localhost:3000")
      .set("Access-Control-Request-Method", "POST");
    expect(res.status).toBeLessThan(500);
    expect(res.headers["access-control-allow-origin"]).toBeDefined();
  });
});

describe("POST /api/v1/users/register validation", () => {
  it("rejects an empty body with 400 and lists missing fields", async () => {
    const res = await request(app).post("/api/v1/users/register").send({});
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ status: 400 });
    expect(Array.isArray(res.body.issues)).toBe(true);
    expect(res.body.issues.length).toBeGreaterThan(0);
  });

  it("rejects partial input", async () => {
    const res = await request(app)
      .post("/api/v1/users/register")
      .send({ username: "alice" });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/v1/users/login validation", () => {
  it("rejects an empty body with 400", async () => {
    const res = await request(app).post("/api/v1/users/login").send({});
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(400);
  });
});

describe("GET /api/v1/meet/get-token validation", () => {
  it("rejects missing query params with 400", async () => {
    const res = await request(app).get("/api/v1/meet/get-token");
    expect(res.status).toBe(400);
    expect(res.body.status).toBe(400);
  });
});

describe("auth middleware", () => {
  it("returns 401 when accessing a protected route without a token", async () => {
    const res = await request(app).get("/api/v1/users/verify");
    expect(res.status).toBe(401);
  });
});
