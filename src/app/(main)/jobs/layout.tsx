import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobs Market",
  description: "ค้นหาและสมัครงานพยาบาลหรือวอร์ดที่เปิดรับสมัครด่วน",
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
