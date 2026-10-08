import Credentials from "next-auth/providers/credentials";
import { AuthApi } from "./api/auth.api";
import NextAuth from "next-auth";
import { ApiError } from "@/lib/api/api-error";
import { loginSchema } from "@/lib/schemas/auth.schema";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  session: { maxAge: 86370 },
  providers: [
    Credentials({
      async authorize(input) {
        const parsed = loginSchema.safeParse(input);
        if (!parsed.success) {
          return null;
        }

        try {
          const { access_token, user } = await AuthApi.login(parsed.data);
          return { ...user, access_token };
        } catch (error) {
          if (error instanceof ApiError && error.statusCode === 401) {
            return null;
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.access_token = user.access_token;
        token.avatarUrl = user.avatarUrl;
        token.role = user.role;
      }

      if (trigger === "update") {
        if (session?.user?.avatarUrl) token.avatarUrl = session.user.avatarUrl;
      }

      return token;
    },
    session({ token, session }) {
      session.user.firstName = token.firstName;
      session.user.lastName = token.lastName;
      session.user.avatarUrl = token.avatarUrl;
      session.user.access_token = token.access_token;
      session.user.id = token.sub;
      session.user.role = token.role;

      return session;
    },
  },
});
