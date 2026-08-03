"use client";

import { ROSE } from "@/styles/theme";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation"; // ใช้สำหรับ Next.js App Router (ถ้าใช้ Vite หรือตัวอื่นให้เปลี่ยนไปใช้ router ของตัวนั้นๆ)

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // 1. ลบ Access Token (และข้อมูลอื่นๆ ที่เก็บไว้ตอน Login) ออกจาก localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user"); // เคลียร์ข้อมูลผู้ใช้เพิ่มเติม (ถ้ามี)

    // หากมีการเก็บ Token ไว้ใน Cookies สามารถสั่งลบตรงนี้ได้ด้วยครับ

    // 2. พาผู้ใช้เด้งกลับไปที่หน้า Login ทันที
    router.push("/login"); // เปลี่ยนเส้นทางตาม Route หน้า Login ของโปรเจกต์คุณ
  };

  return (
    <div className="px-5 pt-5 pb-30 shrink-0">
      <button
        onClick={handleLogout} // <-- ผูกฟังก์ชันเข้ากับปุ่ม
        className="w-full py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        style={{ backgroundColor: "#FFF0F3", color: ROSE }}
      >
        <LogOut size={18} />
        ออกจากระบบ
      </button>
    </div>
  );
}
