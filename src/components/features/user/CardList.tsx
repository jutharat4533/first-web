import { EGG, P, ROSE, STEEL } from "@/styles/theme";

export default function CardList() {
  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "รพ.ที่ทำงาน", value: {}, color: STEEL },
          { label: "เวรเดือนนี้", value: {}, color: ROSE },
          { label: "เวรทั้งหมด", value: {}, color: P },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-3 text-center shadow-sm"
            style={{ backgroundColor: EGG }}
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>
              {}
            </p>
            <p
              className="text-[10px] mt-0.5 font-medium"
              style={{ color: "#5a7a99" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
