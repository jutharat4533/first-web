"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell } from "lucide-react";
import { SLOT_LABEL } from "@/@types/types";
import { useShiftStore } from "@/store/useShiftStore";

function getDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate(),
  ).padStart(2, "0")}`;
}

function getTomorrowKey() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getDateKey(tomorrow);
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationBell() {
  const { shifts, fetchShifts } = useShiftStore();
  const [open, setOpen] = useState(false);
  const [tomorrowKey, setTomorrowKey] = useState<string | null>(null);

  useEffect(() => {
    void fetchShifts();

    const updateTomorrow = () => setTomorrowKey(getTomorrowKey());
    updateTomorrow();

    const timer = window.setInterval(updateTomorrow, 60_000);
    return () => window.clearInterval(timer);
  }, [fetchShifts]);

  const tomorrowShifts = useMemo(() => {
    if (!tomorrowKey) return [];

    return shifts
      .filter((shift) => shift.date === tomorrowKey)
      .sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );
  }, [shifts, tomorrowKey]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="การแจ้งเตือนเวรพรุ่งนี้"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="relative flex items-center justify-center rounded-full p-1"
      >
        <Bell />
        {tomorrowShifts.length > 0 && (
          <span className="absolute -right-1 -top-1 flex min-w-4 h-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
            {tomorrowShifts.length > 9 ? "9+" : tomorrowShifts.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-72 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-xl">
          <p className="font-bold">แจ้งเตือนเวรพรุ่งนี้</p>

          {tomorrowShifts.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">พรุ่งนี้ไม่มีเวร</p>
          ) : (
            <div className="mt-3 space-y-2">
              {tomorrowShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="rounded-xl bg-slate-50 px-3 py-2 text-sm"
                >
                  <p className="font-semibold">
                    {SLOT_LABEL[shift.shiftSlot]}
                  </p>
                  <p className="text-slate-500">
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
