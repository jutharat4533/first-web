"use client"; // 👈 เพิ่มบรรทัดนี้ที่ด้านบนสุด

import { P, ROSE } from "@/styles/theme";
import React, { useState } from "react";
import { JobPost, JobStatus } from "@/@types/types";
import { STATUS_LABEL, STATUS_COLOR } from "./JobDetailSheet";
import { Zap, Check } from "lucide-react";

interface JobFormSheetProps {
  initial?: JobPost;
  onSave: (j: Omit<JobPost, "id" | "createdAt" | "applicants">) => void;
  onClose: () => void;
}

export default function JobFormSheet({
  initial,
  onSave,
  onClose,
}: JobFormSheetProps) {
  const [location, setLocation] = useState(initial?.location ?? "");
  const [ward, setWard] = useState(initial?.aboutWard ?? "");
  const [desc, setDesc] = useState(initial?.description ?? "");
  const [req, setReq] = useState(initial?.requirements ?? "");
  const [comp, setComp] = useState(String(initial?.compensation ?? ""));
  const [max, setMax] = useState(String(initial?.maxApplicants ?? "3"));
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? "OPEN");
  const [highlighted, setHighlighted] = useState(
    initial?.isHighlighted ?? false,
  );

  const handleSave = () => {
    if (!location.trim() || !ward.trim() || !comp) return;
    onSave({
      location: location.trim(),
      aboutWard: ward.trim(),
      description: desc.trim(),
      requirements: req.trim(),
      compensation: Number(comp),
      maxApplicants: Number(max),
      status,
      isHighlighted: highlighted,
    });
    onClose();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors";
  const inputStyle = {
    borderColor: "rgba(3,29,68,0.12)",
    backgroundColor: "#f8fafc",
    color: P,
  };

  return (
    <>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          สถานพยาบาล (location)
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
          วอร์ด / แผนก (aboutWard)
        </label>
        <input
          value={ward}
          onChange={(e) => setWard(e.target.value)}
          placeholder="ICU อายุรกรรม"
          className={inputClass}
          style={inputStyle}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            ค่าตอบแทน (฿/เวร)
          </label>
          <div
            className="flex items-center gap-2 px-3 py-3 rounded-2xl border-2"
            style={{
              borderColor: "rgba(3,29,68,0.12)",
              backgroundColor: "#f8fafc",
            }}
          >
            <span className="font-bold" style={{ color: P }}>
              ฿
            </span>
            <input
              type="number"
              value={comp}
              onChange={(e) => setComp(e.target.value)}
              placeholder="1500"
              className="flex-1 text-sm font-semibold bg-transparent outline-none"
              style={{ color: P }}
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
            รับสูงสุด (คน)
          </label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="3"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          รายละเอียดงาน
        </label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="รายละเอียดงาน..."
          rows={3}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>
      <div className="space-y-1">
        <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
          คุณสมบัติที่ต้องการ
        </label>
        <textarea
          value={req}
          onChange={(e) => setReq(e.target.value)}
          placeholder="คุณสมบัติ..."
          rows={2}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
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
        onClick={() => setHighlighted(!highlighted)}
        className="w-full py-3 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border-2 transition-all"
        style={{
          borderColor: highlighted ? ROSE : "rgba(3,29,68,0.12)",
          backgroundColor: highlighted ? ROSE + "10" : "#f8fafc",
          color: highlighted ? ROSE : P,
        }}
      >
        <Zap size={16} />
        {highlighted ? "ด่วน! (กดเพื่อยกเลิก)" : "ทำเครื่องหมายว่าด่วน"}
      </button>
      <button
        onClick={handleSave}
        className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
        style={{ backgroundColor: ROSE, boxShadow: `0 4px 16px ${ROSE}44` }}
      >
        <Check size={18} />
        {initial ? "บันทึกการแก้ไข" : "ลงประกาศงาน"}
      </button>
    </>
  );
}
