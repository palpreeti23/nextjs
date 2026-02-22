import { email, z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username atleast be of 2 characters")
  .max(20, "username must not exceed 20 characters")
  .regex(/^[A-Za-z0-9_]+$/, "username must not contain any spacial character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invalid email address" }),
  password: z
    .string()
    .min(6, { message: "password should atleast be of 6 characters" }),
});
