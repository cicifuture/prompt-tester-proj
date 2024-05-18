import { BookOpenCheck, LayoutDashboard,Binary } from "lucide-react";

export const NavItems = [
  {
    title: "Prompt Tester",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "Dashboard",
    icon: BookOpenCheck,
    href: "/dashboard",
    color: "text-orange-500"
  },
  {
    title: "Campaign",
    icon: Binary,
    href: "/campaign",
    color: "text-blue-500"
  },
];