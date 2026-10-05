import { Hospital, SHIFT_SLOTS, ShiftCategory, ShiftSlot } from "@/@types/types";
import { WorkplaceApi } from "@/lib/api/workplace.api";
import { ShiftRateResponse, WorkplaceResponse } from "@/lib/api/workplace-types";
import { create } from "zustand";

const VALID_SLOTS: ShiftSlot[] = ["SHIFT", "DAY", "NIGHT", "MORNING", "EVENING"];

function isShiftSlot(value: string): value is ShiftSlot {
  return (VALID_SLOTS as string[]).includes(value);
}

function buildHospital(
  workplace: WorkplaceResponse,
  rates: ShiftRateResponse[],
): Hospital {
  const ownRates = rates.filter((r) => r.workplaceSettingId === workplace.id);
  const shiftRates: Partial<Record<ShiftSlot, number>> = {};
  ownRates.forEach((rate) => {
    if (isShiftSlot(rate.shiftName)) {
      shiftRates[rate.shiftName] = rate.payRate;
    }
  });

  return {
    id: workplace.id,
    name: workplace.workplaceName,
    baseSalary: workplace.baseSalary ?? 0,
    specialAllowance: workplace.specialAllowance ?? 0,
    shiftCategory: ownRates[0]?.category ?? "THREE_SHIFT",
    shiftRates,
  };
}

export type HospitalInput = {
  name: string;
  baseSalary: number;
  specialAllowance: number;
  shiftCategory: ShiftCategory;
  shiftRates: Partial<Record<ShiftSlot, number>>;
};

interface WorkplaceState {
  hospitals: Hospital[];
  loading: boolean;
  error: string | null;
  fetchHospitals: () => Promise<void>;
  addHospital: (input: HospitalInput) => Promise<Hospital>;
  updateHospital: (id: number, input: HospitalInput) => Promise<void>;
  deleteHospital: (id: number) => Promise<void>;
}

export const useWorkplaceStore = create<WorkplaceState>((set, get) => ({
  hospitals: [],
  loading: false,
  error: null,

  fetchHospitals: async () => {
    set({ loading: true, error: null });
    try {
      const [workplaces, rates] = await Promise.all([
        WorkplaceApi.getWorkplaces(),
        WorkplaceApi.getShiftRates(),
      ]);
      set({
        hospitals: workplaces.map((w) => buildHospital(w, rates)),
        loading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "โหลดข้อมูลโรงพยาบาลไม่สำเร็จ",
        loading: false,
      });
    }
  },

  addHospital: async (input) => {
    await WorkplaceApi.createWorkplace({
      workplaceName: input.name,
      baseSalary: input.baseSalary,
      specialAllowance: input.specialAllowance,
    });

    const workplaces = await WorkplaceApi.getWorkplaces();
    const created = workplaces.find((w) => w.workplaceName === input.name);
    if (!created) {
      throw new Error("สร้างโรงพยาบาลไม่สำเร็จ");
    }

    await Promise.all(
      SHIFT_SLOTS[input.shiftCategory].map((slot) =>
        WorkplaceApi.createShiftRate({
          workplaceSettingId: created.id,
          category: input.shiftCategory,
          shiftName: slot,
          payRate: input.shiftRates[slot] ?? 0,
        }),
      ),
    );

    await get().fetchHospitals();
    const hospital = get().hospitals.find((h) => h.id === created.id);
    if (!hospital) {
      throw new Error("สร้างโรงพยาบาลไม่สำเร็จ");
    }
    return hospital;
  },

  updateHospital: async (id, input) => {
    await WorkplaceApi.updateWorkplace(id, {
      workplaceName: input.name,
      baseSalary: input.baseSalary,
      specialAllowance: input.specialAllowance,
    });

    const currentRates = (await WorkplaceApi.getShiftRates()).filter(
      (r) => r.workplaceSettingId === id,
    );
    await Promise.all(
      currentRates.map((r) => WorkplaceApi.deleteShiftRate(r.id)),
    );
    await Promise.all(
      SHIFT_SLOTS[input.shiftCategory].map((slot) =>
        WorkplaceApi.createShiftRate({
          workplaceSettingId: id,
          category: input.shiftCategory,
          shiftName: slot,
          payRate: input.shiftRates[slot] ?? 0,
        }),
      ),
    );

    await get().fetchHospitals();
  },

  deleteHospital: async (id) => {
    await WorkplaceApi.deleteWorkplace(id);
    set((state) => ({
      hospitals: state.hospitals.filter((h) => h.id !== id),
    }));
  },
}));
