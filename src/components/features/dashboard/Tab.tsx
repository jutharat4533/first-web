"use client";

import { ROSE } from "@/styles/theme";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";

export default function Tab() {
  const [tab, setTab] = useState<"income" | "deduct">("income");

  return (
    <div
      className="flex border-b shrink-0"
      style={{ backgroundColor: "white", borderColor: "rgba(3,29,68,0.1)" }}
    >
      {[
        { id: "income", label: "รายได้", icon: <TrendingUp size={14} /> },
        { id: "deduct", label: "รายการหัก", icon: <TrendingDown size={14} /> },
      ].map((t) => (
        <button
          key={t.id}
          onClick={() => setTab(t.id as "income" | "deduct")}
          className="flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors"
          style={{
            borderBottomColor: tab === t.id ? ROSE : "transparent",
            color: tab === t.id ? ROSE : "#5a7a99",
          }}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
