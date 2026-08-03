import RegisterForm from "@/components/features/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { STEEL } from "@/styles/theme";
import { ChevronLeft } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <div className="flex flex-col h-full px-6 w-full max-w-xl mx-auto">
      {/* HEADER GROUP */}
      <div className="pt-8 pb-6">
        <div className="-ml-4">
          <Button
            className="rounded-full size-10"
            variant="ghost"
            nativeButton={false}
            render={
              <Link href="/login">
                <ChevronLeft />
              </Link>
            }
          />
        </div>

        <h1 className="py-2 text-lg font-semibold pb-0.5">สมัครสมาชิก</h1>
        <p className="text-xs mt-0.5 pb-2">สร้างบัญชี Nurse Balance ของคุณ</p>
      </div>

      {/* REGISTER FORM */}
      <div>
        <RegisterForm />
      </div>

      {/* DESCRIPTION */}
      <p
        className="py-2 pb-10 text-center text-sm"
        style={{ color: "#5a7a99" }}
      >
        มีบัญชีอยู่แล้ว?{" "}
        <a
          className="font-bold hover:underline"
          style={{ color: STEEL }}
          href="/login"
        >
          เข้าสู่ระบบ
        </a>
      </p>
    </div>
  );
}
