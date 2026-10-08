"use client";

import { P, ROSE, EGG } from "@/styles/theme";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { SLOT_COLOR, ShiftRecord } from "@/@types/types";

const DAYS_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
export const MONTHS_TH = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

interface ShiftCalendarProps {
  year: number;
  month: number;
  shiftsByDate: Record<string, ShiftRecord[]>;
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddShift: () => void;
}

export default function ShiftCalendar({
  year,
  month,
  shiftsByDate,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onAddShift,
}: ShiftCalendarProps) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const dateStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <>
      <div className="px-6 pt-5 pb-4 shrink-0" style={{ backgroundColor: P }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">ปฏิทินตารางเวร</h1>
          <button
            onClick={onAddShift}
            data-preserve-hospital-filter="true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs"
            style={{ backgroundColor: ROSE, color: "white" }}
          >
            <Plus size={14} />
            เพิ่มเวร
          </button>
        </div>
        <div className="flex items-center justify-center gap-16">
          <button
            onClick={onPrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <ChevronLeft size={16} color="white" />
          </button>
          <span className="text-sm font-semibold text-white text-center">
            {MONTHS_TH[month]} {year + 543}
          </span>
          <button
            onClick={onNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <ChevronRight size={16} color="white" />
          </button>
        </div>
      </div>

      <div
        className="h-full px-6 w-full max-w-xl mx-auto mt-3 rounded-2xl overflow-hidden shadow-sm"
        style={{ backgroundColor: EGG }}
      >
        <div
          className="grid grid-cols-7 border-b"
          style={{ borderColor: "rgba(3,29,68,0.08)" }}
        >
          {DAYS_TH.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-lg font-bold"
              style={{ color: P + "80" }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;
            const ds = dateStr(day);
            const dayShifts = shiftsByDate[ds] ?? [];
            const isSelected = selectedDate === ds;
            const isToday = ds === todayStr;
            return (
              <button
                key={i}
                onClick={() => onSelectDate(isSelected ? null : ds)}
                className="aspect-square flex flex-col items-center justify-center gap-0.5 relative transition-all"
                style={{
                  backgroundColor: isSelected ? P : "transparent",
                  borderRadius: isSelected ? "12px" : "0",
                }}
              >
                <span
                  className="text-xs font-bold leading-none"
                  style={{ color: isSelected ? "white" : isToday ? ROSE : P }}
                >
                  {day}
                </span>
                {dayShifts.length > 0 && (
                  <div className="flex items-center gap-0.5">
                    {dayShifts.slice(0, 3).map((s, j) => (
                      <div
                        key={j}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(255,255,255,0.7)"
                            : SLOT_COLOR[s.shiftSlot].bg,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
