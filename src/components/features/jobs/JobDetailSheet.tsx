import BottomSheet from "./BottomSheet";
import { Zap, Users, Loader2, Edit2, Trash2 } from "lucide-react";
import { EGG, LIME, P, ROSE, STEEL } from "@/styles/theme";
import { JobStatus } from "@/@types/types";
import { JobResponse } from "@/lib/api/job-types";

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
  job: JobResponse;
  onClose: () => void;
  onApply: () => void;
  applying: boolean;
  deleting?: boolean;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function JobDetailSheet({
  job,
  onClose,
  onApply,
  applying,
  deleting = false,
  isAdmin,
  onEdit,
  onDelete,
}: JobDetailSheetProps) {
  const canApply = job.status === "OPEN" && !applying;

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
            <h2 className="text-lg font-bold leading-tight" style={{ color: P }}>
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
          {job.aboutWord && (
            <p className="text-sm mt-1" style={{ color: STEEL }}>
              {job.aboutWord}
            </p>
          )}
        </div>

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

        {isAdmin ? (
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
              onClick={onDelete}
              disabled={deleting}
              className="flex-1 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: ROSE + "15", color: ROSE, opacity: deleting ? 0.6 : 1 }}
            >
              {deleting ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {deleting ? "กำลังลบ..." : "ลบประกาศ"}
            </button>
          </div>
        ) : (
          <button
            onClick={onApply}
            disabled={!canApply}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
            style={{
              backgroundColor: canApply ? ROSE : "#ccc",
              opacity: canApply ? 1 : 0.8,
            }}
          >
            {job.status === "FULL" ? (
              "เต็มแล้ว"
            ) : job.status === "CLOSED" ? (
              "ปิดรับสมัครแล้ว"
            ) : applying ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                กำลังส่งใบสมัคร...
              </>
            ) : (
              <>
                <Users size={18} />
                สมัครงาน
              </>
            )}
          </button>
        )}
      </div>
    </BottomSheet>
  );
}
