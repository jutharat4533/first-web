"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Edit2, Loader2, Trash2, X } from "lucide-react";
import { P, ROSE, STEEL } from "@/styles/theme";
import { Hospital } from "@/@types/types";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { validateRequired } from "@/lib/validate-required";

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
  const { updateHospital, deleteHospital } = useWorkplaceStore();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (hospitals.length === 0) return null;

  const startEdit = (h: Hospital) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const saveEdit = async (h: Hospital) => {
    const name = editName.trim();
    const error = validateRequired({ ชื่อโรงพยาบาล: name.length > 0 });
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      await updateHospital(h.id, {
        name,
        baseSalary: h.baseSalary,
        specialAllowance: h.specialAllowance,
        shiftCategory: h.shiftCategory,
        shiftRates: h.shiftRates,
      });
      setEditingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "แก้ไขชื่อ รพ. ไม่สำเร็จ");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (h: Hospital) => {
    if (!confirm(`ลบ "${h.name}" ออกจากรายการ รพ.? (เวรที่ผูกกับ รพ.นี้จะยังอยู่)`)) {
      return;
    }
    try {
      await deleteHospital(h.id);
      if (selectedHospitalId === h.id) onSelect(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบ รพ. ไม่สำเร็จ");
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

          if (editingId === h.id) {
            return (
              <div
                key={h.id}
                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl border-2"
                style={{ borderColor: STEEL }}
              >
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(h);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="w-28 text-xs font-semibold bg-transparent outline-none"
                  style={{ color: P }}
                />
                <button
                  onClick={() => saveEdit(h)}
                  disabled={isSaving}
                  className="p-1 rounded"
                  style={{ color: STEEL }}
                >
                  {isSaving ? <Loader2 className="animate-spin" size={13} /> : <Check size={13} />}
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="p-1 rounded"
                  style={{ color: "#5a7a99" }}
                >
                  <X size={13} />
                </button>
              </div>
            );
          }

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
                onClick={() => startEdit(h)}
                className="p-1 rounded-lg"
                style={{ color: active ? "white" : STEEL }}
              >
                <Edit2 size={11} />
              </button>
              <button
                onClick={() => handleDelete(h)}
                className="p-1 rounded-lg"
                style={{ color: active ? "white" : ROSE }}
              >
                <Trash2 size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
