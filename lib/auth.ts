import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { userSchema } from "./schema";
import { v4 as uuid } from "uuid";
import { encode } from "next-auth/jwt";

const adapter = PrismaAdapter(prisma);
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    Google,
    Credentials({
      credentials: {
        firstName: {},
        lastName: {},
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const email = userSchema.parse(credentials).email;
        const password = userSchema.parse(credentials).password;

        const user = await prisma.user.findUnique({
          where: {
            email,
            password,
          },
        });

        if (!user) {
          throw new Error("Invalid Credentials");
        } else {
          return user;
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
          // 30 days
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
