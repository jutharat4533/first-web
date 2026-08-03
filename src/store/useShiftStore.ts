import { Hospital, ShiftRecord } from "@/@types/types";
import { create } from "zustand";

interface ShiftState {
  hospitals: Hospital[];
  shifts: ShiftRecord[];
  getUserHospitals: () => Hospital[];
  getUserShifts: () => ShiftRecord[];
  addHospital: (newHosp: Omit<Hospital, "id">) => Hospital;
  addShift: (newShift: Omit<ShiftRecord, "id">) => void;
  updateShift: (id: string, updatedData: Partial<ShiftRecord>) => void;
  deleteShift: (id: string) => void;
}

export const useShiftStore = create<ShiftState>((set, get) => ({
  hospitals: [],
  shifts: [],

  getUserHospitals: () => get().hospitals,

  getUserShifts: () => get().shifts,

  addHospital: (newHospData) => {
    const newHospital: Hospital = {
      id: `hosp-${Date.now()}`,
      ...newHospData,
    };
    set((state) => ({ hospitals: [...state.hospitals, newHospital] }));
    return newHospital;
  },

  addShift: (newShiftData) => {
    const newShift: ShiftRecord = {
      id: `shift-${Date.now()}`,
      ...newShiftData,
    };
    set((state) => ({ shifts: [...state.shifts, newShift] }));
  },

  updateShift: (id, updatedData) => {
    set((state) => ({
      shifts: state.shifts.map((s) =>
        s.id === id ? { ...s, ...updatedData } : s,
      ),
    }));
  },

  deleteShift: (id) => {
    set((state) => ({
      shifts: state.shifts.filter((s) => s.id !== id),
    }));
  },
}));
