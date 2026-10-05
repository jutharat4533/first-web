import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    firstName?: string;
    lastName?: string;
    access_token?: string;
    avatarUrl?: string | null;
    role?: "ADMIN" | "USER";
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    firstName?: string;
    lastName?: string;
    access_token?: string;
    avatarUrl?: string | null;
    role?: "ADMIN" | "USER";
  }
}
