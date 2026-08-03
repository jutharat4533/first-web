import HeaderAuth from "@/components/layout/HeaderAuth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="">
      <HeaderAuth />
      <div>{children}</div>
    </div>
  );
}
