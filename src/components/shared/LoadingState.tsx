import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

export default function LoadingState({
  label = "กำลังโหลดข้อมูล...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex min-h-32 flex-col items-center justify-center gap-2 text-sm text-slate-500 ${className}`}
    >
      <Loader2 className="h-7 w-7 animate-spin text-pink-500" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
