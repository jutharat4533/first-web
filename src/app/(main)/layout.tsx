import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ข้อมูลสรุปรายได้",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-120 bg-white shadow-none sm:shadow-xl">
        <Header />
        <div>{children}</div>
        <Footer />
      </div>
    </div>
  );
}
