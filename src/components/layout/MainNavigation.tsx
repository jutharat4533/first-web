"use client";

import NavigationItem from "@/components/layout/NavigationItem";
import { Badge, Calendar, Home, User } from "lucide-react";
import { usePathname } from "next/navigation";

const NAVIGATION_ITEMS = [
  { icon: Home, href: "/" },
  { icon: Calendar, href: "/shifts" },
  { icon: Badge, href: "/jobs" },
  { icon: User, href: "/user" },
] as const;

export default function MainNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-row justify-between items-center w-full gap-2 px-12 text-white">
      {NAVIGATION_ITEMS.map((item) => (
        <NavigationItem
          key={item.href}
          href={item.href}
          icon={item.icon}
          isActive={
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)
          }
        />
      ))}
    </nav>
  );
}
