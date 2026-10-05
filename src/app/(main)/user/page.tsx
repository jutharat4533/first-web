import { redirect } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { UserApi } from "@/lib/api/user.api";
import CardList from "@/components/features/user/CardList";
import HospitalListCard from "@/components/features/user/HospitalListCard";
import LogoutButton from "@/components/features/user/LogoutButton";
import ProfileEditButton from "@/components/features/user/ProfileEditButton";
import { EGG, P, ROSE, STEEL } from "@/styles/theme";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function UserProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const profile = await UserApi.getProfile(session.user.id);
  const fullName = `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div>
      {/* HEADER */}
      <div
        className="px-5 pt-5 pb-4 shrink-0"
        style={{ background: `linear-gradient(160deg, ${P} 0%, #0d3b6e 100%)` }}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${ROSE} 0%, ${STEEL} 100%)`,
              }}
            >
              {profile.firstName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-white truncate">
                {fullName || "ไม่มีชื่อ"}
              </h2>
              <p
                className="text-xs mt-0.5 truncate"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {profile.email}
              </p>
            </div>
          </div>
          <ProfileEditButton
            initial={{ firstName: profile.firstName, lastName: profile.lastName }}
          />
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
              { label: "ชื่อ", value: fullName || "-" },
              { label: "อีเมล", value: profile.email },
              {
                label: "วันเกิด",
                value: profile.dob
                  ? new Date(profile.dob).toLocaleDateString("th-TH")
                  : "-",
              },
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
        <HospitalListCard />
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

      <LogoutButton />
    </div>
  );
}
