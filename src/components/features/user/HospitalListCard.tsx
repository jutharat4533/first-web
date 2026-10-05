"use client";

import { useEffect } from "react";
import { EGG, P, STEEL } from "@/styles/theme";
import { SHIFT_TYPE_LABEL } from "@/@types/types";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";

export default function HospitalListCard() {
  const { hospitals, fetchHospitals } = useWorkplaceStore();

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  return (
    <div className="rounded-2xl overflow-hidden shadow-sm" style={{ backgroundColor: EGG }}>
      <div
        className="px-4 py-3 border-b"
        style={{ borderColor: "rgba(3,29,68,0.06)" }}
      >
        <p className="text-xs font-bold" style={{ color: P }}>
          โรงพยาบาลที่บันทึกไว้
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: "rgba(3,29,68,0.04)" }}>
        {hospitals.length === 0 ? (
          <p className="px-4 py-3 text-xs" style={{ color: "#5a7a99" }}>
            ยังไม่มีข้อมูลโรงพยาบาล
          </p>
        ) : (
          hospitals.map((h) => (
            <div key={h.id} className="px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: P }}>
                {h.name}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: STEEL + "15", color: STEEL }}
              >
                {SHIFT_TYPE_LABEL[h.shiftCategory]}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
