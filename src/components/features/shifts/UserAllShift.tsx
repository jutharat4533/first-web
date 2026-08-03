import { EGG, P } from "@/styles/theme";
import { useEffect, useState } from "react";

interface UserAllShiftProps {
  userId: string;
}

export default function UserAllShift({ userId }: UserAllShiftProps) {
  const [shiftCount, setShiftCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchShiftCount() {
      try {
        setLoading(true);

        const accessToken = localStorage.getItem("access_token") || "";

        const API_URL =
          process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:10000";

        const response = await fetch(`${API_URL}/shifts/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        // console.log("Fetching URL:", `${API_URL}/shifts/${userId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch shifts");
        }

        const result = await response.json();
        setShiftCount(Array.isArray(result) ? result.length : 0);
      } catch (error) {
        console.error("Error fetching shifts:", error);
        setShiftCount(0);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchShiftCount();
    }
  }, [userId]);

  return (
    <div className="p-5">
      <p className="pb-2 text-sm font-bold h-full" style={{ color: P }}>
        เวรทั้งหมดของฉัน
      </p>
      <div
        className="rounded-2xl px-4 py-5 text-center text-xs font-semibold"
        style={{ backgroundColor: EGG, color: "#5a7a99" }}
      >
        {loading ? (
          <span>กำลังโหลด...</span>
        ) : (
          <span>จำนวน: {shiftCount} เวร</span>
        )}
      </div>
    </div>
  );
}
