import React from "react";

export default function DateTag({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  const now = new Date();
  const THAI_MONTHS = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const monthLabel = `${THAI_MONTHS[now.getMonth()]} ${now.getFullYear() + 543}`;

  return (
    <div className="">
      <p className={className} style={style}>
        {monthLabel}
      </p>
    </div>
  );
}
