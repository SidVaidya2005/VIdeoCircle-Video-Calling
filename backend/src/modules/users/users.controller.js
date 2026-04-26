import {
  registerUser,
  loginUser,
  addMeetingToHistory,
  getUserMeetingHistory,
} from "./users.service.js";

export async function register(req, res) {
  const result = await registerUser(req.validated.body);
  res.status(201).json(result);
}

export async function login(req, res) {
  const result = await loginUser(req.validated.body);
  res.status(200).json(result);
}

export async function verify(req, res) {
  res.status(200).json({ message: "Valid" });
}

export async function addHistory(req, res) {
  const { meetingCode } = req.validated.body;
  const result = await addMeetingToHistory({
    username: req.user.username,
    meetingCode,
  });
  res.status(201).json(result);
}

export async function getHistory(req, res) {
  const meetings = await getUserMeetingHistory({ username: req.user.username });
  res.status(200).json(meetings);
}
