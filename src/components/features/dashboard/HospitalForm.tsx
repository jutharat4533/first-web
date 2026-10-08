"use client";

import { P, ROSE, STEEL } from "@/styles/theme";
import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Hospital,
  SHIFT_SLOTS,
  SHIFT_TYPE_LABEL,
  ShiftCategory,
  ShiftSlot,
  SLOT_LABEL,
} from "@/@types/types";
import { HospitalInput } from "@/store/useWorkplaceStore";
import { validateRequired } from "@/lib/validate-required";

interface HospitalFormProps {
  initial?: Hospital;
  onSave: (h: HospitalInput) => Promise<void> | void;
  onClose: () => void;
}

export function HospitalForm({ initial, onSave, onClose }: HospitalFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<ShiftCategory>(
    initial?.shiftCategory ?? "THREE_SHIFT",
  );
  const [baseSalary, setBaseSalary] = useState(
    String(initial?.baseSalary ?? ""),
  );
  const [specialAllowance, setSpecialAllowance] = useState(
    String(initial?.specialAllowance ?? ""),
  );
  const [rates, setRates] = useState<Partial<Record<ShiftSlot, number>>>(
    initial?.shiftRates ?? {},
  );
  const [isSaving, setIsSaving] = useState(false);

  const slots = SHIFT_SLOTS[type];

  const setRate = (slot: ShiftSlot, val: string) =>
    setRates((prev) => ({
      ...prev,
      [slot]: val === "" ? undefined : Number(val),
    }));

  const handleSave = async () => {
    const error = validateRequired({
      ชื่อโรงพยาบาล: name.trim().length > 0,
    });
    if (error) {
      toast.error(error);
      return;
    }

    const r: Partial<Record<ShiftSlot, number>> = {};
    slots.forEach((s) => {
      r[s] = rates[s] ?? 0;
    });

    setIsSaving(true);
    try {
      await onSave({
        name: name.trim(),
        baseSalary: Number(baseSalary) || 0,
        specialAllowance: Number(specialAllowance) || 0,
        shiftCategory: type,
        shiftRates: r,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          ชื่อโรงพยาบาล / สถานพยาบาล
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="รพ.รามาธิบดี"
          className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
          style={{
            borderColor: "rgba(3,29,68,0.12)",
            backgroundColor: "#f8fafc",
            color: P,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = STEEL)}
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "rgba(3,29,68,0.12)")
          }
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          ประเภทกะงาน (Shift Type)
        </label>
        <div className="space-y-2">
          {(["ONE_SHIFT", "TWO_SHIFT", "THREE_SHIFT"] as ShiftCategory[]).map(
            (t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="w-full px-4 py-3 rounded-2xl text-sm text-left flex items-center justify-between border-2 transition-all"
                style={{
                  borderColor: type === t ? STEEL : "rgba(3,29,68,0.12)",
                  backgroundColor: type === t ? STEEL + "0F" : "#f8fafc",
                  color: P,
                }}
              >
                <span className="font-medium">{SHIFT_TYPE_LABEL[t]}</span>
                {type === t && <Check size={16} style={{ color: STEEL }} />}
              </button>
            ),
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            เงินเดือนพื้นฐาน (บาท)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
            style={{
              borderColor: "rgba(3,29,68,0.12)",
              backgroundColor: "#f8fafc",
              color: P,
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            ค่าตอบแทนพิเศษ (บาท)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={specialAllowance}
            onChange={(e) => setSpecialAllowance(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
            style={{
              borderColor: "rgba(3,29,68,0.12)",
              backgroundColor: "#f8fafc",
              color: P,
            }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          ค่าเวรแต่ละประเภท (บาท/เวร)
        </label>
        {slots.map((slot) => (
          <div key={slot} className="flex items-center gap-3">
            <span
              className="text-xs font-semibold w-28 shrink-0"
              style={{ color: P }}
            >
              {SLOT_LABEL[slot]}
            </span>
            <div
              className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl border-2"
              style={{
                borderColor: "rgba(3,29,68,0.12)",
                backgroundColor: "#f8fafc",
              }}
            >
              <span className="text-sm font-bold" style={{ color: P }}>
                ฿
              </span>
              <input
                type="number"
                inputMode="numeric"
                value={rates[slot] ?? ""}
                onChange={(e) => setRate(slot, e.target.value)}
                placeholder="0"
                className="flex-1 text-sm font-semibold bg-transparent outline-none"
                style={{ color: P }}
              />
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{
          backgroundColor: ROSE,
          boxShadow: `0 4px 16px ${ROSE}44`,
          opacity: isSaving ? 0.6 : 1,
        }}
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        {isSaving ? "กำลังบันทึก..." : "บันทึกข้อมูล รพ."}
      </button>
    </>
  );
}
