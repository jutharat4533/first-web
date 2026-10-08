"use client";

import { useEffect } from "react";
import { EGG, P, ROSE, STEEL } from "@/styles/theme";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { useShiftStore } from "@/store/useShiftStore";
import LoadingState from "@/components/shared/LoadingState";

export default function CardList() {
  const { hospitals, loading: hospitalsLoading, fetchHospitals } = useWorkplaceStore();
  const { shifts, loading: shiftsLoading, fetchShifts } = useShiftStore();

  useEffect(() => {
    fetchHospitals();
    fetchShifts();
  }, [fetchHospitals, fetchShifts]);

  const now = new Date();
  const shiftsThisMonth = shifts.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  const stats = [
    { label: "รพ.ที่ทำงาน", value: hospitals.length, color: STEEL },
    { label: "เวรเดือนนี้", value: shiftsThisMonth, color: ROSE },
    { label: "เวรทั้งหมด", value: shifts.length, color: P },
  ];

  if (hospitalsLoading || shiftsLoading) {
    return <LoadingState label="กำลังโหลดสรุปข้อมูล..." className="min-h-28" />;
  }

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ backgroundColor: EGG }}
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {s.value}
            </p>
            <p
              className="text-[10px] mt-0.5 font-medium"
              style={{ color: "#5a7a99" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
