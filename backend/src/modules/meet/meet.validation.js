import { z } from "zod";

export const getTokenSchema = z.object({
  query: z.object({
    room: z.string().trim().min(1, "room is required"),
    username: z.string().trim().min(1, "username is required"),
  }),
});
