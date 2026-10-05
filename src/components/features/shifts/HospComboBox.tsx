"use client";

import { P, ROSE, STEEL } from "@/styles/theme";
import React, { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { Hospital, SHIFT_TYPE_LABEL } from "@/@types/types";

interface HospComboBoxProps {
  value: Hospital | null;
  onChange: (h: Hospital | null) => void;
  hospitals: Hospital[];
  onCreateNew: (name: string) => void;
}

export default function HospComboBox({
  value,
  onChange,
  hospitals,
  onCreateNew,
}: HospComboBoxProps) {
  const [query, setQuery] = useState(value?.name ?? "");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = hospitals.filter(
    (h) => !query || h.name.toLowerCase().includes(query.toLowerCase()),
  );
  const canCreate =
    query.trim() && !hospitals.find((h) => h.name === query.trim());

  return (
    <div className="relative" ref={ref}>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(null);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="พิมพ์ชื่อ รพ. หรือเลือกจากรายการ..."
        className="w-full px-4 py-3 rounded-2xl text-sm outline-none border-2 transition-colors"
        style={{
          borderColor: open ? STEEL : "rgba(3,29,68,0.12)",
          backgroundColor: "#f8fafc",
          color: P,
        }}
      />
      {open && (filtered.length > 0 || canCreate) && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-xl border z-10 overflow-hidden"
          style={{ borderColor: "rgba(3,29,68,0.12)" }}
        >
          {filtered.map((h) => (
            <button
              key={h.id}
              onClick={() => {
                onChange(h);
                setQuery(h.name);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between border-b last:border-b-0"
              style={{ borderColor: "rgba(3,29,68,0.06)", color: P }}
            >
              <span className="font-medium">{h.name}</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: STEEL + "15", color: STEEL }}
              >
                {SHIFT_TYPE_LABEL[h.shiftCategory]}
              </span>
            </button>
          ))}
          {canCreate && (
            <button
              onClick={() => {
                onCreateNew(query.trim());
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 font-semibold"
              style={{ color: ROSE, backgroundColor: ROSE + "08" }}
            >
              <Plus size={14} />
              เพิ่ม `{query.trim()}` เป็น รพ.ใหม่
            </button>
          )}
        </div>
      )}
    </div>
  );
}
