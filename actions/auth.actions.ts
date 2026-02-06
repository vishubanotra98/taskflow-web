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
    actionFn: async () => {
      const firstName = formData.firstName;
      const lastName = formData.lastName;
      const email = formData.email;
      const password = formData.password;

      const validatedData = userSchema.parse({
        firstName,
        lastName,
        email,
        password,
      });

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        validatedData.password,
        saltRounds,
      );

      const isUser = await prisma.user.findFirst({
        where: {
          email: validatedData?.email,
        },
      });

      if (isUser) {
        return { success: false, message: "User Already exists." };
      }

      await prisma.user.create({
        data: {
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          password: hashedPassword,
        },
      });
    },
  });
};
