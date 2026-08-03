import "@/styles/globals.css";
import "@/styles/font.css";
import { cn } from "@/lib/utils";
import { notoSans } from "@/styles/font";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Nurse Balance",
    default: "Nurse Balance",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased", "font-sans", notoSans.variable)}
    >
      <body className="">{children}</body>
    </html>
  );
}
