"use client";

import { P, ROSE, STEEL, EGG, LIME } from "@/styles/theme";
import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Edit2,
  Check,
  X,
  Plus,
  Sparkles,
  Hospital as HospitalIcon,
  Trash2,
  ChevronDown,
  ChevronUp,
  Minus,
} from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import type {
  Hospital,
  Hospital as HospitalType,
  ShiftSlot,
} from "@/@types/types";
import { SLOT_LABEL, SHIFT_TYPE_LABEL } from "@/@types/types";
import { HospitalForm } from "@/components/features/dashboard/HospitalForm";

// 🛡️ ฟังก์ชันจัดรูปแบบตัวเลขเงินให้เป็นรูปแบบมาตรฐานไทย (เช่น 25,000)
const fmt = (n: number) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

function BottomSheet({ title, onClose, children }: BottomSheetProps) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl max-h-[80%] flex flex-col shadow-2xl">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(3,29,68,0.08)" }}
        >
          <h3 className="text-base font-bold" style={{ color: P }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#f0f4f8" }}
          >
            <X size={16} style={{ color: P }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}

export function DashboardMain() {
  const {
    currentUser,
    getUserHospitals,
    addHospital,
    updateHospital,
    deleteHospital,
    getUserShifts,
    getUserSpecialIncomes,
    addSpecialIncome,
    updateSpecialIncome,
    deleteSpecialIncome,
    getUserDeductions,
    addDeduction,
    deleteDeduction,
    updateBaseSalary,
  } = useDashboardStore();

  const [tab, setTab] = useState<"income" | "deduct">("income");
  const [sheet, setSheet] = useState<
    "none" | "addHosp" | "editHosp" | "addSI" | "addDeduct"
  >("none");
  const [editHospId, setEditHospId] = useState<string | null>(null);
  const [addDeductHospId, setAddDeductHospId] = useState<string>("");
  const [editBaseSalary, setEditBaseSalary] = useState(false);
  const [baseSalaryInput, setBaseSalaryInput] = useState(
    String(currentUser?.baseSalary ?? 0),
  );
  const [siName, setSiName] = useState("");
  const [siAmt, setSiAmt] = useState("");
  const [dName, setDName] = useState("");
  const [dAmt, setDAmt] = useState("");
  const [dUnit, setDUnit] = useState<"baht" | "percent">("baht");
  const [expandedHosps, setExpandedHosps] = useState<Record<string, boolean>>(
    {},
  );
  const [editSiId, setEditSiId] = useState<string | null>(null);
  const [editSiName, setEditSiName] = useState("");
  const [editSiAmt, setEditSiAmt] = useState("");

  const now = new Date();
  const hospitals = getUserHospitals();
  const allShifts = getUserShifts();
  const specialIncomes = getUserSpecialIncomes();
  const deductions = getUserDeductions();
  const baseSalary = currentUser?.baseSalary ?? 0;

  // กรองกะเวรเฉพาะเดือนปัจจุบัน
  const monthShifts = useMemo(
    () =>
      allShifts.filter((s) => {
        const d = new Date(s.date);
        return (
          d.getFullYear() === now.getFullYear() &&
          d.getMonth() === now.getMonth()
        );
      }),
    [allShifts, now],
  );

  // คำนวณรายได้ค่าเวรแยกตามโรงพยาบาล
  const shiftIncomeByHosp = useMemo(() => {
    const map: Record<
      string,
      {
        hosp: HospitalType;
        count: number;
        total: number;
        slots: { slot: ShiftSlot; rate: number }[];
      }
    > = {};

    monthShifts.forEach((s) => {
      const hosp = hospitals.find((h) => h.id === s.hospitalId);
      if (!hosp) return;
      if (!map[hosp.id]) map[hosp.id] = { hosp, count: 0, total: 0, slots: [] };
      const rate = hosp.shiftRates[s.shiftSlot] ?? 0;
      map[hosp.id].count++;
      map[hosp.id].total += rate;
      map[hosp.id].slots.push({ slot: s.shiftSlot, rate });
    });
    return Object.values(map);
  }, [monthShifts, hospitals]);

  const totalShiftIncome = shiftIncomeByHosp.reduce((a, x) => a + x.total, 0);
  const totalSpecial = specialIncomes.reduce((a, x) => a + x.amount, 0);
  const totalIncome = baseSalary + totalSpecial + totalShiftIncome;

  // 🚀 ปรับปรุงตามมาตรฐาน React 19: ถอด useMemo ออก ปล่อยให้ React Compiler จัดการประสิทธิภาพให้อัตโนมัติ
  const deductionsByHosp = (() => {
    const map: Record<
      string,
      { hosp: Hospital; items: (unknown & { computed: number })[] }
    > = {};

    deductions.forEach((d) => {
      const hosp = hospitals.find((h) => h.id === d.hospitalId);
      if (!hosp) return;
      if (!map[hosp.id]) map[hosp.id] = { hosp, items: [] };

      const shiftInc =
        shiftIncomeByHosp.find((x) => x.hosp.id === hosp.id)?.total ?? 0;
      const base =
        hosp.id === hospitals[0]?.id
          ? baseSalary + totalSpecial + shiftInc
          : shiftInc;
      const computed =
        d.unit === "percent" ? Math.round((base * d.amount) / 100) : d.amount;

      map[hosp.id].items.push({ ...d, computed });
    });
    return Object.values(map);
  })();

  const totalDeductions = deductionsByHosp.reduce(
    (a, x) => a + x.items.reduce((b, i) => b + i.computed, 0),
    0,
  );
  const netIncome = totalIncome - totalDeductions;

  const toggleHosp = (id: string) =>
    setExpandedHosps((p) => ({ ...p, [id]: !p[id] }));

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
          style={{
            background: `linear-gradient(135deg, ${STEEL} 0%, ${P} 100%)`,
          }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 bg-white" />
          <p
            className="text-xs font-medium"
            style={{ color: "rgba(255,255,255,0.7)" }}
          >
            รายได้สุทธิเดือนนี้
          </p>
          <p className="text-3xl font-bold text-white mt-0.5">
            ฿{fmt(netIncome)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div
              className="rounded-xl p-2 text-center"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <p className="text-sm font-bold" style={{ color: LIME }}>
                ฿{fmt(totalIncome)}
              </p>
              <p
                className="text-[10px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
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
              <p
                className="text-[10px]"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
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
          { id: "income", label: "รายได้", icon: <TrendingUp size={14} /> },
          {
            id: "deduct",
            label: "รายการหัก",
            icon: <TrendingDown size={14} />,
          },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as "income" | "deduct")}
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
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-6">
        {tab === "income" && (
          <>
            {/* Base Salary */}
            <div
              className="rounded-2xl overflow-hidden shadow-sm"
              style={{ backgroundColor: EGG }}
            >
              <div
                className="px-4 py-3 flex items-center justify-between border-b"
                style={{ borderColor: "rgba(3,29,68,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-1 h-4 rounded-full"
                    style={{ backgroundColor: STEEL }}
                  />
                  <span className="text-sm font-bold" style={{ color: P }}>
                    เงินเดือนพื้นฐาน
                  </span>
                </div>
                {!editBaseSalary && (
                  <button
                    onClick={() => {
                      setEditBaseSalary(true);
                      setBaseSalaryInput(String(baseSalary));
                    }}
                    className="p-1.5 rounded-lg"
                    style={{ color: STEEL }}
                  >
                    <Edit2 size={15} />
                  </button>
                )}
              </div>
              <div className="px-4 py-3">
                {editBaseSalary ? (
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold" style={{ color: P }}>
                      ฿
                    </span>
                    <input
                      type="number"
                      value={baseSalaryInput}
                      onChange={(e) => setBaseSalaryInput(e.target.value)}
                      className="flex-1 text-lg font-bold bg-transparent outline-none border-b-2"
                      style={{ color: P, borderBottomColor: STEEL }}
                      autoFocus
                    />
                    <button
                      onClick={() => {
                        updateBaseSalary(Number(baseSalaryInput));
                        setEditBaseSalary(false);
                      }}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: LIME }}
                    >
                      <Check size={15} style={{ color: P }} />
                    </button>
                    <button
                      onClick={() => setEditBaseSalary(false)}
                      className="p-1.5 rounded-lg"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      <X size={15} style={{ color: "#5a7a99" }} />
                    </button>
                  </div>
                ) : (
                  <p className="text-xl font-bold" style={{ color: P }}>
                    ฿{fmt(baseSalary)}
                    <span
                      className="text-xs font-normal ml-1"
                      style={{ color: "#5a7a99" }}
                    >
                      บาท/เดือน
                    </span>
                  </p>
                )}
              </div>
            </div>

            {/* Special Incomes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} style={{ color: ROSE }} />
                  <span className="text-sm font-bold" style={{ color: P }}>
                    รายได้พิเศษ
                  </span>
                </div>
                <button
                  onClick={() => setSheet("addSI")}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: ROSE + "15", color: ROSE }}
                >
                  <Plus size={13} />
                  เพิ่ม
                </button>
              </div>
              <div
                className="rounded-2xl overflow-hidden shadow-sm divide-y"
                style={{
                  backgroundColor: EGG,
                  borderColor: "rgba(3,29,68,0.06)",
                }}
              >
                {specialIncomes.length === 0 && (
                  <p
                    className="px-4 py-3 text-xs text-center"
                    style={{ color: "#5a7a99" }}
                  >
                    ยังไม่มีรายได้พิเศษ กดเพิ่มด้านบน
                  </p>
                )}
                {specialIncomes.map((si) => (
                  <div
                    key={si.id}
                    className="px-4 py-3 flex items-center gap-2"
                  >
                    {editSiId === si.id ? (
                      <>
                        <input
                          value={editSiName}
                          onChange={(e) => setEditSiName(e.target.value)}
                          className="flex-1 text-sm bg-transparent outline-none border-b"
                          style={{ color: P, borderBottomColor: STEEL }}
                        />
                        <input
                          type="number"
                          value={editSiAmt}
                          onChange={(e) => setEditSiAmt(e.target.value)}
                          className="w-24 text-sm bg-transparent outline-none border-b text-right"
                          style={{ color: P, borderBottomColor: STEEL }}
                        />
                        <button
                          onClick={() => {
                            updateSpecialIncome(si.id, {
                              name: editSiName,
                              amount: Number(editSiAmt),
                            });
                            setEditSiId(null);
                          }}
                          className="p-1 rounded"
                          style={{ color: STEEL }}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          onClick={() => setEditSiId(null)}
                          className="p-1 rounded"
                          style={{ color: "#5a7a99" }}
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          className="flex-1 text-sm font-medium"
                          style={{ color: P }}
                        >
                          {si.name}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: STEEL }}
                        >
                          ฿{fmt(si.amount)}
                        </span>
                        <button
                          onClick={() => {
                            setEditSiId(si.id);
                            setEditSiName(si.name);
                            setEditSiAmt(String(si.amount));
                          }}
                          className="p-1 rounded"
                          style={{ color: "#5a7a99" }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => deleteSpecialIncome(si.id)}
                          className="p-1 rounded"
                          style={{ color: ROSE }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                ))}
                {specialIncomes.length > 0 && (
                  <div
                    className="px-4 py-2 flex items-center justify-between"
                    style={{ backgroundColor: STEEL + "0A" }}
                  >
                    <span
                      className="text-xs font-bold"
                      style={{ color: STEEL }}
                    >
                      รวมรายได้พิเศษ
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: STEEL }}
                    >
                      ฿{fmt(totalSpecial)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Shift Incomes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <HospitalIcon size={14} style={{ color: P }} />
                  <span className="text-sm font-bold" style={{ color: P }}>
                    ค่าเวรเดือนนี้
                  </span>
                </div>
                <button
                  onClick={() => setSheet("addHosp")}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: STEEL + "15", color: STEEL }}
                >
                  <Plus size={13} />
                  เพิ่ม รพ.
                </button>
              </div>
              {shiftIncomeByHosp.length === 0 && (
                <div
                  className="rounded-2xl px-4 py-6 text-center text-xs"
                  style={{ backgroundColor: EGG, color: "#5a7a99" }}
                >
                  ยังไม่มีข้อมูลเวรเดือนนี้ ลงตารางเวรในหน้า "ตารางเวร"
                </div>
              )}
              <div className="space-y-2">
                {shiftIncomeByHosp.map(({ hosp, count, total }) => (
                  <div
                    key={hosp.id}
                    className="rounded-2xl overflow-hidden shadow-sm"
                    style={{ backgroundColor: EGG }}
                  >
                    <button
                      onClick={() => toggleHosp(hosp.id)}
                      className="w-full px-4 py-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: P }}
                        >
                          {hosp.name.slice(3, 5) || hosp.name.slice(0, 2)}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-bold" style={{ color: P }}>
                            {hosp.name}
                          </p>
                          <p className="text-xs" style={{ color: "#5a7a99" }}>
                            {count} เวร · {SHIFT_TYPE_LABEL[hosp.shiftType]}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm font-bold"
                          style={{ color: STEEL }}
                        >
                          ฿{fmt(total)}
                        </span>
                        {expandedHosps[hosp.id] ? (
                          <ChevronUp size={16} style={{ color: "#5a7a99" }} />
                        ) : (
                          <ChevronDown size={16} style={{ color: "#5a7a99" }} />
                        )}
                      </div>
                    </button>
                    {expandedHosps[hosp.id] && (
                      <div
                        className="border-t"
                        style={{ borderColor: "rgba(3,29,68,0.06)" }}
                      >
                        {monthShifts
                          .filter((s) => s.hospitalId === hosp.id)
                          .map((s, i) => (
                            <div
                              key={i}
                              className="px-4 py-2 flex items-center justify-between border-b last:border-b-0"
                              style={{ borderColor: "rgba(3,29,68,0.04)" }}
                            >
                              <span
                                className="text-xs"
                                style={{ color: "#5a7a99" }}
                              >
                                {s.date} · {SLOT_LABEL[s.shiftSlot]}
                              </span>
                              <span
                                className="text-xs font-semibold"
                                style={{ color: P }}
                              >
                                ฿{fmt(hosp.shiftRates[s.shiftSlot] ?? 0)}
                              </span>
                            </div>
                          ))}
                        <div className="flex items-center justify-between px-4 py-2 gap-3">
                          <button
                            onClick={() => {
                              setEditHospId(hosp.id);
                              setSheet("editHosp");
                            }}
                            className="flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                            style={{
                              backgroundColor: STEEL + "15",
                              color: STEEL,
                            }}
                          >
                            <Edit2 size={12} />
                            แก้ไข
                          </button>
                          <button
                            onClick={() => deleteHospital(hosp.id)}
                            className="flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                            style={{
                              backgroundColor: ROSE + "15",
                              color: ROSE,
                            }}
                          >
                            <Trash2 size={12} />
                            ลบ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Total Income Banner */}
            <div
              className="rounded-2xl px-5 py-4 flex items-center justify-between shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${STEEL}22 0%, ${LIME}44 100%)`,
                border: `1.5px solid ${STEEL}30`,
              }}
            >
              <div className="flex items-center gap-2">
                <TrendingUp size={18} style={{ color: STEEL }} />
                <span className="text-sm font-bold" style={{ color: P }}>
                  รายได้รวมทั้งหมด
                </span>
              </div>
              <span className="text-xl font-bold" style={{ color: STEEL }}>
                ฿{fmt(totalIncome)}
              </span>
            </div>
          </>
        )}

        {tab === "deduct" && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-xs" style={{ color: "#5a7a99" }}>
                เลือก รพ. เพื่อเพิ่มรายการหัก
              </p>
              {hospitals.length > 0 && (
                <button
                  onClick={() => {
                    setAddDeductHospId(hospitals[0].id);
                    setSheet("addDeduct");
                  }}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
                  style={{ backgroundColor: ROSE + "15", color: ROSE }}
                >
                  <Plus size={13} />
                  เพิ่มรายการหัก
                </button>
              )}
            </div>
            {deductionsByHosp.map(({ hosp, items }) => (
              <div
                key={hosp.id}
                className="rounded-2xl overflow-hidden shadow-sm"
                style={{ backgroundColor: EGG }}
              >
                <div
                  className="px-4 py-3 flex items-center justify-between border-b"
                  style={{ borderColor: "rgba(3,29,68,0.06)" }}
                >
                  <span className="text-sm font-bold" style={{ color: P }}>
                    {hosp.name}
                  </span>
                  <button
                    onClick={() => {
                      setAddDeductHospId(hosp.id);
                      setDName("");
                      setDAmt("");
                      setDUnit("baht");
                      setSheet("addDeduct");
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
                    style={{ backgroundColor: ROSE + "15", color: ROSE }}
                  >
                    <Plus size={12} />
                    เพิ่ม
                  </button>
                </div>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-3 flex items-center gap-2 border-b last:border-b-0"
                    style={{ borderColor: "rgba(3,29,68,0.04)" }}
                  >
                    <Minus size={14} style={{ color: ROSE }} />
                    <span
                      className="flex-1 text-sm font-medium"
                      style={{ color: P }}
                    >
                      {item.name}
                    </span>
                    <div className="text-right">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: ROSE }}
                      >
                        ฿{fmt(item.computed)}
                      </p>
                      {item.unit === "percent" && (
                        <p className="text-[10px]" style={{ color: "#5a7a99" }}>
                          {item.amount}% ของรายได้
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteDeduction(item.id)}
                      className="p-1 rounded"
                      style={{ color: ROSE }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {/* Sheets / Modals */}
      {sheet === "addHosp" && (
        <BottomSheet title="เพิ่มโรงพยาบาล" onClose={() => setSheet("none")}>
          <HospitalForm
            onSave={(h) => addHospital(h)}
            onClose={() => setSheet("none")}
          />
        </BottomSheet>
      )}
      {sheet === "editHosp" &&
        editHospId &&
        (() => {
          const hosp = hospitals.find((h) => h.id === editHospId);
          if (!hosp) return null;
          return (
            <BottomSheet
              title="แก้ไขข้อมูล รพ."
              onClose={() => setSheet("none")}
            >
              <HospitalForm
                initial={hosp}
                onSave={(h) => updateHospital(editHospId, h)}
                onClose={() => setSheet("none")}
              />
            </BottomSheet>
          );
        })()}
      {sheet === "addSI" && (
        <BottomSheet title="เพิ่มรายได้พิเศษ" onClose={() => setSheet("none")}>
          <div className="space-y-3">
            <input
              value={siName}
              onChange={(e) => setSiName(e.target.value)}
              placeholder="เช่น เงินประจำตำแหน่ง"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{
                borderColor: "rgba(3,29,68,0.12)",
                backgroundColor: "#f8fafc",
                color: P,
              }}
            />
            <input
              type="number"
              value={siAmt}
              onChange={(e) => setSiAmt(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{
                borderColor: "rgba(3,29,68,0.12)",
                backgroundColor: "#f8fafc",
                color: P,
              }}
            />
            <button
              onClick={() => {
                if (siName && siAmt) {
                  addSpecialIncome({ name: siName, amount: Number(siAmt) });
                  setSiName("");
                  setSiAmt("");
                  setSheet("none");
                }
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{ backgroundColor: ROSE }}
            >
              บันทึก
            </button>
          </div>
        </BottomSheet>
      )}
      {sheet === "addDeduct" && (
        <BottomSheet title="เพิ่มรายการหัก" onClose={() => setSheet("none")}>
          <div className="space-y-3">
            <input
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              placeholder="เช่น หนี้สหกรณ์"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{
                borderColor: "rgba(3,29,68,0.12)",
                backgroundColor: "#f8fafc",
                color: P,
              }}
            />
            <input
              type="number"
              value={dAmt}
              onChange={(e) => setDAmt(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{
                borderColor: "rgba(3,29,68,0.12)",
                backgroundColor: "#f8fafc",
                color: P,
              }}
            />
            <button
              onClick={() => {
                if (dName && dAmt && addDeductHospId) {
                  addDeduction({
                    hospitalId: addDeductHospId,
                    name: dName,
                    amount: Number(dAmt),
                    unit: dUnit,
                  });
                  setDName("");
                  setDAmt("");
                  setSheet("none");
                }
              }}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{ backgroundColor: ROSE }}
            >
              บันทึก
            </button>
          </div>
        </BottomSheet>
      )}
    </div>
  );
}
