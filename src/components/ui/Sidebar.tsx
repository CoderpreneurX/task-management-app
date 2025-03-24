"use client";

import Link from "next/link";
import { useState } from "react";
import { HiMenuAlt2, HiOutlineTemplate, HiClipboardList, HiUserCircle } from "react-icons/hi";

interface User {
  email: string;
  fullName: string;
  // isVerified: boolean | true,
  role: string;
}

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isAvatarDropDownOpen, setIsAvatarDropDownOpen] = useState<boolean>(false);

  return (
    <div className="grid h-screen z-10 max-w-max p-4 bg-slate-100">
      <button onClick={() => {setIsCollapsed(!isCollapsed)}}>{<HiMenuAlt2 size={24} />}</button>
      <aside className={`w-full grid gap-4`}>
        <div className="flex gap-4">
          {<HiOutlineTemplate size={24} />}
          {!isCollapsed && <Link href="/">Dashboard</Link>}
        </div>
        <div className="flex gap-4">
          {<HiUserCircle size={24} />}
          {!isCollapsed && <div>
            <p className="text-sm">{user.fullName}</p>
            <p className="text-xs">{user.email}</p>
          </div>}
          <div className="relative top-0 left-0">Logout</div>
        </div>
      </aside>
    </div>
  );
}
