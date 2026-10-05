import { LIME, P } from "@/styles/theme";
import Image from "next/image";

export default function HeaderAuth() {
  return (
    <div
      className="flex flex-col justify-center items-center
      text-white p-6 "
      style={{ background: `linear-gradient(160deg, ${P} 0%, #0d3b6e 100%)` }}
    >
      <Image
        src="/pic.png"
        alt="logo"
        width={70}
        height={70}
        className="mb-2"
      />
      <h1 className="text-2xl font-bold mb-1" style={{ color: LIME }}>
        Nurse Balance
      </h1>
      <p className="text-sm text-gray-300">
        Nurse Schedule & Financial Management
      </p>
    </div>
  );
}
