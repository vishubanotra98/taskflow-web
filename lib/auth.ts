import NextAuth, { AuthError } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { signInSchema, userSchema } from "./schema";
import { v4 as uuid } from "uuid";
import { encode } from "next-auth/jwt";
import bcrypt from "bcrypt";

class CustomError extends AuthError {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

const adapter = PrismaAdapter(prisma);
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = signInSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new CustomError("Invalid email or password.");
          }

          if (!user.password) {
            throw new CustomError("Invalid email or password.");
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user?.password,
          );

          if (!isPasswordValid) {
            throw new CustomError("Invalid email or password.");
          }

          return user;
        } catch (error) {
          console.error("Login error:", error);
          throw new CustomError("Invalid email or password.");
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },

  jwt: {
    encode: async function (params) {
      if (params?.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token?.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create sesion");
        }

        return sessionToken;
      }
      return encode(params);
    },
  },
});
