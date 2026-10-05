import { Deduction, SpecialIncome } from "@/@types/types";
import { SpecialIncomeApi } from "@/lib/api/special-income.api";
import { WorkplaceApi } from "@/lib/api/workplace.api";
import { DeductionResponse } from "@/lib/api/workplace-types";
import { create } from "zustand";

function fromDeductionApi(d: DeductionResponse): Deduction {
  return {
    id: d.id,
    hospitalId: d.workplaceSettingId,
    name: d.name,
    amount: d.amount,
    unit: d.isPercent ? "percent" : "baht",
  };
}

interface DashboardState {
  specialIncomes: SpecialIncome[];
  deductions: Deduction[];
  loading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<void>;

  addSpecialIncome: (item: { name: string; amount: number }) => Promise<void>;
  updateSpecialIncome: (
    id: number,
    item: { name: string; amount: number },
  ) => Promise<void>;
  deleteSpecialIncome: (id: number) => Promise<void>;

  addDeduction: (item: {
    hospitalId: number;
    name: string;
    amount: number;
    unit: "baht" | "percent";
  }) => Promise<void>;
  deleteDeduction: (id: number) => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  specialIncomes: [],
  deductions: [],
  loading: false,
  error: null,

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    try {
      const [specialIncomes, deductions] = await Promise.all([
        SpecialIncomeApi.getSpecialIncomes(),
        WorkplaceApi.getDeductions(),
      ]);
      set({
        specialIncomes,
        deductions: deductions.map(fromDeductionApi),
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "โหลดข้อมูลแดชบอร์ดไม่สำเร็จ",
        loading: false,
      });
    }
  },

  addSpecialIncome: async (item) => {
    const created = await SpecialIncomeApi.createSpecialIncome(item);
    set((state) => ({ specialIncomes: [...state.specialIncomes, created] }));
  },

  updateSpecialIncome: async (id, item) => {
    const updated = await SpecialIncomeApi.updateSpecialIncome(id, item);
    set((state) => ({
      specialIncomes: state.specialIncomes.map((si) =>
        si.id === id ? updated : si,
      ),
    }));
  },

  deleteSpecialIncome: async (id) => {
    await SpecialIncomeApi.deleteSpecialIncome(id);
    set((state) => ({
      specialIncomes: state.specialIncomes.filter((si) => si.id !== id),
    }));
  },

  addDeduction: async (item) => {
    const created = await WorkplaceApi.createDeduction({
      workplaceSettingId: item.hospitalId,
      name: item.name,
      amount: item.amount,
      isPercent: item.unit === "percent",
    });
    set((state) => ({
      deductions: [...state.deductions, fromDeductionApi(created)],
    }));
  },

  deleteDeduction: async (id) => {
    await WorkplaceApi.deleteDeduction(id);
    set((state) => ({
      deductions: state.deductions.filter((d) => d.id !== id),
    }));
  },
}));
