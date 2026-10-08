"use client";

import { useEffect, useMemo, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { P, ROSE, STEEL, LIME } from "@/styles/theme";
import { Deduction, Hospital } from "@/@types/types";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useShiftStore } from "@/store/useShiftStore";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import DashboardIncomeTab from "@/components/features/dashboard/DashboardIncomeTab";
import DashboardDeductionTab from "@/components/features/dashboard/DashboardDeductionTab";
import LoadingState from "@/components/shared/LoadingState";

const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

const THAI_MONTHS = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export function DashboardMain() {
  const { specialIncomes, deductions, loading: dashboardLoading, fetchDashboardData } =
    useDashboardStore();
  const { hospitals, loading: hospitalsLoading, fetchHospitals } = useWorkplaceStore();
  const { shifts, loading: shiftsLoading, fetchShifts } = useShiftStore();

  useEffect(() => {
    fetchHospitals();
    fetchShifts();
    fetchDashboardData();
  }, [fetchHospitals, fetchShifts, fetchDashboardData]);

  const [tab, setTab] = useState<"income" | "deduct">("income");
  const now = useMemo(() => new Date(), []);

  const monthShifts = useMemo(
    () =>
      shifts.filter((s) => {
        const d = new Date(s.date);
        return (
          d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        );
      }),
    [shifts, now],
  );

  const shiftIncomeByHosp = useMemo(() => {
    const map: Record<number, { hosp: Hospital; count: number; total: number }> = {};
    monthShifts.forEach((s) => {
      const hosp = hospitals.find((h) => h.id === s.hospitalId);
      if (!hosp) return;
      if (!map[hosp.id]) map[hosp.id] = { hosp, count: 0, total: 0 };
      const rate = hosp.shiftRates[s.shiftSlot] ?? 0;
      map[hosp.id].count++;
      map[hosp.id].total += rate;
    });
    return Object.values(map);
  }, [monthShifts, hospitals]);

  const baseSalaryTotal = hospitals.reduce(
    (a, h) => a + h.baseSalary + h.specialAllowance,
    0,
  );
  const totalShiftIncome = shiftIncomeByHosp.reduce((a, x) => a + x.total, 0);
  const totalSpecial = specialIncomes.reduce((a, x) => a + x.amount, 0);
  const totalIncome = baseSalaryTotal + totalShiftIncome + totalSpecial;

  const hospitalIncomeRows = useMemo(
    () =>
      hospitals.map((hosp) => {
        const income = shiftIncomeByHosp.find((item) => item.hosp.id === hosp.id);
        return (
          income ?? {
            hosp,
            count: 0,
            total: 0,
          }
        );
      }),
    [hospitals, shiftIncomeByHosp],
  );

  const deductionsByHosp = useMemo(() => {
    const map: Record<
      number,
      { hosp: Hospital; items: (Deduction & { computed: number })[] }
    > = {};

    deductions.forEach((d) => {
      const hosp = hospitals.find((h) => h.id === d.hospitalId);
      if (!hosp) return;
      if (!map[hosp.id]) map[hosp.id] = { hosp, items: [] };
      const computed =
        d.unit === "percent" ? Math.round((hosp.baseSalary * d.amount) / 100) : d.amount;
      map[hosp.id].items.push({ ...d, computed });
    });
    return Object.values(map);
  }, [deductions, hospitals]);

  const totalDeductions = deductionsByHosp.reduce(
    (a, x) => a + x.items.reduce((b, i) => b + i.computed, 0),
    0,
  );
  const netIncome = totalIncome - totalDeductions;
  const isLoading = dashboardLoading || hospitalsLoading || shiftsLoading;

  const monthLabel = `${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543}`;

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ backgroundColor: P }}>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          {monthLabel}
        </p>
        <h1 className="text-xl font-bold text-white">แดชบอร์ดรายได้</h1>
      </div>

      {/* Net Income Card */}
      <div className="px-5 pt-4 pb-2" style={{ backgroundColor: P }}>
        <div
          className="rounded-2xl p-4 relative overflow-hidden shadow-lg"
          style={{ background: `linear-gradient(135deg, ${STEEL} 0%, ${P} 100%)` }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>
            รายได้สุทธิเดือนนี้
          </p>
          <p className="text-3xl font-bold text-white mt-0.5">฿{fmt(netIncome)}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div
              className="rounded-xl p-2 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="text-sm font-bold" style={{ color: LIME }}>
                ฿{fmt(totalIncome)}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                รายได้รวม
              </p>
            </div>
            <div
              className="rounded-xl p-2 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="text-sm font-bold" style={{ color: ROSE }}>
                ฿{fmt(totalDeductions)}
              </p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                รายการหักรวม
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b shrink-0"
        style={{ backgroundColor: "white", borderColor: "rgba(3,29,68,0.1)" }}
      >
        {[
          { id: "income" as const, label: "รายได้", icon: <TrendingUp size={14} /> },
          { id: "deduct" as const, label: "รายการหัก", icon: <TrendingDown size={14} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors"
            style={{
              borderBottomColor: tab === t.id ? ROSE : "transparent",
              color: tab === t.id ? ROSE : "#5a7a99",
            }}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Body */}
      <div className="relative flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-6">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-start justify-center bg-slate-50/75 pt-16 backdrop-blur-[1px]">
            <LoadingState label="กำลังโหลดข้อมูลแดชบอร์ด..." />
          </div>
        )}
        {tab === "income" && (
          <DashboardIncomeTab
            hospitals={hospitals}
            specialIncomes={specialIncomes}
            shiftIncomeByHosp={hospitalIncomeRows}
            monthShifts={monthShifts}
            baseSalaryTotal={baseSalaryTotal}
            totalSpecial={totalSpecial}
            totalIncome={totalIncome}
          />
        )}
        {tab === "deduct" && (
          <DashboardDeductionTab hospitals={hospitals} deductionsByHosp={deductionsByHosp} />
        )}
      </div>
    </div>
  );
}
