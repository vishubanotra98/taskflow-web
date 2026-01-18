import { z } from "zod";

const hasLowercase = /[a-z]/;
const hasUppercase = /[A-Z]/;
const hasNumber = /\d/;
const hasSpecialChar = /[^A-Za-z0-9]/;
const hasNoSpaces = /^\S*$/;

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "First name should have atleast 3 characters.")
    .max(50, "First name should have atleast 3 characters."),
  lastName: z
    .string()
    .trim()
    .min(3, "Last name should have atleast 3 characters.")
    .max(50, "Last name should have atleast 3 characters."),

  email: z.string().email("E-mail must be a valid mail."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(hasLowercase, "Must contain at least one lowercase letter")
    .regex(hasUppercase, "Must contain at least one uppercase letter")
    .regex(hasNumber, "Must contain at least one number")
    .regex(hasSpecialChar, "Must contain at least one special character")
    .regex(hasNoSpaces, "Password cannot contain spaces"),
});

export const signInSchema = z.object({
  email: z.string().email("E-mail must be a valid mail."),
  password: z.string(),
});

export const registerUserWithConfirmSchema = userSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords donot match",
    path: ["confirmPassword"],
  });

export type RegisterUserWithConfirmSchema = z.infer<
  typeof registerUserWithConfirmSchema
>;
export type SignInSchema = z.infer<typeof signInSchema>;
