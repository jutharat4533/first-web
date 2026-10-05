import { getSession } from "next-auth/react";

export async function getAccessToken(): Promise<string> {
  const session = await getSession();
  const token = session?.user?.access_token;
  if (!token) {
    throw new Error("ไม่พบ session กรุณาเข้าสู่ระบบใหม่");
  }
  return token;
}
