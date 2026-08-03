import { cn } from "@/lib/utils";
import { LucideProps } from "lucide-react";
import Link from "next/link";

type NavigationItemProps = {
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  isActive?: boolean;
};

export default function NavigationItem({
  href,
  icon: Icon,
  isActive = false,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "relative w-10 h-12 hover:text-shadow-pink-700 flex items-center justify-center rounded-lg",
        isActive ? "text-pink-400" : "text-white",
      )}
    >
      <Icon className="size-6" />
    </Link>
  );
}
