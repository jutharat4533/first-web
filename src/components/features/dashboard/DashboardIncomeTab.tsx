"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Edit2,
  Check,
  X,
  Plus,
  Sparkles,
  Hospital as HospitalIcon,
  Trash2,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { P, ROSE, STEEL, EGG, LIME } from "@/styles/theme";
import {
  Hospital,
  ShiftRecord,
  SHIFT_TYPE_LABEL,
  SLOT_LABEL,
} from "@/@types/types";
import { useDashboardStore } from "@/store/useDashboardStore";
import { useWorkplaceStore } from "@/store/useWorkplaceStore";
import { validateRequired } from "@/lib/validate-required";
import { HospitalForm } from "./HospitalForm";
import BottomSheet from "@/components/shared/BottomSheet";

const fmt = (n: number) =>
  n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

interface DashboardIncomeTabProps {
  hospitals: Hospital[];
  specialIncomes: { id: number; name: string; amount: number }[];
  shiftIncomeByHosp: { hosp: Hospital; count: number; total: number }[];
  monthShifts: ShiftRecord[];
  baseSalaryTotal: number;
  totalSpecial: number;
  totalIncome: number;
}

export default function DashboardIncomeTab({
  hospitals,
  specialIncomes,
  shiftIncomeByHosp,
  monthShifts,
  baseSalaryTotal,
  totalSpecial,
  totalIncome,
}: DashboardIncomeTabProps) {
  const { addSpecialIncome, updateSpecialIncome, deleteSpecialIncome } =
    useDashboardStore();
  const { addHospital, updateHospital, deleteHospital } = useWorkplaceStore();

  const [sheet, setSheet] = useState<"none" | "addHosp" | "editHosp" | "addSI">(
    "none",
  );
  const [editHospId, setEditHospId] = useState<number | null>(null);
  const [expandedHosps, setExpandedHosps] = useState<Record<number, boolean>>(
    {},
  );
  const [siName, setSiName] = useState("");
  const [siAmt, setSiAmt] = useState("");
  const [editSiId, setEditSiId] = useState<number | null>(null);
  const [editSiName, setEditSiName] = useState("");
  const [editSiAmt, setEditSiAmt] = useState("");
  const [savingSpecialIncome, setSavingSpecialIncome] = useState(false);
  const [savingSpecialIncomeId, setSavingSpecialIncomeId] = useState<number | null>(null);
  const [deletingSpecialIncomeId, setDeletingSpecialIncomeId] = useState<number | null>(null);
  const [deletingHospitalId, setDeletingHospitalId] = useState<number | null>(null);

  const toggleHosp = (id: number) =>
    setExpandedHosps((p) => ({ ...p, [id]: !p[id] }));

  const handleDeleteHospital = async (id: number) => {
    setDeletingHospitalId(id);
    try {
      await deleteHospital(id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ลบโรงพยาบาลไม่สำเร็จ",
      );
    } finally {
      setDeletingHospitalId(null);
    }
  };

  const handleDeleteSpecialIncome = async (id: number) => {
    setDeletingSpecialIncomeId(id);
    try {
      await deleteSpecialIncome(id);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "ลบรายได้พิเศษไม่สำเร็จ",
      );
    } finally {
      setDeletingSpecialIncomeId(null);
    }
  };

  return (
    <>
      {/* Base Salary rollup */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{ backgroundColor: EGG }}
      >
        <div
          className="px-4 py-3 flex items-center gap-2 border-b"
          style={{ borderColor: "rgba(3,29,68,0.06)" }}
        >
          <div
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: STEEL }}
          />
          <span className="text-sm font-bold" style={{ color: P }}>
            เงินเดือนพื้นฐานรวม
          </span>
        </div>
        <div className="px-4 py-3">
          <p className="text-xl font-bold" style={{ color: P }}>
            ฿{fmt(baseSalaryTotal)}
            <span
              className="text-xs font-normal ml-1"
              style={{ color: "#5a7a99" }}
            >
              บาท/เดือน
            </span>
          </p>
          <div className="flex justify-between">
            <p className="text-[10px] mt-1" style={{ color: "#5a7a99" }}>
              รวมเงินเดือนพื้นฐาน + ค่าตอบแทนพิเศษของทุก รพ. รพ.
            </p>
            <p className="text-[12px] mt-1" style={{ color: "#5a7a99" }}>
              ** แก้ไขได้ที่ข้อมูล [+เพิ่ม รพ.] **
            </p>
          </div>
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
          style={{ backgroundColor: EGG, borderColor: "rgba(3,29,68,0.06)" }}
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
            <div key={si.id} className="px-4 py-3 flex items-center gap-2">
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
                    onClick={async () => {
                      const error = validateRequired({
                        ชื่อรายได้: editSiName.trim().length > 0,
                        จำนวนเงิน: editSiAmt.trim().length > 0,
                      });
                      if (error) {
                        toast.error(error);
                        return;
                      }
                      if (savingSpecialIncomeId === si.id) return;
                      setSavingSpecialIncomeId(si.id);
                      try {
                        await updateSpecialIncome(si.id, {
                          name: editSiName,
                          amount: Number(editSiAmt),
                        });
                        setEditSiId(null);
                      } catch (error) {
                        toast.error(
                          error instanceof Error
                            ? error.message
                            : "แก้ไขรายได้พิเศษไม่สำเร็จ",
                        );
                      } finally {
                        setSavingSpecialIncomeId(null);
                      }
                    }}
                    className="p-1 rounded"
                    style={{ color: STEEL }}
                  >
                    {savingSpecialIncomeId === si.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <Check size={14} />
                    )}
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
                  <span className="text-sm font-bold" style={{ color: STEEL }}>
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
                    onClick={() => handleDeleteSpecialIncome(si.id)}
                    disabled={deletingSpecialIncomeId === si.id}
                    className="p-1 rounded"
                    style={{ color: ROSE }}
                  >
                    {deletingSpecialIncomeId === si.id ? (
                      <Loader2 className="animate-spin" size={13} />
                    ) : (
                      <Trash2 size={13} />
                    )}
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
              <span className="text-xs font-bold" style={{ color: STEEL }}>
                รวมรายได้พิเศษ
              </span>
              <span className="text-sm font-bold" style={{ color: STEEL }}>
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
            ยังไม่มีข้อมูลเวรเดือนนี้ ลงตารางเวรในหน้า &quot;ตารางเวร&quot;
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
                      {count} เวร · {SHIFT_TYPE_LABEL[hosp.shiftCategory]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: STEEL }}>
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
                        <span className="text-xs" style={{ color: "#5a7a99" }}>
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
                      style={{ backgroundColor: STEEL + "15", color: STEEL }}
                    >
                      <Edit2 size={12} />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDeleteHospital(hosp.id)}
                      disabled={deletingHospitalId === hosp.id}
                      className="flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                      style={{ backgroundColor: ROSE + "15", color: ROSE }}
                    >
                      {deletingHospitalId === hosp.id ? (
                        <Loader2 className="animate-spin" size={12} />
                      ) : (
                        <Trash2 size={12} />
                      )}
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

      {sheet === "addHosp" && (
        <BottomSheet title="เพิ่มโรงพยาบาล" onClose={() => setSheet("none")}>
          <HospitalForm
            onSave={async (h) => {
              try {
                await addHospital(h);
                setSheet("none");
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "เพิ่มโรงพยาบาลไม่สำเร็จ",
                );
              }
            }}
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
                onSave={async (h) => {
                  try {
                    await updateHospital(editHospId, h);
                    setSheet("none");
                  } catch (error) {
                    toast.error(
                      error instanceof Error
                        ? error.message
                        : "แก้ไขโรงพยาบาลไม่สำเร็จ",
                    );
                  }
                }}
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
              onClick={async () => {
                const error = validateRequired({
                  ชื่อรายได้: siName.trim().length > 0,
                  จำนวนเงิน: siAmt.trim().length > 0,
                });
                if (error) {
                  toast.error(error);
                  return;
                }
                if (savingSpecialIncome) return;
                setSavingSpecialIncome(true);
                try {
                  await addSpecialIncome({
                    name: siName,
                    amount: Number(siAmt),
                  });
                  setSiName("");
                  setSiAmt("");
                  setSheet("none");
                } catch (error) {
                  toast.error(
                    error instanceof Error
                      ? error.message
                      : "เพิ่มรายได้พิเศษไม่สำเร็จ",
                  );
                } finally {
                  setSavingSpecialIncome(false);
                }
              }}
              disabled={savingSpecialIncome}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: ROSE, opacity: savingSpecialIncome ? 0.6 : 1 }}
            >
              {savingSpecialIncome ? <Loader2 className="animate-spin" size={18} /> : null}
              {savingSpecialIncome ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
