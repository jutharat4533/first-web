export type ShiftCategory = "ONE_SHIFT" | "TWO_SHIFT" | "THREE_SHIFT";
export type ShiftSlot = "SHIFT" | "DAY" | "NIGHT" | "MORNING" | "EVENING";
export type ShiftStatus = "ACTIVE" | "PENDING";
export type JobStatus = "OPEN" | "FULL" | "CLOSED";

export interface Hospital {
  id: number;
  name: string;
  baseSalary: number;
  specialAllowance: number;
  shiftCategory: ShiftCategory;
  shiftRates: Partial<Record<ShiftSlot, number>>;
}

export interface ShiftRecord {
  id: number;
  hospitalId: number;
  date: string;
  startTime: string;
  endTime: string;
  shiftSlot: ShiftSlot;
  status: ShiftStatus;
}

export interface SpecialIncome {
  id: number;
  name: string;
  amount: number;
}

export interface Deduction {
  id: number;
  hospitalId: number;
  name: string;
  amount: number;
  unit: "baht" | "percent";
}

export const SHIFT_SLOTS: Record<ShiftCategory, ShiftSlot[]> = {
  ONE_SHIFT: ["SHIFT"],
  TWO_SHIFT: ["DAY", "NIGHT"],
  THREE_SHIFT: ["MORNING", "EVENING", "NIGHT"],
};

export const SLOT_LABEL: Record<ShiftSlot, string> = {
  SHIFT: "เวร (24 ชม.)",
  DAY: "DAY",
  NIGHT: "NIGHT",
  MORNING: "MORNING",
  EVENING: "EVENING",
};

export const SLOT_SHORT: Record<ShiftSlot, string> = {
  SHIFT: "24ชม.",
  DAY: "DAY",
  NIGHT: "NIGHT",
  MORNING: "MORNING",
  EVENING: "EVENING",
};

export const SHIFT_TYPE_LABEL: Record<ShiftCategory, string> = {
  ONE_SHIFT: "One Shift (24 ชม.)",
  TWO_SHIFT: "Two Shift (12 ชม.)",
  THREE_SHIFT: "Three Shift (8 ชม.)",
};

// จำนวนชั่วโมงทำงานมาตรฐานของแต่ละประเภทกะ ใช้คำนวณเวลาเลิกงานให้อัตโนมัติ
export const SHIFT_CATEGORY_HOURS: Record<ShiftCategory, number> = {
  ONE_SHIFT: 24,
  TWO_SHIFT: 12,
  THREE_SHIFT: 8,
};

export const SLOT_COLOR: Record<ShiftSlot, { bg: string; text: string }> = {
  SHIFT: { bg: "#C9C9FF", text: "#031D44" },
  DAY: { bg: "#f7ca94", text: "#031D44" },
  NIGHT: { bg: "#031D44", text: "#ffffff" },
  MORNING: { bg: "#aec75d", text: "#031D44" },
  EVENING: { bg: "#f7ca94", text: "#031D44" },
};
