import { apiClient } from "../../../shared/lib/apiClient";

export const authApi = {
  register: ({ name, username, password }) =>
    apiClient.post("/users/register", { name, username, password }).then((r) => r.data),

  login: ({ username, password }) =>
    apiClient.post("/users/login", { username, password }).then((r) => r.data),

  verify: () =>
    apiClient.get("/users/verify").then((r) => r.data),

  getHistory: () =>
    apiClient.get("/users/get_all_activity").then((r) => r.data),

  addHistory: ({ meetingCode }) =>
    apiClient.post("/users/add_to_activity", { meetingCode }).then((r) => r.data),
};
