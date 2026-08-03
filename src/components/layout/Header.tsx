import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { P } from "@/styles/theme";
import { Bell, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="flex justify-between items-center bg-foreground/5 px-6 py-4 ">
      <div className="flex flex-row gap-2">
        <Image src="/pic.png" alt="Logo" width={40} height={40} />
        <header
          className="font-bold text-lg flex justify-center items-center"
          style={{ color: P }}
        >
          Nurse Balance
        </header>
      </div>
      <div className="flex flex-row gap-4 justify-between items-center">
        <Bell />
        <Avatar className="flex flex-row gap-4 justify-between items-center">
          <User />
          <AvatarImage></AvatarImage>
        </Avatar>
      </div>
    </div>
  );
}
