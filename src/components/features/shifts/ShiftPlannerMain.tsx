"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { P } from "@/styles/theme";
import AddShiftSheet from "./AddShiftSheet";
import ShiftCalendar from "./ShiftCalendar";
import ShiftHospitalFilter from "./ShiftHospitalFilter";
import ShiftList from "./ShiftList";
import Legend from "@/components/features/shifts/Legend";
import { ShiftRecord } from "@/@types/types";
import { useShiftStore } from "@/store/useShiftStore";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import LoadingState from "@/components/shared/LoadingState";

function todayString() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate(),
  ).padStart(2, "0")}`;
}

export function ShiftPlannerMain() {
  const { shifts, loading: shiftsLoading, fetchShifts, addShift, updateShift, deleteShift } =
    useShiftStore();
  const { hospitals, loading: hospitalsLoading, fetchHospitals } = useWorkplaceStore();

  useEffect(() => {
    fetchHospitals();
    fetchShifts();
  }, [fetchHospitals, fetchShifts]);

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    todayString(),
  );
  const [sheet, setSheet] = useState<"add" | "edit" | null>(null);
  const [editShiftId, setEditShiftId] = useState<number | null>(null);
  const [selectedHospFilter, setSelectedHospFilter] = useState<number | null>(
    null,
  );

  const monthShifts = useMemo(
    () =>
      shifts.filter((s) => {
        const d = new Date(s.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }),
    [shifts, year, month],
  );

  const shiftsByDate = useMemo(() => {
    const map: Record<string, ShiftRecord[]> = {};
    monthShifts.forEach((s) => {
      if (!map[s.date]) map[s.date] = [];
      map[s.date].push(s);
    });
    return map;
  }, [monthShifts]);

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
    ? shifts.find((s) => s.id === editShiftId)
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

  const defaultDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  const handleDelete = async (id: number) => {
    try {
      await deleteShift(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบเวรไม่สำเร็จ");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {(shiftsLoading || hospitalsLoading) && (
        <div className="absolute inset-0 z-20 flex items-start justify-center bg-slate-50/75 pt-16 backdrop-blur-[1px]">
          <LoadingState label="กำลังโหลดตารางเวร..." />
        </div>
      )}
      <div className="flex-1 overflow-y-auto m-4">
        <ShiftCalendar
          year={year}
          month={month}
          shiftsByDate={shiftsByDate}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onPrevMonth={prevMonth}
          onNextMonth={nextMonth}
          onAddShift={() => {
            setSelectedDate(null);
            setSheet("add");
          }}
        />

        <Legend />

        <ShiftHospitalFilter
          hospitals={hospitals}
          shiftCountByHospital={(hospitalId) =>
            monthShifts.filter((s) => s.hospitalId === hospitalId).length
          }
          totalCount={monthShifts.length}
          selectedHospitalId={selectedHospFilter}
          onSelect={setSelectedHospFilter}
        />

        <ShiftList
          shifts={selectedDate ? selectedShifts : filteredHospShifts}
          hospitals={hospitals}
          selectedDate={selectedDate}
          selectedHospitalName={
            selectedHospFilter
              ? hospitals.find((h) => h.id === selectedHospFilter)?.name
              : undefined
          }
          onAddShift={() => setSheet("add")}
          onEditShift={(s) => {
            setEditShiftId(s.id);
            if (!selectedDate) setSelectedDate(s.date);
            setSheet("edit");
          }}
          onDeleteShift={handleDelete}
        />
      </div>

      {sheet === "add" && (
        <AddShiftSheet
          date={selectedDate ?? defaultDate}
          hospitals={hospitals}
          onSave={(hospId, slot, startTime, endTime) =>
            addShift(hospId, slot, startTime, endTime)
          }
          onClose={() => setSheet(null)}
        />
      )}
      {sheet === "edit" && editShiftId && editShift && (
        <AddShiftSheet
          date={editShift.date}
          shiftId={editShiftId}
          hospitals={hospitals}
          onSave={(hospId, slot, startTime, endTime) =>
            updateShift(editShiftId, hospId, slot, startTime, endTime)
          }
          onClose={() => {
            setSheet(null);
            setEditShiftId(null);
          }}
          initial={
            editHosp
              ? {
                  hospital: editHosp,
                  slot: editShift.shiftSlot,
                  startTime: editShift.startTime,
                  endTime: editShift.endTime,
                }
              : undefined
          }
        />
      )}
    </div>
  );
}
