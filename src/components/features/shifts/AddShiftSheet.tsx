"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import BottomSheet from "./BottomSheet";
import HospComboBox from "./HospComboBox";
import {
  Hospital,
  SHIFT_SLOTS,
  SHIFT_TYPE_LABEL,
  ShiftSlot,
  ShiftCategory,
  SLOT_COLOR,
  SLOT_LABEL,
} from "@/@types/types";
import { useShiftStore } from "@/store/useShiftStore";
import { P, ROSE, STEEL } from "@/styles/theme";

interface AddShiftSheetProps {
  date: string;
  shiftId?: string;
  hospitals: Hospital[];
  onAddHospital: (name: string) => void;
  onSave: (hospitalId: string, shiftSlot: ShiftSlot) => void;
  onClose: () => void;
  initial?: { hospital: Hospital; slot: ShiftSlot };
}

export default function AddShiftSheet({
  date,
  shiftId,
  hospitals,
  onAddHospital,
  onSave,
  onClose,
  initial,
}: AddShiftSheetProps) {
  const [selectedHosp, setSelectedHosp] = useState<Hospital | null>(
    initial?.hospital ?? null,
  );
  const [selectedSlot, setSelectedSlot] = useState<ShiftSlot | null>(
    initial?.slot ?? null,
  );
  const [addingHosp, setAddingHosp] = useState(false);
  const [newHospName, setNewHospName] = useState("");
  const [newHospType, setNewHospType] = useState<ShiftCategory>("THREE_SHIFT");
  const [newHospRates, setNewHospRates] = useState<
    Partial<Record<ShiftSlot, string>>
  >({});
  const { addHospital } = useShiftStore();

  const slots = selectedHosp ? SHIFT_SLOTS[selectedHosp.shiftCategory] : [];

  const handleCreateHosp = (name: string) => {
    setNewHospName(name);
    setAddingHosp(true);
  };

  const saveNewHosp = () => {
    const rates: Partial<Record<ShiftSlot, number>> = {};
    SHIFT_SLOTS[newHospType].forEach((s) => {
      rates[s] = Number(newHospRates[s] ?? 0);
    });

    const nh = addHospital({
      userId: "user-uuid-1234",
      name: newHospName,
      shiftCategory: newHospType,
      shiftRates: rates,
    });

    setSelectedHosp(nh);
    setAddingHosp(false);
    setNewHospRates({});
  };

  if (addingHosp) {
    return (
      <BottomSheet
        title={`ตั้งค่า รพ.ใหม่: ${newHospName}`}
        onClose={() => setAddingHosp(false)}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <label
              className="text-xs font-semibold"
              style={{ color: "#5a7a99" }}
            >
              ประเภทกะงาน
            </label>
            <div className="space-y-2">
              {(
                ["ONE_SHIFT", "TWO_SHIFT", "THREE_SHIFT"] as ShiftCategory[]
              ).map((t) => (
                <button
                  key={t}
                  onClick={() => setNewHospType(t)}
                  className="w-full px-4 py-2.5 rounded-2xl text-sm text-left flex items-center justify-between border-2 transition-all"
                  style={{
                    borderColor:
                      newHospType === t ? STEEL : "rgba(3,29,68,0.12)",
                    backgroundColor:
                      newHospType === t ? STEEL + "0F" : "#f8fafc",
                    color: P,
                  }}
                >
                  <span>{SHIFT_TYPE_LABEL[t]}</span>
                  {newHospType === t && (
                    <Check size={15} style={{ color: STEEL }} />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label
              className="text-xs font-semibold"
              style={{ color: "#5a7a99" }}
            >
              ค่าเวร (บาท/เวร)
            </label>
            {SHIFT_SLOTS[newHospType].map((slot) => (
              <div key={slot} className="flex items-center gap-3">
                <span
                  className="text-xs font-semibold w-28 shrink-0"
                  style={{ color: P }}
                >
                  {SLOT_LABEL[slot]}
                </span>
                <div
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2"
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
                    value={newHospRates[slot] ?? ""}
                    onChange={(e) =>
                      setNewHospRates((prev) => ({
                        ...prev,
                        [slot]: e.target.value,
                      }))
                    }
                    placeholder="0"
                    className="flex-1 text-sm font-semibold bg-transparent outline-none"
                    style={{ color: P }}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={saveNewHosp}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: ROSE }}
          >
            <Check size={18} />
            บันทึก รพ.
          </button>
        </div>
      </BottomSheet>
    );
  }

  return (
    <BottomSheet
      title={`${shiftId ? "แก้ไข" : "เพิ่ม"}เวร — ${date}`}
      onClose={onClose}
    >
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          โรงพยาบาล / สถานพยาบาล
        </label>
        <HospComboBox
          value={selectedHosp}
          onChange={(h) => {
            setSelectedHosp(h);
            setSelectedSlot(null);
          }}
          hospitals={hospitals}
          onCreateNew={handleCreateHosp}
        />
      </div>

      {selectedHosp && (
        <div className="space-y-2">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            เลือกเวร — {SHIFT_TYPE_LABEL[selectedHosp.shiftCategory]}
          </label>
          <div className="grid grid-cols-1 gap-2">
            {slots.map((slot) => {
              const rate = selectedHosp.shiftRates[slot] ?? 0;
              const { bg } = SLOT_COLOR[slot];
              const isSelected = selectedSlot === slot;
              return (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className="px-4 py-3 rounded-2xl text-sm flex items-center justify-between border-2 transition-all"
                  style={{
                    borderColor: isSelected ? P : "rgba(3,29,68,0.12)",
                    backgroundColor: isSelected ? P : "#f8fafc",
                    color: isSelected ? "white" : P,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: bg }}
                    />
                    <span className="font-semibold">{SLOT_LABEL[slot]}</span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: isSelected ? "rgba(255,255,255,0.8)" : STEEL,
                    }}
                  >
                    ฿{rate.toLocaleString("th-TH")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          if (selectedHosp && selectedSlot) {
            onSave(selectedHosp.id, selectedSlot);
            onClose();
          }
        }}
        disabled={!selectedHosp || !selectedSlot}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{
          backgroundColor: ROSE,
          opacity: selectedHosp && selectedSlot ? 1 : 0.4,
        }}
      >
        <Check size={18} />
        {shiftId ? "บันทึกการแก้ไข" : "เพิ่มเวร"}
      </button>

      {hospitals.length === 0 && (
        <p className="text-xs text-center" style={{ color: "#5a7a99" }}>
          กรอกชื่อ รพ.ในช่องด้านบนเพื่อเพิ่มข้อมูลสถานพยาบาลใหม่
        </p>
      )}
    </BottomSheet>
  );
}
