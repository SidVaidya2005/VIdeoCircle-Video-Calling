import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.js"],
    env: {
      MONGO_URL: "mongodb://localhost:27017/videocircle-test",
      LIVEKIT_API_KEY: "test-api-key",
      LIVEKIT_API_SECRET: "test-api-secret-must-be-long-enough-for-signing",
      LIVEKIT_URL: "wss://test.livekit.cloud",
    },
  },
});
