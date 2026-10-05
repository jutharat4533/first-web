import { apiFetch } from "@/lib/api/api-fetch";
import { getAccessToken } from "@/lib/api/get-access-token";

export type DashboardSummaryResponse = {
  periodStart: string;
  periodEnd: string;
  shiftCount: number;
  baseSalaryTotal: number;
  shiftIncome: number;
  specialIncomeTotal: number;
  totalDeductions: number;
  totalIncome: number;
  netIncome: number;
};

export const DashboardApi = {
  async getSummary() {
    const token = await getAccessToken();
    return apiFetch<DashboardSummaryResponse>("/dashboard/summary", { token });
  },
};
