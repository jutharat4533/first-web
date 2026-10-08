import { UserApi } from "@/lib/api/user.api";
import { auth } from "@/lib/auth";
import NotificationBell from "@/components/layout/NotificationBell";
import { P, ROSE, STEEL } from "@/styles/theme";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Header() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await UserApi.getProfile(session.user.id);

  return (
    <div className="flex justify-between items-center bg-foreground/5 px-6 py-4 ">
      <div className="flex flex-row gap-2">
        <Image src="/pic.png" alt="Logo" width={40} height={40} />
        <header
          className="font-bold text-lg flex justify-center items-center"
          style={{ color: P }}
        >
          Nurse Balance
        </header>
      </div>
      <div className="flex flex-row gap-4 justify-between items-center">
        <NotificationBell />

        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0"
          style={{
            background: `linear-gradient(135deg, ${ROSE} 0%, ${STEEL} 100%)`,
          }}
        >
          {profile.firstName?.[0]?.toUpperCase() ?? "?"}
        </div>
      </div>
    </div>
  );
}
