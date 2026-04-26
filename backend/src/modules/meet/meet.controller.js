import { generateLiveKitToken } from "./meet.service.js";

export async function getToken(req, res) {
  const { room, username } = req.validated.query;
  const result = await generateLiveKitToken({ room, username });
  res.status(200).json(result);
}
