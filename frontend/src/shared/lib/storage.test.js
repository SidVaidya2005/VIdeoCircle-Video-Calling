import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("setToken then getToken roundtrips", () => {
    storage.setToken("abc123");
    expect(storage.getToken()).toBe("abc123");
  });

  test("clearToken removes the token", () => {
    storage.setToken("abc123");
    storage.clearToken();
    expect(storage.getToken()).toBeNull();
  });

  test("getToken returns null when no token is set", () => {
    expect(storage.getToken()).toBeNull();
  });
});
