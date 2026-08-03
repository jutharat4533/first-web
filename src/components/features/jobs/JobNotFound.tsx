import { EGG, P } from "@/styles/theme";
import { AlertCircle } from "lucide-react";

export default function JobNotFound() {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
      <div
        className="rounded-2xl px-4 py-8 text-center"
        style={{ backgroundColor: EGG }}
      >
        <AlertCircle
          size={32}
          style={{ color: "#5a7a99", margin: "0 auto 8px" }}
        />
        <p className="text-sm font-semibold" style={{ color: P }}>
          ไม่พบประกาศงาน
        </p>
        <p className="text-xs mt-1" style={{ color: "#5a7a99" }}>
          ลองเปลี่ยนคำค้นหาหรือตัวกรอง
        </p>
      </div>
    </div>
  );
}
