"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { P, ROSE, STEEL } from "@/styles/theme";
import { Hospital } from "@/@types/types";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";

interface ShiftHospitalFilterProps {
  hospitals: Hospital[];
  shiftCountByHospital: (hospitalId: number) => number;
  totalCount: number;
  selectedHospitalId: number | null;
  onSelect: (hospitalId: number | null) => void;
}

export default function ShiftHospitalFilter({
  hospitals,
  shiftCountByHospital,
  totalCount,
  selectedHospitalId,
  onSelect,
}: ShiftHospitalFilterProps) {
  const { deleteHospital } = useWorkplaceStore();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (hospitals.length === 0) return null;

  const handleDelete = async (h: Hospital) => {
    if (!confirm(`ลบ "${h.name}" ออกจากรายการ รพ.? (เวรที่ผูกกับ รพ.นี้จะยังอยู่)`)) {
      return;
    }
    setDeletingId(h.id);
    try {
      await deleteHospital(h.id);
      if (selectedHospitalId === h.id) onSelect(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบ รพ. ไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="px-4 mt-3">
      <p className="text-xs font-semibold mb-2" style={{ color: "#5a7a99" }}>
        กรองตาม รพ.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelect(null)}
          className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
          style={{
            borderColor: !selectedHospitalId ? P : "rgba(3,29,68,0.15)",
            backgroundColor: !selectedHospitalId ? P : "transparent",
            color: !selectedHospitalId ? "white" : P,
          }}
        >
          ทั้งหมด ({totalCount})
        </button>
        {hospitals.map((h) => {
          const active = selectedHospitalId === h.id;

          return (
            <div
              key={h.id}
              className="shrink-0 flex items-center gap-1 px-1 py-1 rounded-xl border-2 transition-all"
              style={{
                borderColor: active ? STEEL : "rgba(3,29,68,0.15)",
                backgroundColor: active ? STEEL : "transparent",
              }}
            >
              <button
                onClick={() => onSelect(active ? null : h.id)}
                className="px-2 py-0.5 text-xs font-semibold"
                style={{ color: active ? "white" : P }}
              >
                {h.name} ({shiftCountByHospital(h.id)})
              </button>
              <button
                onClick={() => handleDelete(h)}
                disabled={deletingId === h.id}
                className="p-1 rounded-lg"
                style={{ color: active ? "white" : ROSE }}
              >
                {deletingId === h.id ? (
                  <Loader2 className="animate-spin" size={11} />
                ) : (
                  <Trash2 size={11} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
