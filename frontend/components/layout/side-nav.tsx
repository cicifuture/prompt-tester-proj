"use client";
import Link from "next/link";
import { type NavItem } from "../../types";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { useSidebar } from "../hooks/useSidebar";
import { buttonVariants } from "../ui/button";
import { useEffect, useState } from "react";

interface SideNavProps {
  items: NavItem[];
  setOpen?: (open: boolean) => void;
  className?: string;
}

export function SideNav({ items, setOpen, className }: SideNavProps) {
  const path = usePathname();
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);

  return (
    <nav className="space-y-2">
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          onClick={() => {
            if (setOpen) setOpen(false);
          }}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "group relative flex h-12 justify-start",
            path === item.href && "bg-muted font-bold hover:bg-muted"
          )}
        >
          <item.icon className={cn("h-5 w-5", item.color)} />
          <span
            className={cn(
              "absolute left-12 text-base duration-200",
              !isOpen && className
            )}
          >
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  );
}
