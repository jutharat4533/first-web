"use client";

import { useState } from "react";
import { Check, Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { P, ROSE } from "@/styles/theme";
import { JobStatus } from "@/@types/types";
import { CreateJobDto, JobResponse } from "@/lib/api/job-types";
import { validateRequired } from "@/lib/validate-required";
import { STATUS_COLOR, STATUS_LABEL } from "./JobDetailSheet";

interface JobFormSheetProps {
  initial?: JobResponse;
  onSave: (dto: CreateJobDto) => Promise<void>;
  onClose: () => void;
}

export default function JobFormSheet({ initial, onSave, onClose }: JobFormSheetProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [aboutWord, setAboutWord] = useState(initial?.aboutWord ?? "");
  const [compensation, setCompensation] = useState(
    String(initial?.compensation ?? ""),
  );
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? "OPEN");
  const [isHighlighted, setIsHighlighted] = useState(
    initial?.isHighlighted ?? false,
  );
  const [isSaving, setIsSaving] = useState(false);

  const inputClass =
    "w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors";
  const inputStyle = {
    borderColor: "rgba(3,29,68,0.12)",
    backgroundColor: "#f8fafc",
    color: P,
  };

  const handleSave = async () => {
    const error = validateRequired({
      ตำแหน่งงาน: title.trim().length > 0,
      สถานที่: location.trim().length > 0,
      ค่าตอบแทน: compensation.trim().length > 0,
    });
    if (error) {
      toast.error(error);
      return;
    }

    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        location: location.trim(),
        aboutWord: aboutWord.trim() || undefined,
        compensation: Number(compensation),
        status,
        isHighlighted,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          ตำแหน่งงาน
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="พยาบาลวิชาชีพ ICU"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          สถานพยาบาล / สถานที่
        </label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="รพ.สมิติเวช สุขุมวิท"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          รายละเอียดเพิ่มเติม
        </label>
        <textarea
          value={aboutWord}
          onChange={(e) => setAboutWord(e.target.value)}
          placeholder="รายละเอียดงาน / วอร์ด / คุณสมบัติ..."
          rows={3}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          ค่าตอบแทน (฿/เวร)
        </label>
        <div
          className="flex items-center gap-2 px-3 py-3 rounded-2xl border-2"
          style={{ borderColor: "rgba(3,29,68,0.12)", backgroundColor: "#f8fafc" }}
        >
          <span className="font-bold" style={{ color: P }}>
            ฿
          </span>
          <input
            type="number"
            value={compensation}
            onChange={(e) => setCompensation(e.target.value)}
            placeholder="1500"
            className="flex-1 text-sm font-semibold bg-transparent outline-none"
            style={{ color: P }}
          />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          สถานะ
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["OPEN", "FULL", "CLOSED"] as JobStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className="py-2 rounded-xl text-xs font-bold border-2 transition-all"
              style={{
                borderColor: status === s ? P : "rgba(3,29,68,0.12)",
                backgroundColor: status === s ? STATUS_COLOR[s].bg : "#f8fafc",
                color: status === s ? STATUS_COLOR[s].text : P,
              }}
            >
              {STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
      <button
        onClick={() => setIsHighlighted(!isHighlighted)}
        className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all"
        style={{
          borderColor: isHighlighted ? ROSE : "rgba(3,29,68,0.12)",
          backgroundColor: isHighlighted ? ROSE + "10" : "#f8fafc",
          color: isHighlighted ? ROSE : P,
        }}
      >
        <Zap size={16} />
        {isHighlighted ? "ด่วน! (กดเพื่อยกเลิก)" : "ทำเครื่องหมายว่าด่วน"}
      </button>
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{ backgroundColor: ROSE, boxShadow: `0 4px 16px ${ROSE}44`, opacity: isSaving ? 0.6 : 1 }}
      >
        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
        {isSaving ? "กำลังบันทึก..." : initial ? "บันทึกการแก้ไข" : "ลงประกาศงาน"}
      </button>
    </div>
  );
}
