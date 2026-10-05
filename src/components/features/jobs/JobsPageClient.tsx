"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  ChevronRight,
  Edit2,
  MapPin,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import { JobStatus } from "@/@types/types";
import { CreateJobDto, JobResponse } from "@/lib/api/job-types";
import {
  applyJobAction,
  createJobAction,
  removeJobAction,
  updateJobAction,
} from "@/lib/actions/jobs/job.action";
import JobDetailSheet, {
  STATUS_COLOR,
  STATUS_LABEL,
} from "@/components/features/jobs/JobDetailSheet";
import JobFormSheet from "@/components/features/jobs/JobFormSheet";
import BottomSheet from "@/components/features/jobs/BottomSheet";
import { EGG, P, ROSE, STEEL } from "@/styles/theme";

interface JobsPageClientProps {
  jobs: JobResponse[];
  isAdmin: boolean;
}

export default function JobsPageClient({ jobs, isAdmin }: JobsPageClientProps) {
  const [query, setQuery] = useState("");
  const [filterHighlighted, setFilterHighlighted] = useState(false);
  const [filterStatus, setFilterStatus] = useState<JobStatus | "ALL">("ALL");
  const [detailJob, setDetailJob] = useState<JobResponse | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editJob, setEditJob] = useState<JobResponse | null>(null);
  const [applyingId, setApplyingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const filtered = useMemo(
    () =>
      jobs.filter((j) => {
        const q = query.toLowerCase();
        const matchQ =
          !q ||
          j.location.toLowerCase().includes(q) ||
          j.aboutWord?.toLowerCase().includes(q);
        const matchH = !filterHighlighted || j.isHighlighted;
        const matchS = filterStatus === "ALL" || j.status === filterStatus;
        return matchQ && matchH && matchS;
      }),
    [jobs, query, filterHighlighted, filterStatus],
  );

  const handleApply = (job: JobResponse) => {
    setApplyingId(job.id);
    startTransition(async () => {
      const result = await applyJobAction(String(job.id));
      if (result.success) {
        toast.success("สมัครงานสำเร็จ");
        setDetailJob(null);
      } else {
        toast.error(result.message);
      }
      setApplyingId(null);
    });
  };

  const handleCreate = async (dto: CreateJobDto) => {
    const result = await createJobAction(dto);
    if (result.success) {
      toast.success("ลงประกาศงานสำเร็จ");
      setShowAddForm(false);
    } else {
      toast.error(result.message);
    }
  };

  const handleUpdate = async (dto: CreateJobDto) => {
    if (!editJob) return;
    const result = await updateJobAction(editJob.id, dto);
    if (result.success) {
      toast.success("บันทึกการแก้ไขสำเร็จ");
      setEditJob(null);
      setDetailJob(null);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = (job: JobResponse) => {
    if (!confirm(`ลบประกาศงาน "${job.title}"?`)) return;
    startTransition(async () => {
      const result = await removeJobAction(job.id);
      if (result.success) {
        toast.success("ลบประกาศงานสำเร็จ");
        setDetailJob(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 shrink-0" style={{ backgroundColor: P }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold text-white">ตลาดงาน</h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              {jobs.filter((j) => j.status === "OPEN").length} ตำแหน่งเปิดรับอยู่
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-semibold text-xs"
              style={{ backgroundColor: ROSE, color: "white" }}
            >
              <Plus size={14} />
              ลงประกาศ
            </button>
          )}
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Search size={16} color="rgba(255,255,255,0.6)" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหา รพ. หรือวอร์ด..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/50"
          />
          {query && (
            <button onClick={() => setQuery("")}>
              <X size={14} color="rgba(255,255,255,0.6)" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        className="px-4 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0 border-b"
        style={{ borderColor: "rgba(3,29,68,0.08)", backgroundColor: "white" }}
      >
        {(["ALL", "OPEN", "FULL", "CLOSED"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className="shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
            style={{
              borderColor: filterStatus === s ? P : "rgba(3,29,68,0.12)",
              backgroundColor: filterStatus === s ? P : "#f8fafc",
              color: filterStatus === s ? "white" : P,
            }}
          >
            {s === "ALL" ? "ทั้งหมด" : STATUS_LABEL[s]}
          </button>
        ))}
        <button
          onClick={() => setFilterHighlighted(!filterHighlighted)}
          className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
          style={{
            borderColor: filterHighlighted ? ROSE : "rgba(3,29,68,0.12)",
            backgroundColor: filterHighlighted ? ROSE + "10" : "#f8fafc",
            color: filterHighlighted ? ROSE : P,
          }}
        >
          <Zap size={12} />
          ด่วน
        </button>
      </div>

      {/* Job list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-6">
        {filtered.length === 0 && (
          <div className="rounded-2xl px-4 py-8 text-center" style={{ backgroundColor: EGG }}>
            <AlertCircle size={32} style={{ color: "#5a7a99", margin: "0 auto 8px" }} />
            <p className="text-sm font-semibold" style={{ color: P }}>
              ไม่พบประกาศงาน
            </p>
            <p className="text-xs mt-1" style={{ color: "#5a7a99" }}>
              ลองเปลี่ยนคำค้นหาหรือตัวกรอง
            </p>
          </div>
        )}
        {filtered.map((job) => {
          const { bg, text } = STATUS_COLOR[job.status];
          return (
            <div
              key={job.id}
              className="rounded-2xl shadow-sm overflow-hidden"
              style={{ backgroundColor: EGG }}
            >
              {job.isHighlighted && (
                <div
                  className="px-4 py-1.5 flex items-center gap-1.5"
                  style={{ background: `linear-gradient(90deg, ${ROSE}22 0%, transparent 100%)` }}
                >
                  <Zap size={11} style={{ color: ROSE }} />
                  <span className="text-[10px] font-bold" style={{ color: ROSE }}>
                    ด่วน
                  </span>
                </div>
              )}
              <div className="px-4 pb-4 pt-2">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <MapPin size={12} style={{ color: STEEL }} />
                      <p className="text-sm font-bold truncate" style={{ color: P }}>
                        {job.location}
                      </p>
                    </div>
                    {job.aboutWord && (
                      <div className="flex items-center gap-1.5">
                        <Stethoscope size={12} style={{ color: "#5a7a99" }} />
                        <p className="text-xs truncate" style={{ color: "#5a7a99" }}>
                          {job.aboutWord}
                        </p>
                      </div>
                    )}
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                    style={{ backgroundColor: bg, color: text }}
                  >
                    {STATUS_LABEL[job.status]}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-bold" style={{ color: ROSE }}>
                      ฿{job.compensation.toLocaleString("th-TH")}
                    </p>
                    <p className="text-[10px]" style={{ color: "#5a7a99" }}>
                      ต่อเวร
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => setEditJob(job)}
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: STEEL + "15", color: STEEL }}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(job)}
                          className="p-2 rounded-xl"
                          style={{ backgroundColor: ROSE + "15", color: ROSE }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setDetailJob(job)}
                      className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold"
                      style={{ backgroundColor: STEEL + "15", color: STEEL }}
                    >
                      <ChevronRight size={13} />
                      ดูรายละเอียด
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {detailJob && (
        <JobDetailSheet
          job={detailJob}
          onClose={() => setDetailJob(null)}
          onApply={() => handleApply(detailJob)}
          applying={isPending && applyingId === detailJob.id}
          isAdmin={isAdmin}
          onEdit={() => {
            setEditJob(detailJob);
            setDetailJob(null);
          }}
          onDelete={() => handleDelete(detailJob)}
        />
      )}

      {showAddForm && (
        <BottomSheet title="ลงประกาศงานใหม่" onClose={() => setShowAddForm(false)}>
          <JobFormSheet onSave={handleCreate} onClose={() => setShowAddForm(false)} />
        </BottomSheet>
      )}

      {editJob && (
        <BottomSheet title="แก้ไขประกาศงาน" onClose={() => setEditJob(null)}>
          <JobFormSheet
            initial={editJob}
            onSave={handleUpdate}
            onClose={() => setEditJob(null)}
          />
        </BottomSheet>
      )}
    </div>
  );
}
