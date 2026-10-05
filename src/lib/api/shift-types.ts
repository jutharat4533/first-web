import { ShiftSlot, ShiftStatus } from "@/@types/types";

export type ShiftApiResponse = {
  id: number;
  workplace: string;
  workplaceSettingId: number | null;
  startTime: string;
  endTime: string;
  shiftSlot: ShiftSlot | null;
  status: ShiftStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateShiftApiDto = {
  workplaceSettingId: number;
  startTime: string;
  endTime: string;
  shiftSlot: ShiftSlot;
  status: ShiftStatus;
};
