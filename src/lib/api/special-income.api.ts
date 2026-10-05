import { apiFetch } from "@/lib/api/api-fetch";
import { getAccessToken } from "@/lib/api/get-access-token";

export type SpecialIncomeResponse = {
  id: number;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreateSpecialIncomeDto = {
  name: string;
  amount: number;
};

export const SpecialIncomeApi = {
  async getSpecialIncomes() {
    const token = await getAccessToken();
    return apiFetch<SpecialIncomeResponse[]>("/special-incomes", { token });
  },

  async createSpecialIncome(dto: CreateSpecialIncomeDto) {
    const token = await getAccessToken();
    return apiFetch<SpecialIncomeResponse>("/special-incomes", {
      method: "POST",
      body: dto,
      token,
    });
  },

  async updateSpecialIncome(id: number, dto: Partial<CreateSpecialIncomeDto>) {
    const token = await getAccessToken();
    return apiFetch<SpecialIncomeResponse>(`/special-incomes/${id}`, {
      method: "PUT",
      body: dto,
      token,
    });
  },

  async deleteSpecialIncome(id: number) {
    const token = await getAccessToken();
    return apiFetch<void>(`/special-incomes/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
