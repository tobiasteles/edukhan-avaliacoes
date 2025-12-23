"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

type Props = {
  label: string;
  icon: LucideIcon;
  href: string;
};

export const SidebarItem = ({
  label,
  icon: Icon,
  href,
}: Props) => {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Button
      variant={active ? "sidebarOutline" : "sidebar"}
      className="justify-start h-13 gap-x-3"
      asChild
    >
      <Link href={href}>
        <Icon className="h-6 w-6" />
        {label}
      </Link>
    </Button>
  );
};
