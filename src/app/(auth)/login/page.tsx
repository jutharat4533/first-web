import LoginForm from "@/components/features/auth/LoginForm";
import { STEEL } from "@/styles/theme";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return (
    <div className="flex flex-col h-full px-6 w-full max-w-xl mx-auto">
      <div className="pt-8 pb-6">
        {/* HEADER */}
        <div className="py-4 pb-4 text-lg font-semibold">เข้าสู่ระบบ</div>

        {/* FORM */}
        <LoginForm />

        {/* DESCRIPTION */}
        <p className="py-2 text-center text-sm" style={{ color: "#5a7a99" }}>
          ยังไม่มีบัญชี?{" "}
          <a
            className="font-bold hover:underline"
            style={{ color: STEEL }}
            href="/register"
          >
            สมัครสมาชิก
          </a>
        </p>
      </div>
    </div>
  );
}
