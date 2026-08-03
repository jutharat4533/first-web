"use client";

import { P, ROSE, STEEL } from "@/styles/theme";
import React, { useState } from "react";
import { Check } from "lucide-react";
import {
  Hospital,
  SHIFT_SLOTS,
  SHIFT_TYPE_LABEL,
  ShiftSlot,
  ShiftType,
  SLOT_LABEL,
} from "@/@types/types";

interface HospitalFormProps {
  initial?: Hospital;
  onSave: (h: Omit<Hospital, "id" | "userId">) => void;
  onClose: () => void;
}

export function HospitalForm({ initial, onSave, onClose }: HospitalFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<ShiftType>(
    initial?.shiftType ?? "three_shift",
  );
  const [rates, setRates] = useState<Partial<Record<ShiftSlot, number>>>(
    initial?.shiftRates ?? {},
  );

  const slots = SHIFT_SLOTS[type];

  const setRate = (slot: ShiftSlot, val: string) =>
    setRates((prev) => ({
      ...prev,
      [slot]: val === "" ? undefined : Number(val),
    }));

  const handleSave = () => {
    if (!name.trim()) return;
    const r: Partial<Record<ShiftSlot, number>> = {};
    slots.forEach((s) => {
      r[s] = rates[s] ?? 0;
    });
    onSave({ name: name.trim(), shiftType: type, shiftRates: r });
    onClose();
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
          {(["one_shift", "two_shift", "three_shift"] as ShiftType[]).map(
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
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
        style={{ backgroundColor: ROSE, boxShadow: `0 4px 16px ${ROSE}44` }}
      >
        <Check size={18} /> บันทึกข้อมูล รพ.
      </button>
    </>
  );
}
