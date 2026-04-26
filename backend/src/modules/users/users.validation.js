import { z } from "zod";

const username = z.string().trim().min(1, "username is required");
const password = z.string().min(1, "password is required");
const name = z.string().trim().min(1, "name is required");

export const registerSchema = z.object({
  body: z.object({ name, username, password }),
});

export const loginSchema = z.object({
  body: z.object({ username, password }),
});

export const addHistorySchema = z.object({
  body: z
    .object({
      meetingCode: z.string().trim().min(1).optional(),
      meeting_code: z.string().trim().min(1).optional(),
    })
    .refine((b) => b.meetingCode || b.meeting_code, {
      message: "meetingCode is required",
      path: ["meetingCode"],
    })
    .transform((b) => ({ meetingCode: b.meetingCode ?? b.meeting_code })),
});
