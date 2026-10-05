import HeaderAuth from "@/components/layout/HeaderAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto min-h-screen w-full max-w-120 bg-white sm:shadow-xl">
        <HeaderAuth />
        <div>{children}</div>
      </div>
    </div>
  );
}
