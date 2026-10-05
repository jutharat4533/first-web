import { apiFetch } from "@/lib/api/api-fetch";
import { getAccessToken } from "@/lib/api/get-access-token";
import { CreateShiftApiDto, ShiftApiResponse } from "@/lib/api/shift-types";

export const ShiftsApi = {
  async getShifts() {
    const token = await getAccessToken();
    return apiFetch<ShiftApiResponse[]>("/shifts", { token });
  },

  async createShift(dto: CreateShiftApiDto) {
    const token = await getAccessToken();
    return apiFetch<ShiftApiResponse>("/shifts", {
      method: "POST",
      body: dto,
      token,
    });
  },

  async updateShift(id: number, dto: Partial<CreateShiftApiDto>) {
    const token = await getAccessToken();
    return apiFetch<ShiftApiResponse>(`/shifts/${id}`, {
      method: "PUT",
      body: dto,
      token,
    });
  },

  async deleteShift(id: number) {
    const token = await getAccessToken();
    return apiFetch<ShiftApiResponse>(`/shifts/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
