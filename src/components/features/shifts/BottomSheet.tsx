"use client";

import React from "react";
import { X } from "lucide-react";
import { P } from "@/styles/theme";

interface BottomSheetProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function BottomSheet({
  title,
  onClose,
  children,
}: BottomSheetProps) {
  return (
    <div
      className="px-6 absolute inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-3xl max-h-[80%] flex flex-col shadow-2xl">
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "rgba(3,29,68,0.08)" }}
        >
          <h3 className="text-base font-bold" style={{ color: P }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#f0f4f8" }}
          >
            <X size={16} style={{ color: P }} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">{children}</div>
      </div>
    </div>
  );
}
