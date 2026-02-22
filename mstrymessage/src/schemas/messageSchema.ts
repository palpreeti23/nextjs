import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .min(10, "message should atleast be of 10 characters")
    .max(300, "message shouldn't be longer than 300 characters"),
});
