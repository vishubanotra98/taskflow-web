import { z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3)
    .max(50, "First name should have atleast 3 characters."),
  lastName: z
    .string()
    .trim()
    .min(3)
    .max(50, "Last name must not exceed 50 characters."),
});

export const userSchema = z.object({
  firstName: z.string().min(5).max(30).optional(),
  lastName: z.string().min(5).max(30).optional(),
  email: z.string().email(),
  password: z.string().min(5).max(25),
});
