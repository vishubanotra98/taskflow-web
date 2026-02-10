"use server";

import { executeAction } from "@/lib/executeAction";
import prisma from "@/lib/prisma";
import {
  RegisterUserWithConfirmSchema,
  SignInSchema,
  userSchema,
} from "@/lib/schema";
import { signIn, signOut } from "@/lib/auth";
import bcrypt from "bcrypt";
import { resend } from "@/helpers/verificationEmail";
import Email from "@/VerificationEmail/VerificationEmail";

export const google_signin = async () => {
  await signIn("google");
};

export const credentials_signIn = async (data: SignInSchema) => {
  return executeAction({
    actionFn: async () => await signIn("credentials", data),
  });
};

export const logOutAction = async () => {
  await executeAction({
    actionFn: async () => {
      await signOut();
    },
  });
};

export const signUpAction = async (formData: RegisterUserWithConfirmSchema) => {
  return executeAction({
    successMessage: "Verification code sent to your email.",
    actionFn: async () => {
      const validatedData = userSchema.parse(formData);

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        validatedData.password,
        saltRounds,
      );

      const verificationToken = Math.floor(
        100000 + Math.random() * 999999,
      ).toString();
      const tokenExpiryDate = new Date(Date.now() + 15 * 60 * 1000); //15 min

      const existingUser = await prisma.user.findFirst({
        where: { email: validatedData.email },
      });

      if (existingUser) {
        if (existingUser.emailVerified) {
          throw new Error("User with this email already exists.");
        }

        await prisma.user.update({
          where: { email: validatedData.email },
          data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            password: hashedPassword,
            tokenExpiry: tokenExpiryDate,
            verificationToken: verificationToken,
          },
        });
      } else {
        await prisma.user.create({
          data: {
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            password: hashedPassword,
            tokenExpiry: tokenExpiryDate,
            emailVerified: false,
            verificationToken: verificationToken,
          },
        });
      }

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: ["banotravishu89@gmail.com"],
        subject: "TaskFlow Verification OTP",
        react: Email({
          firstName: validatedData.firstName,
          email: validatedData.email,
          verificationToken: verificationToken,
        }),
      });

      return { email: validatedData.email };
    },
  });
};

export const verifyOtpAction = async (
  verificationToken: string,
  email: string,
) => {
  return executeAction({
    successMessage: "Email verified successfully.",
    actionFn: async () => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("User not found.");
      }

      if (user.verificationToken !== verificationToken) {
        throw new Error("Incorrect verification code.");
      }

      if (!user.tokenExpiry || new Date() > user.tokenExpiry) {
        throw new Error("Code has expired. Please request a new one.");
      }

      await prisma.user.update({
        where: { email },
        data: {
          emailVerified: true,
          verificationToken: null,
          tokenExpiry: null,
        },
      });

      return { verified: true };
    },
  });
};
