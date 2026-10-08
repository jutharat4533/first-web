"use client";

import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import BottomSheet from "./BottomSheet";
import HospComboBox from "./HospComboBox";
import {
  Hospital,
  SHIFT_CATEGORY_HOURS,
  SHIFT_SLOTS,
  SHIFT_TYPE_LABEL,
  ShiftSlot,
  ShiftCategory,
  SLOT_COLOR,
  SLOT_LABEL,
} from "@/@types/types";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { validateRequired } from "@/lib/validate-required";
import { P, ROSE, STEEL } from "@/styles/theme";
import { Input } from "@/components/ui/input";

// เวลาขึ้นเวรตั้งต้นตามชนิดกะ — ใช้เป็นค่าเริ่มต้นให้ผู้ใช้แก้ไขต่อได้เอง
function defaultStartTime(slot: ShiftSlot, category: ShiftCategory): string {
  if (slot === "SHIFT") return "08:00";
  if (category === "TWO_SHIFT" && slot === "DAY") return "08:00";
  if (category === "TWO_SHIFT" && slot === "NIGHT") return "20:00";
  if (slot === "MORNING") return "08:00";
  if (slot === "EVENING") return "16:00";
  if (slot === "NIGHT") return "00:00";
  return "08:00";
}

// คำนวณเวลาเลิกเวร (HH:mm) จากเวลาเริ่ม + จำนวนชั่วโมงของกะ
function calcEndTime(start: string, hours: number): string {
  const [h, m] = start.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const totalMinutes = (h * 60 + m + hours * 60) % (24 * 60);
  const endH = Math.floor(totalMinutes / 60);
  const endM = totalMinutes % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}

function formatHHmm(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// รวมวันที่ + เวลา (HH:mm) เป็น ISO datetime และเลื่อนวันเลิกงานให้อัตโนมัติถ้าเวลาข้ามเที่ยงคืน
function buildDateTimes(date: string, startHHmm: string, endHHmm: string) {
  const startTime = new Date(`${date}T${startHHmm}:00`);
  const endTime = new Date(`${date}T${endHHmm}:00`);
  if (endTime <= startTime) {
    endTime.setDate(endTime.getDate() + 1);
  }
  return { startTime: startTime.toISOString(), endTime: endTime.toISOString() };
}

interface AddShiftSheetProps {
  date: string;
  shiftId?: number;
  hospitals: Hospital[];
  onSave: (
    hospitalId: number,
    shiftSlot: ShiftSlot,
    startTime: string,
    endTime: string,
  ) => Promise<void> | void;
  onClose: () => void;
  initial?: {
    hospital: Hospital;
    slot: ShiftSlot;
    startTime: string;
    endTime: string;
  };
}

export default function AddShiftSheet({
  date,
  shiftId,
  hospitals,
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
  const [startTimeInput, setStartTimeInput] = useState(
    initial ? formatHHmm(initial.startTime) : "",
  );
  const [endTimeInput, setEndTimeInput] = useState(
    initial ? formatHHmm(initial.endTime) : "",
  );
  // true เมื่อ user แก้เวลาเลิกเวรเองแล้ว — จะไม่ auto-คำนวณทับค่าที่แก้ไว้อีก
  const [endTimeTouched, setEndTimeTouched] = useState(!!initial);
  const [addingHosp, setAddingHosp] = useState(false);
  const [newHospName, setNewHospName] = useState("");
  const [newHospType, setNewHospType] = useState<ShiftCategory>("THREE_SHIFT");
  const [newHospRates, setNewHospRates] = useState<
    Partial<Record<ShiftSlot, string>>
  >({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingHosp, setIsSavingHosp] = useState(false);
  const { addHospital } = useWorkplaceStore();

  const slots = selectedHosp ? SHIFT_SLOTS[selectedHosp.shiftCategory] : [];

  const handleSelectSlot = (slot: ShiftSlot) => {
    setSelectedSlot(slot);
    if (!selectedHosp) return;
    const suggestedStart = defaultStartTime(slot, selectedHosp.shiftCategory);
    setStartTimeInput(suggestedStart);
    setEndTimeInput(
      calcEndTime(suggestedStart, SHIFT_CATEGORY_HOURS[selectedHosp.shiftCategory]),
    );
    setEndTimeTouched(false);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTimeInput(value);
    if (!endTimeTouched && selectedHosp && value) {
      setEndTimeInput(
        calcEndTime(value, SHIFT_CATEGORY_HOURS[selectedHosp.shiftCategory]),
      );
    }
  };

  const handleEndTimeChange = (value: string) => {
    setEndTimeInput(value);
    setEndTimeTouched(true);
  };

  const handleCreateHosp = (name: string) => {
    setNewHospName(name);
    setAddingHosp(true);
  };

  const saveNewHosp = async () => {
    const error = validateRequired({
      ชื่อโรงพยาบาล: newHospName.trim().length > 0,
    });
    if (error) {
      toast.error(error);
      return;
    }

    const rates: Partial<Record<ShiftSlot, number>> = {};
    SHIFT_SLOTS[newHospType].forEach((s) => {
      rates[s] = Number(newHospRates[s] ?? 0);
    });

    setIsSavingHosp(true);
    try {
      const nh = await addHospital({
        name: newHospName,
        baseSalary: 0,
        specialAllowance: 0,
        shiftCategory: newHospType,
        shiftRates: rates,
      });

      setSelectedHosp(nh);
      setAddingHosp(false);
      setNewHospRates({});
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "เพิ่มโรงพยาบาลไม่สำเร็จ",
      );
    } finally {
      setIsSavingHosp(false);
    }
  };

  const handleSaveShift = async () => {
    const error = validateRequired({
      โรงพยาบาล: !!selectedHosp,
      ประเภทเวร: !!selectedSlot,
      เวลาเริ่มเวร: !!startTimeInput,
      เวลาเลิกเวร: !!endTimeInput,
    });
    if (error) {
      toast.error(error);
      return;
    }
    if (!selectedHosp || !selectedSlot) return;

    setSaveError(null);
    setIsSaving(true);

    try {
      const { startTime, endTime } = buildDateTimes(
        date,
        startTimeInput,
        endTimeInput,
      );
      await onSave(selectedHosp.id, selectedSlot, startTime, endTime);
      onClose();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "ไม่สามารถบันทึกเวรได้",
      );
    } finally {
      setIsSaving(false);
    }
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
            disabled={isSavingHosp}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
            style={{ backgroundColor: ROSE, opacity: isSavingHosp ? 0.6 : 1 }}
          >
            {isSavingHosp ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            {isSavingHosp ? "กำลังบันทึก..." : "บันทึก รพ."}
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
            setStartTimeInput("");
            setEndTimeInput("");
            setEndTimeTouched(false);
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
                  onClick={() => handleSelectSlot(slot)}
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

      {selectedHosp && selectedSlot && (
        <div className="space-y-2">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            เวลาขึ้น–เลิกเวร
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px]" style={{ color: "#5a7a99" }}>
                เวลาขึ้นเวร
              </span>
              <Input
                type="time"
                value={startTimeInput}
                onChange={(e) => handleStartTimeChange(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px]" style={{ color: "#5a7a99" }}>
                เวลาเลิกเวร
              </span>
              <Input
                type="time"
                value={endTimeInput}
                onChange={(e) => handleEndTimeChange(e.target.value)}
              />
            </div>
          </div>
          <p className="text-[11px]" style={{ color: "#5a7a99" }}>
            ระบบคำนวณเวลาเลิกเวรให้อัตโนมัติจากชั่วโมงทำงานของกะนี้ (
            {SHIFT_CATEGORY_HOURS[selectedHosp.shiftCategory]} ชม.) —
            แก้ไขให้ตรงกับเวลาจริงได้ตามต้องการ
          </p>
        </div>
      )}

      <button
        onClick={handleSaveShift}
        disabled={isSaving}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{
          backgroundColor: ROSE,
          opacity: isSaving ? 0.6 : 1,
        }}
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        {isSaving ? "กำลังบันทึก..." : shiftId ? "บันทึกการแก้ไข" : "เพิ่มเวร"}
      </button>

      {saveError && (
        <p className="text-xs text-center" style={{ color: ROSE }}>
          {saveError}
        </p>
      )}

      {hospitals.length === 0 && (
        <p className="text-xs text-center" style={{ color: "#5a7a99" }}>
          กรอกชื่อ รพ.ในช่องด้านบนเพื่อเพิ่มข้อมูลสถานพยาบาลใหม่
        </p>
      )}
    </BottomSheet>
  );
}
