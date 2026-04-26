import { apiClient } from "../../../shared/lib/apiClient";

export async function fetchMeetingToken({ meetingCode, username }) {
  const { data } = await apiClient.get("/meet/get-token", {
    params: { room: meetingCode, username },
  });
  return data.token;
}
