// export type ShiftType = "one_shift" | "two_shift" | "three_shift";
export type ShiftCategory = "ONE_SHIFT" | "TWO_SHIFT" | "THREE_SHIFT";

// export type ShiftSlot = "SHIFT" | "DAY" | "NIGHT" | "MORNING" | "EVENING";
export type ShiftSlot = "SHIFT" | "DAY" | "NIGHT" | "MORNING" | "EVENING";
export type JobStatus = "OPEN" | "FULL" | "CLOSED";
export type UserRole = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  appliedJobs: string[];
  baseSalary: number;
}

export interface Hospital {
  id: string;
  userId: string;
  name: string;
  // shiftType: ShiftType;
  shiftCategory: ShiftCategory;
  shiftRates: Partial<Record<ShiftSlot, number>>;
}

export interface ShiftRecord {
  id: string;
  userId: string;
  date: string;
  hospitalId: string;
  shiftSlot: ShiftSlot;
}

export interface SpecialIncome {
  id: string;
  userId: string;
  name: string;
  amount: number;
}

export interface Deduction {
  id: string;
  userId: string;
  hospitalId: string;
  name: string;
  amount: number;
  unit: "baht" | "percent";
}

export interface JobPost {
  id: string;
  location: string;
  aboutWard: string;
  isHighlighted: boolean;
  compensation: number;
  status: JobStatus;
  maxApplicants: number;
  applicants: string[];
  description: string;
  requirements: string;
  createdAt: string;
}

export const SHIFT_SLOTS: Record<ShiftCategory, ShiftSlot[]> = {
  ONE_SHIFT: ["SHIFT"],
  TWO_SHIFT: ["DAY", "NIGHT"],
  THREE_SHIFT: ["MORNING", "EVENING", "NIGHT"],
};

export const SLOT_LABEL: Record<ShiftSlot, string> = {
  SHIFT: "เวร (24 ชม.)",
  DAY12: "DAY12",
  NIGHT12: "NIGHT12",
  MORNING: "MORNING",
  EVENING: "EVENING",
  NIGHT: "NIGHT",
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

export const SLOT_COLOR: Record<ShiftSlot, { bg: string; text: string }> = {
  SHIFT: { bg: "#C9C9FF", text: "#031D44" },
  DAY: { bg: "#FFD6A5", text: "#031D44" },
  NIGHT: { bg: "#031D44", text: "#ffffff" },
  MORNING: { bg: "#E2F89C", text: "#031D44" },
  EVENING: { bg: "#FFD6A5", text: "#031D44" },
};
