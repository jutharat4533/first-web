"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Minus, Trash2 } from "lucide-react";
import { P, ROSE, STEEL, EGG } from "@/styles/theme";
import { Deduction, Hospital } from "@/@types/types";
import { useDashboardStore } from "@/store/useDashboardStore";
import { validateRequired } from "@/lib/validate-required";
import BottomSheet from "@/components/shared/BottomSheet";

const fmt = (n: number) => n.toLocaleString("th-TH", { minimumFractionDigits: 0 });

interface DashboardDeductionTabProps {
  hospitals: Hospital[];
  deductionsByHosp: { hosp: Hospital; items: (Deduction & { computed: number })[] }[];
}

export default function DashboardDeductionTab({
  hospitals,
  deductionsByHosp,
}: DashboardDeductionTabProps) {
  const { addDeduction, deleteDeduction } = useDashboardStore();

  const [showAdd, setShowAdd] = useState(false);
  const [addHospId, setAddHospId] = useState<number | null>(null);
  const [dName, setDName] = useState("");
  const [dAmt, setDAmt] = useState("");
  const [dUnit, setDUnit] = useState<"baht" | "percent">("baht");
  const [isSaving, setIsSaving] = useState(false);
  const savingRef = useRef(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openAddSheet = (hospitalId: number | null) => {
    setAddHospId(hospitalId);
    setDName("");
    setDAmt("");
    setDUnit("baht");
    setShowAdd(true);
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await deleteDeduction(id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ลบรายการหักไม่สำเร็จ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: "#5a7a99" }}>
          {hospitals.length === 0
            ? "เพิ่มโรงพยาบาลในแท็บรายได้ก่อน จึงจะเพิ่มรายการหักได้"
            : "เลือก รพ. เพื่อเพิ่มรายการหัก"}
        </p>
        {hospitals.length > 0 && (
          <button
            onClick={() => openAddSheet(null)}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl"
            style={{ backgroundColor: ROSE + "15", color: ROSE }}
          >
            <Plus size={13} />
            เพิ่มรายการหัก
          </button>
        )}
      </div>
      {hospitals.map((hosp) => {
        const items = deductionsByHosp.find((d) => d.hosp.id === hosp.id)?.items ?? [];
        return (
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
                onClick={() => openAddSheet(hosp.id)}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg"
                style={{ backgroundColor: ROSE + "15", color: ROSE }}
              >
                <Plus size={12} />
                เพิ่ม
              </button>
            </div>
            {items.length === 0 ? (
              <p className="px-4 py-3 text-xs" style={{ color: "#5a7a99" }}>
                ยังไม่มีรายการหัก
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 flex items-center gap-2 border-b last:border-b-0"
                  style={{ borderColor: "rgba(3,29,68,0.04)" }}
                >
                  <Minus size={14} style={{ color: ROSE }} />
                  <span className="flex-1 text-sm font-medium" style={{ color: P }}>
                    {item.name}
                  </span>
                  <div className="text-right">
                    <p className="text-xs font-semibold" style={{ color: ROSE }}>
                      ฿{fmt(item.computed)}
                    </p>
                    {item.unit === "percent" && (
                      <p className="text-[10px]" style={{ color: "#5a7a99" }}>
                        {item.amount}% ของเงินเดือนพื้นฐาน
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1 rounded"
                    style={{ color: ROSE }}
                  >
                    {deletingId === item.id ? (
                      <Loader2 className="animate-spin" size={13} />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        );
      })}

      {showAdd && (
        <BottomSheet title="เพิ่มรายการหัก" onClose={() => setShowAdd(false)}>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
                โรงพยาบาล
              </label>
              <div className="flex flex-wrap gap-2">
                {hospitals.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => setAddHospId(h.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
                    style={{
                      borderColor: addHospId === h.id ? STEEL : "rgba(3,29,68,0.12)",
                      backgroundColor: addHospId === h.id ? STEEL : "#f8fafc",
                      color: addHospId === h.id ? "white" : P,
                    }}
                  >
                    {h.name}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={dName}
              onChange={(e) => setDName(e.target.value)}
              placeholder="เช่น หนี้สหกรณ์"
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{ borderColor: "rgba(3,29,68,0.12)", backgroundColor: "#f8fafc", color: P }}
            />
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={dAmt}
                onChange={(e) => setDAmt(e.target.value)}
                placeholder="0"
                className="flex-1 px-4 py-3 rounded-2xl text-sm outline-none border-2"
                style={{ borderColor: "rgba(3,29,68,0.12)", backgroundColor: "#f8fafc", color: P }}
              />
              <div className="flex rounded-2xl overflow-hidden border-2" style={{ borderColor: "rgba(3,29,68,0.12)" }}>
                {(["baht", "percent"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => setDUnit(u)}
                    className="px-3 py-3 text-xs font-semibold"
                    style={{
                      backgroundColor: dUnit === u ? STEEL : "#f8fafc",
                      color: dUnit === u ? "white" : P,
                    }}
                  >
                    {u === "baht" ? "บาท" : "%"}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={async () => {
                const error = validateRequired({
                  โรงพยาบาล: addHospId !== null,
                  ชื่อรายการหัก: dName.trim().length > 0,
                  จำนวนเงิน: dAmt.trim().length > 0,
                });
                if (error) {
                  toast.error(error);
                  return;
                }
                if (addHospId === null) return;
                if (savingRef.current) return;

                savingRef.current = true;
                setIsSaving(true);
                try {
                  await addDeduction({
                    hospitalId: addHospId,
                    name: dName,
                    amount: Number(dAmt),
                    unit: dUnit,
                  });
                  setDName("");
                  setDAmt("");
                  setShowAdd(false);
                } catch (error) {
                  toast.error(
                    error instanceof Error ? error.message : "เพิ่มรายการหักไม่สำเร็จ",
                  );
                } finally {
                  savingRef.current = false;
                  setIsSaving(false);
                }
              }}
              disabled={isSaving}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
              style={{ backgroundColor: ROSE, opacity: isSaving ? 0.6 : 1 }}
            >
              {isSaving ? <Loader2 className="mx-auto animate-spin" size={18} /> : "บันทึก"}
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
