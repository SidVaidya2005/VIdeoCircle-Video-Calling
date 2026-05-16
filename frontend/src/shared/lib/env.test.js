import { env } from "./env";

describe("env", () => {
  test("serverUrl is a non-empty string", () => {
    expect(typeof env.serverUrl).toBe("string");
    expect(env.serverUrl.length).toBeGreaterThan(0);
  });

  test("livekitUrl is read from process.env (may be undefined in tests)", () => {
    expect(env.livekitUrl).toBe(process.env.REACT_APP_LIVEKIT_URL);
  });
});
