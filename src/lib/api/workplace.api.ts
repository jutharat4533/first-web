import { apiFetch } from "@/lib/api/api-fetch";
import { getAccessToken } from "@/lib/api/get-access-token";
import {
  CreateDeductionDto,
  CreateShiftRateDto,
  CreateWorkplaceDto,
  DeductionResponse,
  ShiftRateResponse,
  WorkplaceResponse,
} from "@/lib/api/workplace-types";

export const WorkplaceApi = {
  async getWorkplaces() {
    const token = await getAccessToken();
    return apiFetch<WorkplaceResponse[]>("/workplace/settings", { token });
  },

  async createWorkplace(dto: CreateWorkplaceDto) {
    const token = await getAccessToken();
    return apiFetch<{ message: string }>("/workplace/settings", {
      method: "POST",
      body: dto,
      token,
    });
  },

  async updateWorkplace(id: number, dto: CreateWorkplaceDto) {
    const token = await getAccessToken();
    return apiFetch<WorkplaceResponse>(`/workplace/settings/${id}`, {
      method: "PUT",
      body: dto,
      token,
    });
  },

  async deleteWorkplace(id: number) {
    const token = await getAccessToken();
    return apiFetch<WorkplaceResponse>(`/workplace/settings/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async getShiftRates() {
    const token = await getAccessToken();
    return apiFetch<ShiftRateResponse[]>("/workplace/settings/rate", {
      token,
    });
  },

  async createShiftRate(dto: CreateShiftRateDto) {
    const token = await getAccessToken();
    return apiFetch<ShiftRateResponse>("/workplace/settings/rate", {
      method: "POST",
      body: dto,
      token,
    });
  },

  async updateShiftRate(id: number, payRate: number) {
    const token = await getAccessToken();
    return apiFetch<ShiftRateResponse>(`/workplace/settings/rate/${id}`, {
      method: "PUT",
      body: { payRate },
      token,
    });
  },

  async deleteShiftRate(id: number) {
    const token = await getAccessToken();
    return apiFetch<ShiftRateResponse>(`/workplace/settings/rate/${id}`, {
      method: "DELETE",
      token,
    });
  },

  async getDeductions() {
    const token = await getAccessToken();
    return apiFetch<DeductionResponse[]>("/workplace/settings/deduction", {
      token,
    });
  },

  async createDeduction(dto: CreateDeductionDto) {
    const token = await getAccessToken();
    return apiFetch<DeductionResponse>("/workplace/settings/deduction", {
      method: "POST",
      body: dto,
      token,
    });
  },

  async deleteDeduction(id: number) {
    const token = await getAccessToken();
    return apiFetch<DeductionResponse>(`/workplace/settings/deduction/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
