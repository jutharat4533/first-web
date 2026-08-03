import { ShiftPlannerMain } from "@/components/features/shifts/ShiftPlannerMain";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shifts",
  description: "จัดการตารางเวร",
};

export default function ShiftsPage() {
  return (
    <main className="flex flex-col h-full w-full bg-slate-50 overflow-hidden pb-30">
      <ShiftPlannerMain />
    </main>
  );
}
