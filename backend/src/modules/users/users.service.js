import bcrypt from "bcrypt";
import { User } from "./users.model.js";
import { Meeting } from "./meeting.model.js";
import { AppError } from "../../utils/AppError.js";
import { generateSessionToken, sessionExpiry, isExpired } from "../../utils/tokens.js";

const BCRYPT_ROUNDS = 10;

export async function registerUser({ name, username, password }) {
  const existing = await User.findOne({ username: { $eq: username } });
  if (existing) {
    throw new AppError("User already exists", 409);
  }

  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
  await User.create({ name, username, password: hashed });
  return { message: "User registered" };
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new AppError("Invalid username or password", 401);
  }

  const token = generateSessionToken();
  user.token = token;
  user.tokenExpiry = sessionExpiry();
  await user.save();

  return { token };
}

export async function findUserByToken(token) {
  if (!token) return null;
  const user = await User.findOne({ token });
  if (!user) return null;

  if (isExpired(user.tokenExpiry)) {
    user.token = undefined;
    user.tokenExpiry = undefined;
    await user.save();
    return null;
  }

  return user;
}

export async function addMeetingToHistory({ username, meetingCode }) {
  await Meeting.create({ user_id: username, meetingCode });
  return { message: "Added code to history" };
}

export async function getUserMeetingHistory({ username }) {
  return Meeting.find({ user_id: username });
}
