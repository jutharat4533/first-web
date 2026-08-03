import MainNavigation from "@/components/layout/MainNavigation";
import { P } from "@/styles/theme";

export default function Footer() {
  return (
    <div
      className="flex  items-center fixed bottom-0 left-0 w-full  py-4 text-white h-15"
      style={{ background: `linear-gradient(160deg, ${P} 0%, #0d3b6e 100%)` }}
    >
      <MainNavigation />
    </div>
  );
}
