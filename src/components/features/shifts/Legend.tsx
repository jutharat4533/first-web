import { ShiftSlot, SLOT_COLOR, SLOT_SHORT } from "@/@types/types";
import { P } from "@/styles/theme";

export default function Legend() {
  return (
    <div className="h-full px-6 w-full max-w-xl mx-auto mt-3 flex items-center gap-3">
      {(["MORNING", "EVENING", "NIGHT", "DAY", "SHIFT"] as ShiftSlot[]).map(
        (slot) => (
          <div key={slot} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full border"
              style={{
                backgroundColor: SLOT_COLOR[slot].bg,
                borderColor: "rgba(3,29,68,0.15)",
              }}
            />
            <span
              className="text-[10px] font-semibold"
              style={{ color: P + "80" }}
            >
              {SLOT_SHORT[slot]}
            </span>
          </div>
        ),
      )}
    </div>
  );
}
