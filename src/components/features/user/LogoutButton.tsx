"use client";

import { useTransition } from "react";
import { ROSE } from "@/styles/theme";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth/auth.action";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(() => {
      logoutAction();
    });
  };

  return (
    <div className="px-5 pt-5 pb-30 shrink-0">
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-60 hover:text-black hover:text-base"
        style={{ backgroundColor: "#FFF0F3", color: ROSE }}
      >
        <LogOut size={18} />
        {isPending ? "กำลังออกจากระบบ..." : "ออกจากระบบ"}
      </button>
    </div>
  );
}
