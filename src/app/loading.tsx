import LoadingState from "@/components/shared/LoadingState";

export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50">
      <LoadingState label="กำลังเปิดหน้า..." />
    </main>
  );
}
