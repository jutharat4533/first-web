"use client";

import { P, ROSE, STEEL, EGG } from "@/styles/theme";
import React, { useState, useMemo } from "react";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Clock,
} from "lucide-react";
import AddShiftSheet from "./AddShiftSheet";
import { useShiftStore } from "@/store/useShiftStore";
import { SLOT_COLOR, SLOT_LABEL } from "@/@types/types";
import Legend from "@/components/features/shifts/Legend";
import UserAllShift from "@/components/features/shifts/UserAllShift";

const DAYS_TH = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
const MONTHS_TH = [
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

export function ShiftPlannerMain() {
  const {
    getUserHospitals,
    getUserShifts,
    addShift,
    updateShift,
    deleteShift,
  } = useShiftStore();

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
  );
  const [sheet, setSheet] = useState<"add" | "edit" | null>(null);
  const [editShiftId, setEditShiftId] = useState<string | null>(null);
  const [selectedHospFilter, setSelectedHospFilter] = useState<string | null>(
    null,
  );

  const hospitals = getUserHospitals();
  const allShifts = getUserShifts();

  const monthShifts = useMemo(
    () =>
      allShifts.filter((s) => {
        const d = new Date(s.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }),
    [allShifts, year, month],
  );

  const shiftsByDate = useMemo(() => {
    const map: Record<string, typeof allShifts> = {};
    monthShifts.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [monthShifts]);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const dateStr = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const selectedShifts = selectedDate ? (shiftsByDate[selectedDate] ?? []) : [];
  const editShift = editShiftId
    ? allShifts.find((s) => s.id === editShiftId)
    : null;
  const editHosp = editShift
    ? hospitals.find((h) => h.id === editShift.hospitalId)
    : null;

  const filteredHospShifts = useMemo(
    () =>
      selectedHospFilter
        ? monthShifts.filter((s) => s.hospitalId === selectedHospFilter)
        : monthShifts,
    [monthShifts, selectedHospFilter],
  );

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-6  pt-5 pb-4 shrink-0" style={{ backgroundColor: P }}>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-white">ปฏิทินตารางเวร</h1>
          <button
            onClick={() => {
              setSelectedDate(null);
              setSheet("add");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold text-xs"
            style={{ backgroundColor: ROSE, color: "white" }}
          >
            <Plus size={14} />
            เพิ่มเวร
          </button>
        </div>
        <div className="flex items-center justify-center gap-16">
          <button
            onClick={prevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <ChevronLeft size={16} color="white" />
          </button>
          <span className="text-sm font-semibold text-white text-center">
            {MONTHS_TH[month]} {year + 543}
          </span>
          <button
            onClick={nextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <ChevronRight size={16} color="white" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto m-4">
        {/* Calendar */}
        <div
          className="h-full px-6 w-full max-w-xl mx-auto mt-3 rounded-2xl overflow-hidden shadow-sm"
          style={{ backgroundColor: EGG }}
        >
          {/* Day headers */}
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
          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((day, i) => {
              if (!day) return <div key={i} className="aspect-square" />;
              const ds = dateStr(day);
              const dayShifts = shiftsByDate[ds] ?? [];
              const isSelected = selectedDate === ds;
              const isToday =
                ds ===
                `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDate(isSelected ? null : ds)}
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
                          className="w-1.5 h-1.5 rounded-full"
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

        {/* Legend */}
        <Legend />

        {/* All Shifts */}
        <UserAllShift />

        {/* Hospital filter chips */}
        {hospitals.length > 0 && (
          <div className="px-4 mt-3">
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "#5a7a99" }}
            >
              กรองตาม รพ.
            </p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setSelectedHospFilter(null)}
                className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
                style={{
                  borderColor: !selectedHospFilter ? P : "rgba(3,29,68,0.15)",
                  backgroundColor: !selectedHospFilter ? P : "transparent",
                  color: !selectedHospFilter ? "white" : P,
                }}
              >
                ทั้งหมด ({monthShifts.length})
              </button>
              {hospitals.map((h) => {
                const cnt = monthShifts.filter(
                  (s) => s.hospitalId === h.id,
                ).length;
                const active = selectedHospFilter === h.id;
                return (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHospFilter(active ? null : h.id)}
                    className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: active ? STEEL : "rgba(3,29,68,0.15)",
                      backgroundColor: active ? STEEL : "transparent",
                      color: active ? "white" : P,
                    }}
                  >
                    {h.name} ({cnt})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected day shifts */}
        <div className="px-4 mt-4 pb-6 space-y-3">
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold" style={{ color: P }}>
                  เวรวันที่ {selectedDate}
                </p>
                <button
                  onClick={() => setSheet("add")}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: ROSE + "15", color: ROSE }}
                >
                  <Plus size={13} />
                  เพิ่มเวร
                </button>
              </div>
              {selectedShifts.length === 0 ? (
                <div
                  className="rounded-2xl px-4 py-5 text-center text-xs"
                  style={{ backgroundColor: EGG, color: "#5a7a99" }}
                >
                  ยังไม่มีเวรในวันนี้
                </div>
              ) : (
                selectedShifts.map((s) => {
                  const hosp = hospitals.find((h) => h.id === s.hospitalId);
                  const { bg, text } = SLOT_COLOR[s.shiftSlot];
                  const rate = hosp?.shiftRates[s.shiftSlot] ?? 0;
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl p-4 flex items-center gap-3 shadow-sm"
                      style={{ backgroundColor: EGG }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: bg }}
                      >
                        <Clock size={18} style={{ color: text }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-bold truncate"
                          style={{ color: P }}
                        >
                          {hosp?.name ?? "ไม่พบ รพ."}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "#5a7a99" }}
                        >
                          {SLOT_LABEL[s.shiftSlot]}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className="text-sm font-bold"
                          style={{ color: STEEL }}
                        >
                          ฿{rate.toLocaleString("th-TH")}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setEditShiftId(s.id);
                              setSheet("edit");
                            }}
                            className="p-1.5 rounded-lg"
                            style={{
                              backgroundColor: STEEL + "15",
                              color: STEEL,
                            }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => deleteShift(s.id)}
                            className="p-1.5 rounded-lg"
                            style={{
                              backgroundColor: ROSE + "15",
                              color: ROSE,
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          ) : (
            <>
              <p className="text-sm font-bold" style={{ color: P }}>
                {selectedHospFilter
                  ? `เวรของ ${hospitals.find((h) => h.id === selectedHospFilter)?.name}`
                  : "เวรทั้งหมดเดือนนี้"}
                <span
                  className="text-xs font-normal ml-2"
                  style={{ color: "#5a7a99" }}
                >
                  ({filteredHospShifts.length} เวร)
                </span>
              </p>
              {filteredHospShifts.length === 0 ? (
                <div
                  className="rounded-2xl px-4 py-5 text-center text-xs"
                  style={{ backgroundColor: EGG, color: "#5a7a99" }}
                >
                  {`ไม่มีเวรเดือนนี้ กดวันที่บนปฏิทินหรือปุ่ม "เพิ่มเวร"`}
                </div>
              ) : (
                filteredHospShifts
                  .sort((a, b) => a.date.localeCompare(b.date))
                  .map((s) => {
                    const hosp = hospitals.find((h) => h.id === s.hospitalId);
                    const { bg, text } = SLOT_COLOR[s.shiftSlot];
                    const rate = hosp?.shiftRates[s.shiftSlot] ?? 0;
                    return (
                      <div
                        key={s.id}
                        className="rounded-2xl p-3.5 flex items-center gap-3 shadow-sm"
                        style={{ backgroundColor: EGG }}
                      >
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: bg }}
                        >
                          <Clock size={16} style={{ color: text }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs font-semibold truncate"
                            style={{ color: P }}
                          >
                            {s.date} · {hosp?.name}
                          </p>
                          <p
                            className="text-xs mt-0.5"
                            style={{ color: "#5a7a99" }}
                          >
                            {SLOT_LABEL[s.shiftSlot]}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span
                            className="text-sm font-bold"
                            style={{ color: STEEL }}
                          >
                            ฿{rate.toLocaleString("th-TH")}
                          </span>
                          <button
                            onClick={() => {
                              setEditShiftId(s.id);
                              setSelectedDate(s.date);
                              setSheet("edit");
                            }}
                            className="p-1.5 rounded-lg"
                            style={{
                              backgroundColor: STEEL + "15",
                              color: STEEL,
                            }}
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => deleteShift(s.id)}
                            className="p-1.5 rounded-lg"
                            style={{
                              backgroundColor: ROSE + "15",
                              color: ROSE,
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </>
          )}
        </div>
      </div>

      {/* Add shift sheet */}
      {sheet === "add" && (
        <AddShiftSheet
          date={
            selectedDate ?? `${year}-${String(month + 1).padStart(2, "0")}-01`
          }
          hospitals={hospitals}
          onAddHospital={(_name) => setSheet("add")}
          onSave={(hospId, slot) =>
            addShift({
              userId: "user-uuid-1234", // 🛠️ แก้ไขที่ 3: เติม userId ให้ครบถ้วนตาม Interface ShiftRecord
              date:
                selectedDate ??
                `${year}-${String(month + 1).padStart(2, "0")}-01`,
              hospitalId: hospId,
              shiftSlot: slot,
            })
          }
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "edit" && editShiftId && editShift && (
        <AddShiftSheet
          date={editShift.date}
          shiftId={editShiftId}
          hospitals={hospitals}
          onAddHospital={() => {}}
          onSave={(hospId, slot) =>
            updateShift(editShiftId, { hospitalId: hospId, shiftSlot: slot })
          }
          onClose={() => {
            setSheet(null);
            setEditShiftId(null);
          }}
          initial={
            editHosp
              ? { hospital: editHosp, slot: editShift.shiftSlot }
              : undefined
          }
        />
      )}
    </div>
  );
}
