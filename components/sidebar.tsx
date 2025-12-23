"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { BarChart3, CheckSquare, FileText, LayoutDashboard, Loader, Megaphone } from "lucide-react";

type Props = {
  className?: string;
};

export const Sidebar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex bg-white h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
        <Link href="/learn">
      <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3 max-w-full overflow-hidden">
        <Image src="/SELO/SELO 2.png" height={50} width={50} alt="Logo" />
        <h1 className="text-xl lg:text-lg font-extrabold text-blue-700 tracking-wide wrap-break-word w-full">
          Avaliações
        </h1>
      </div>
      </Link>
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItem label="Painel" href="/dashboard" icon={LayoutDashboard} />
        <SidebarItem label="Provas Disponiveis" href="/available-exams" icon={FileText} />
        <SidebarItem label="Provas Realizadas" href="/completed-exams" icon={CheckSquare} />
        <SidebarItem label="Progresso" href="/progress" icon={BarChart3} />
        <SidebarItem label="Anúncios" href="/announcements" icon={Megaphone} />
      </div>
      <div className="p-4">
        <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>
    </div>
    
  );
};
