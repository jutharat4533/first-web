"use client";

import { P, ROSE, STEEL, EGG } from "@/styles/theme";
import { Loader2, Plus, Trash2, Edit2, Clock } from "lucide-react";
import { Hospital, ShiftRecord, SLOT_COLOR, SLOT_LABEL } from "@/@types/types";

function formatTimeRange(startIso: string, endIso: string) {
  const fmt = (iso: string) =>
    new Date(iso).toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  return `${fmt(startIso)}–${fmt(endIso)}`;
}

interface ShiftListProps {
  shifts: ShiftRecord[];
  hospitals: Hospital[];
  selectedDate: string | null;
  selectedHospitalName?: string;
  onAddShift: () => void;
  onEditShift: (shift: ShiftRecord) => void;
  onDeleteShift: (id: number) => void;
  deletingShiftId: number | null;
}

export default function ShiftList({
  shifts,
  hospitals,
  selectedDate,
  selectedHospitalName,
  onAddShift,
  onEditShift,
  onDeleteShift,
  deletingShiftId,
}: ShiftListProps) {
  const findHospital = (hospitalId: number) =>
    hospitals.find((h) => h.id === hospitalId);

  if (selectedDate) {
    return (
      <div className="px-4 mt-4 pb-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: P }}>
            เวรวันที่ {selectedDate}
          </p>
          <button
            onClick={onAddShift}
            data-preserve-hospital-filter="true"
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: ROSE + "15", color: ROSE }}
          >
            <Plus size={13} />
            เพิ่มเวร
          </button>
        </div>
        {shifts.length === 0 ? (
          <div
            className="rounded-2xl px-4 py-5 text-center text-xs"
            style={{ backgroundColor: EGG, color: "#5a7a99" }}
          >
            ยังไม่มีเวรในวันนี้
          </div>
        ) : (
          shifts.map((s) => {
            const hosp = findHospital(s.hospitalId);
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
                  <p className="text-sm font-bold truncate" style={{ color: P }}>
                    {hosp?.name ?? "ไม่พบ รพ."}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5a7a99" }}>
                    {SLOT_LABEL[s.shiftSlot]} · {formatTimeRange(s.startTime, s.endTime)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className="text-sm font-bold" style={{ color: STEEL }}>
                    ฿{rate.toLocaleString("th-TH")}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => onEditShift(s)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: STEEL + "15", color: STEEL }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDeleteShift(s.id)}
                      disabled={deletingShiftId === s.id}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: ROSE + "15", color: ROSE }}
                    >
                      {deletingShiftId === s.id ? (
                        <Loader2 className="animate-spin" size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 pb-6 space-y-3">
      <p className="text-sm font-bold" style={{ color: P }}>
        {selectedHospitalName ? `เวรของ ${selectedHospitalName}` : "เวรทั้งหมดเดือนนี้"}
        <span className="text-xs font-normal ml-2" style={{ color: "#5a7a99" }}>
          ({shifts.length} เวร)
        </span>
      </p>
      {shifts.length === 0 ? (
        <div
          className="rounded-2xl px-4 py-5 text-center text-xs"
          style={{ backgroundColor: EGG, color: "#5a7a99" }}
        >
          {`ไม่มีเวรเดือนนี้ กดวันที่บนปฏิทินหรือปุ่ม "เพิ่มเวร"`}
        </div>
      ) : (
        [...shifts]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((s) => {
            const hosp = findHospital(s.hospitalId);
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
                  <p className="text-xs font-semibold truncate" style={{ color: P }}>
                    {s.date} · {hosp?.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#5a7a99" }}>
                    {SLOT_LABEL[s.shiftSlot]} · {formatTimeRange(s.startTime, s.endTime)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-sm font-bold" style={{ color: STEEL }}>
                    ฿{rate.toLocaleString("th-TH")}
                  </span>
                  <button
                    onClick={() => onEditShift(s)}
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: STEEL + "15", color: STEEL }}
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => onDeleteShift(s.id)}
                    disabled={deletingShiftId === s.id}
                    className="p-1.5 rounded-lg"
                    style={{ backgroundColor: ROSE + "15", color: ROSE }}
                  >
                    {deletingShiftId === s.id ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <Trash2 size={12} />
                    )}
                  </button>
                </div>
              </div>
            );
          })
      )}
    </div>
  );
}
