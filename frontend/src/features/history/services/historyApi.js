import { apiClient } from "../../../shared/lib/apiClient";

export const historyApi = {
  getHistory: () =>
    apiClient.get("/users/get_all_activity").then((r) => r.data),

  addHistory: ({ meetingCode }) =>
    apiClient.post("/users/add_to_activity", { meetingCode }).then((r) => r.data),
};
