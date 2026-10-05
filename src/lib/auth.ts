import Credentials from "next-auth/providers/credentials";
import { AuthApi } from "./api/auth.api";
import NextAuth from "next-auth";
import { loginSchema } from "@/lib/schemas/auth.schema";

export const { handlers, auth, signIn, signOut, unstable_update } = NextAuth({
  session: { maxAge: 86370 },
  providers: [
    Credentials({
      async authorize(input) {
        try {
          const data = loginSchema.parse(input);

          const { access_token, user } = await AuthApi.login(data);
          return { ...user, access_token };
        } catch {
          return null;
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
