import CardList from "@/components/features/user/CardList";
import LogoutButton from "@/components/features/user/LogoutButton";
import { EGG, P, ROSE, STEEL } from "@/styles/theme";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
};
export default function UserProfilePage() {
  return (
    <div>
      {/* HEADER */}
      <div
        className="px-5 pt-5 pb-4 shrink-0"
        style={{ background: `linear-gradient(160deg, ${P} 0%, #0d3b6e 100%)` }}
      >
        {/* Profile */}
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${ROSE} 0%, ${STEEL} 100%)`,
            }}
          >
            Pic
          </div>
          <div>
            {/* Name */}
            <h2 className="text-lg font-bold text-white">Name</h2>
            {/* Email */}
            <p
              className="text-xs mt-0.5"
              style={{ color: "rgba(255,255,255,0.6)" }}
            >
              Email
            </p>
            {/* Description */}
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block"
              style={{ backgroundColor: ROSE }}
            >
              Description
            </span>
          </div>
        </div>
      </div>

      {/* Card List */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <CardList />
      </div>

      {/* Account info */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div
          className="rounded-2xl overflow-hidden shadow-sm divide-y"
          style={{ backgroundColor: EGG, borderColor: "rgba(3,29,68,0.06)" }}
        >
          <div className="px-4 py-3">
            <p className="text-xs font-bold mb-2" style={{ color: P }}>
              ข้อมูลบัญชี
            </p>
            {[
              { label: "ชื่อ", value: "" },
              { label: "อีเมล", value: "" },
              { label: "สิทธิ์การใช้งาน", value: "" },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between py-1.5"
              >
                <span className="text-xs" style={{ color: "#5a7a99" }}>
                  {row.label}
                </span>
                <span className="text-xs font-semibold" style={{ color: P }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hospitals list */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: EGG }}
        >
          <div
            className="px-4 py-3 border-b"
            style={{ borderColor: "rgba(3,29,68,0.06)" }}
          >
            <p className="text-xs font-bold" style={{ color: P }}>
              โรงพยาบาลที่บันทึกไว้
            </p>
          </div>
          <div
            className="divide-y"
            style={{ borderColor: "rgba(3,29,68,0.04)" }}
          >
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: P }}>
                รพ....
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: STEEL + "15", color: STEEL }}
              >
                ประเภทเวร
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="px-5 pt-5 pb-4 shrink-0">
        <div
          className="rounded-2xl p-4 text-center"
          style={{ backgroundColor: EGG }}
        >
          <p className="text-sm font-bold" style={{ color: P }}>
            Nurse Balance
          </p>
          <p className="text-xs mt-1" style={{ color: "#5a7a99" }}>
            แอปพลิเคชันจัดการเวรและการเงินสำหรับพยาบาล
          </p>
          <p className="text-[10px] mt-2" style={{ color: "#aaa" }}>
            v1.0.0
          </p>
        </div>
      </div>

      {/* Button */}
      <LogoutButton />
    </div>
  );
}
