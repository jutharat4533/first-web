import BottomSheet from "./BottomSheet";
import { Zap, Users, Edit2, Trash2, Check } from "lucide-react";
import { EGG, LIME, P, ROSE, STEEL } from "@/styles/theme";
import { JobPost, JobStatus } from "@/@types/types";

export const STATUS_LABEL: Record<JobStatus, string> = {
  OPEN: "รับสมัคร",
  FULL: "เต็มแล้ว",
  CLOSED: "ปิดรับ",
};
export const STATUS_COLOR: Record<JobStatus, { bg: string; text: string }> = {
  OPEN: { bg: LIME, text: P },
  FULL: { bg: "#FFD6A5", text: P },
  CLOSED: { bg: "#e0e0e0", text: "#666" },
};

interface JobDetailSheetProps {
  job: JobPost;
  onClose: () => void;
  onApply: () => void;
  applied: boolean;
  isAdmin: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function JobDetailSheet({
  job,
  onClose,
  onApply,
  applied,
  isAdmin,
  onEdit,
  onDelete,
}: JobDetailSheetProps) {
  const canApply = job.status === "OPEN" && !applied;

  return (
    <BottomSheet title="รายละเอียดงาน" onClose={onClose}>
      {job.isHighlighted && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: ROSE + "15" }}
        >
          <Zap size={14} style={{ color: ROSE }} />
          <span className="text-xs font-bold" style={{ color: ROSE }}>
            ด่วน! ต้องการคนเร่งด่วน
          </span>
        </div>
      )}
      <div className="space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2
              className="text-lg font-bold leading-tight"
              style={{ color: P }}
            >
              {job.location}
            </h2>
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
              style={{
                backgroundColor: STATUS_COLOR[job.status].bg,
                color: STATUS_COLOR[job.status].text,
              }}
            >
              {STATUS_LABEL[job.status]}
            </span>
          </div>
          <p className="text-sm mt-1" style={{ color: STEEL }}>
            {job.aboutWard}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: EGG }}
          >
            <p className="text-xl font-bold" style={{ color: ROSE }}>
              ฿{job.compensation.toLocaleString("th-TH")}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#5a7a99" }}>
              ค่าตอบแทน/เวร
            </p>
          </div>
          <div
            className="rounded-2xl p-3 text-center"
            style={{ backgroundColor: EGG }}
          >
            <p className="text-xl font-bold" style={{ color: STEEL }}>
              {job.applicants?.length ?? 0}/{job.maxApplicants}
            </p>
            <p className="text-[10px] mt-0.5" style={{ color: "#5a7a99" }}>
              ผู้สมัคร/รับ
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ backgroundColor: EGG }}
        >
          <p className="text-xs font-bold" style={{ color: P }}>
            รายละเอียด
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#3a5a79" }}>
            {job.description}
          </p>
        </div>

        <div className="rounded-2xl p-4" style={{ backgroundColor: EGG }}>
          <p className="text-xs font-bold mb-1" style={{ color: P }}>
            คุณสมบัติที่ต้องการ
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "#3a5a79" }}>
            {job.requirements}
          </p>
        </div>

        {!isAdmin &&
          (applied ? (
            <div
              className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: LIME, color: P }}
            >
              <Check size={18} />
              สมัครแล้ว — ดิวรายละเอียดกับสถานพยาบาลโดยตรง
            </div>
          ) : (
            <button
              onClick={() => {
                onApply();
                onClose();
              }}
              disabled={!canApply}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
              style={{
                backgroundColor: canApply ? ROSE : "#ccc",
                opacity: canApply ? 1 : 0.8,
              }}
            >
              {job.status === "FULL" ? (
                `เต็มแล้ว`
              ) : job.status === "CLOSED" ? (
                "ปิดรับสมัครแล้ว"
              ) : (
                <>
                  <Users size={18} />
                  สมัครงาน
                </>
              )}
            </button>
          ))}

        {isAdmin && (
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: STEEL + "15", color: STEEL }}
            >
              <Edit2 size={16} />
              แก้ไข
            </button>
            <button
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: ROSE + "15", color: ROSE }}
            >
              <Trash2 size={16} />
              ลบประกาศ
            </button>
          </div>
        )}
      </div>
    </BottomSheet>
  );
}
