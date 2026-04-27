import { apiClient } from "../../../shared/lib/apiClient";

export const authApi = {
  register: ({ name, username, password }) =>
    apiClient.post("/users/register", { name, username, password }).then((r) => r.data),

  login: ({ username, password }) =>
    apiClient.post("/users/login", { username, password }).then((r) => r.data),

  verify: () =>
    apiClient.get("/users/verify").then((r) => r.data),
};
