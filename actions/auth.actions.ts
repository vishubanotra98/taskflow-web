"use server";

import { executeAction } from "@/lib/executeAction";
import prisma from "@/lib/prisma";
import { userSchema } from "@/lib/schema";
import { signIn, signOut } from "@/lib/auth";

export const google_signin = async () => {
  await signIn("google");
};

export const credentials_signIn = async (formData: FormData) => {
  const res = await executeAction({
    actionFn: async () => await signIn("credentials", formData),
  });
};

export const logOutAction = async () => {
  const res = await executeAction({
    actionFn: async () => {
      await signOut();
    },
  });
};

export const signUpAction = async (formData: FormData) => {
  const res = await executeAction({
    actionFn: async () => {
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const email = formData.get("email");
      const password = formData.get("password");

      const validatedData = userSchema.parse({
        firstName,
        lastName,
        email,
        password,
      });

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
          password: validatedData.password,
        },
      });
    },
  });

  return res;
};
