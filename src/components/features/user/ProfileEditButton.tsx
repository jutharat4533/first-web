"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Check, Loader2 } from "lucide-react";
import { P, ROSE } from "@/styles/theme";
import { updateProfileAction } from "@/lib/actions/user/user.action";
import { validateRequired } from "@/lib/validate-required";
import BottomSheet from "@/components/shared/BottomSheet";

interface ProfileEditButtonProps {
  initial: { firstName: string; lastName: string };
}

export default function ProfileEditButton({ initial }: ProfileEditButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const error = validateRequired({
      ชื่อ: firstName.trim().length > 0,
      นามสกุล: lastName.trim().length > 0,
    });
    if (error) {
      toast.error(error);
      return;
    }
    setIsSaving(true);
    try {
      const result = await updateProfileAction({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success("บันทึกข้อมูลสำเร็จ");
      setOpen(false);
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
      >
        <Edit2 size={15} color="white" />
      </button>

      {open && (
        <BottomSheet title="แก้ไขข้อมูลส่วนตัว" onClose={() => setOpen(false)}>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
              ชื่อ
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{ borderColor: "rgba(3,29,68,0.12)", backgroundColor: "#f8fafc", color: P }}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold" style={{ color: "#5a7a99" }}>
              นามสกุล
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2"
              style={{ borderColor: "rgba(3,29,68,0.12)", backgroundColor: "#f8fafc", color: P }}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-opacity"
            style={{ backgroundColor: ROSE, opacity: isSaving ? 0.6 : 1 }}
          >
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
            {isSaving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </BottomSheet>
      )}
    </>
  );
}
