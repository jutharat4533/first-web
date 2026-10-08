import { Hospital, ShiftRecord, ShiftSlot } from "@/@types/types";
import { ShiftsApi } from "@/lib/api/shifts.api";
import { ShiftApiResponse } from "@/lib/api/shift-types";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { create } from "zustand";

function toDateString(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function fromApi(shift: ShiftApiResponse): ShiftRecord {
  return {
    id: shift.id,
    hospitalId: shift.workplaceSettingId ?? 0,
    date: toDateString(shift.startTime),
    startTime: shift.startTime,
    endTime: shift.endTime,
    shiftSlot: shift.shiftSlot ?? "SHIFT",
    status: shift.status,
  };
}

interface ShiftState {
  shifts: ShiftRecord[];
  loading: boolean;
  error: string | null;
  fetchShifts: () => Promise<void>;
  addShift: (
    hospitalId: number,
    shiftSlot: ShiftSlot,
    startTime: string,
    endTime: string,
  ) => Promise<void>;
  updateShift: (
    id: number,
    hospitalId: number,
    shiftSlot: ShiftSlot,
    startTime: string,
    endTime: string,
  ) => Promise<void>;
  deleteShift: (id: number) => Promise<void>;
}

function findHospital(hospitalId: number): Hospital {
  const hospital = useWorkplaceStore
    .getState()
    .hospitals.find((h) => h.id === hospitalId);
  if (!hospital) {
    throw new Error("ไม่พบข้อมูลโรงพยาบาลของเวรนี้");
  }
  return hospital;
}

export const useShiftStore = create<ShiftState>((set, get) => ({
  shifts: [],
  loading: false,
  error: null,

  fetchShifts: async () => {
    if (get().loading) return;

    set({ loading: true, error: null });
    try {
      const shifts = await ShiftsApi.getShifts();
      set({ shifts: shifts.map(fromApi), loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "โหลดข้อมูลเวรไม่สำเร็จ",
        loading: false,
      });
    }
  },

  addShift: async (hospitalId, shiftSlot, startTime, endTime) => {
    findHospital(hospitalId);

    const created = await ShiftsApi.createShift({
      workplaceSettingId: hospitalId,
      startTime,
      endTime,
      shiftSlot,
      status: "ACTIVE",
    });

    set((state) => ({ shifts: [...state.shifts, fromApi(created)] }));
  },

  updateShift: async (id, hospitalId, shiftSlot, startTime, endTime) => {
    findHospital(hospitalId);

    const updated = await ShiftsApi.updateShift(id, {
      workplaceSettingId: hospitalId,
      startTime,
      endTime,
      shiftSlot,
    });

    set((state) => ({
      shifts: state.shifts.map((s) => (s.id === id ? fromApi(updated) : s)),
    }));
  },

  deleteShift: async (id) => {
    await ShiftsApi.deleteShift(id);
    set((state) => ({
      shifts: state.shifts.filter((s) => s.id !== id),
    }));
  },
}));
