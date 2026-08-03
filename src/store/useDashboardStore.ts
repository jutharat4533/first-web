import { create } from "zustand";
import {
  Hospital,
  SpecialIncome,
  Deduction,
  ShiftRecord,
  UserRole,
} from "@/@types/types";

interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  baseSalary: number;
}

interface DashboardState {
  currentUser: UserProfile | null;
  hospitals: Hospital[];
  shifts: ShiftRecord[];
  specialIncomes: SpecialIncome[];
  deductions: Deduction[];

  // --- Actions ---
  setCurrentUser: (user: UserProfile | null) => void;
  updateBaseSalary: (newSalary: number) => void;

  getUserHospitals: () => Hospital[];
  addHospital: (newHosp: Omit<Hospital, "id" | "userId">) => Hospital;
  updateHospital: (id: string, updatedData: Partial<Hospital>) => void;
  deleteHospital: (id: string) => void;

  getUserShifts: () => ShiftRecord[];

  getUserSpecialIncomes: () => SpecialIncome[];
  addSpecialIncome: (item: Omit<SpecialIncome, "id" | "userId">) => void;
  updateSpecialIncome: (
    id: string,
    updatedData: Partial<SpecialIncome>,
  ) => void;
  deleteSpecialIncome: (id: string) => void;

  getUserDeductions: () => Deduction[];
  addDeduction: (item: Omit<Deduction, "id" | "userId">) => void;
  updateDeduction: (id: string, updatedData: Partial<Deduction>) => void;
  deleteDeduction: (id: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // (Mock Data)
  currentUser: {
    id: "user-uuid-1234",
    name: "Dr. Somchai",
    role: "USER",
    baseSalary: 25000,
  },
  hospitals: [
    {
      id: "hosp-1",
      userId: "user-uuid-1234",
      name: "รพ.สมิติเวช สุขุมวิท",
      shiftCategory: "THREE_SHIFT",
      shiftRates: { MORNING: 1200, EVENING: 1500, NIGHT: 1800 },
    },
  ],
  shifts: [], // อาเรย์เก็บข้อมูลเวร
  specialIncomes: [
    { id: "si-1", userId: "user-uuid-1234", name: "ค่าพตส.", amount: 1500 },
  ],
  deductions: [
    {
      id: "d-1",
      userId: "user-uuid-1234",
      hospitalId: "hosp-1",
      name: "หนี้สหกรณ์",
      amount: 3000,
      unit: "baht",
    },
  ],

  // --- Implementation: User & Salary ---
  setCurrentUser: (user) => set({ currentUser: user }),

  updateBaseSalary: (newSalary) =>
    set((state) => ({
      currentUser: state.currentUser
        ? { ...state.currentUser, baseSalary: newSalary }
        : null,
      baseSalary: newSalary,
    })),

  // --- Implementation: Hospitals ---
  getUserHospitals: () => get().hospitals,

  addHospital: (newHospData) => {
    const newHospital: Hospital = {
      id: `hosp-${Date.now()}`,
      userId: "user-uuid-1234",
      ...newHospData,
    };
    set((state) => ({ hospitals: [...state.hospitals, newHospital] }));
    return newHospital;
  },

  updateHospital: (id, updatedData) => {
    set((state) => ({
      hospitals: state.hospitals.map((h) =>
        h.id === id ? { ...h, ...updatedData } : h,
      ),
    }));
  },

  deleteHospital: (id) => {
    set((state) => ({
      hospitals: state.hospitals.filter((h) => h.id !== id),
    }));
  },

  // --- Implementation: Shifts ---
  getUserShifts: () => get().shifts,

  // --- Implementation: Special Incomes ---
  getUserSpecialIncomes: () => get().specialIncomes,

  addSpecialIncome: (newItem) => {
    const item: SpecialIncome = {
      id: `si-${Date.now()}`,
      userId: "user-uuid-1234",
      ...newItem,
    };
    set((state) => ({ specialIncomes: [...state.specialIncomes, item] }));
  },

  updateSpecialIncome: (id, updatedData) => {
    set((state) => ({
      specialIncomes: state.specialIncomes.map((si) =>
        si.id === id ? { ...si, ...updatedData } : si,
      ),
    }));
  },

  deleteSpecialIncome: (id) => {
    set((state) => ({
      specialIncomes: state.specialIncomes.filter((si) => si.id !== id),
    }));
  },

  // --- Implementation: Deductions ---
  getUserDeductions: () => get().deductions,

  addDeduction: (newItem) => {
    const item: Deduction = {
      id: `d-${Date.now()}`,
      userId: "user-uuid-1234",
      ...newItem,
    };
    set((state) => ({ deductions: [...state.deductions, item] }));
  },

  updateDeduction: (id, updatedData) => {
    set((state) => ({
      deductions: state.deductions.map((d) =>
        d.id === id ? { ...d, ...updatedData } : d,
      ),
    }));
  },

  deleteDeduction: (id) => {
    set((state) => ({
      deductions: state.deductions.filter((d) => d.id !== id),
    }));
  },
}));
