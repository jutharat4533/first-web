import { ShiftCategory } from "@/@types/types";

export type WorkplaceResponse = {
  id: number;
  workplaceName: string;
  baseSalary: number | null;
  specialAllowance: number | null;
};

export type CreateWorkplaceDto = {
  workplaceName: string;
  baseSalary?: number;
  specialAllowance?: number;
};

export type ShiftRateResponse = {
  id: number;
  workplaceSettingId: number;
  category: ShiftCategory;
  shiftName: string;
  payRate: number;
};

export type CreateShiftRateDto = {
  workplaceSettingId: number;
  category: ShiftCategory;
  shiftName: string;
  payRate: number;
};

export type DeductionResponse = {
  id: number;
  workplaceSettingId: number;
  name: string;
  amount: number;
  isPercent: boolean;
};

export type CreateDeductionDto = {
  workplaceSettingId: number;
  name: string;
  amount: number;
  isPercent?: boolean;
};
