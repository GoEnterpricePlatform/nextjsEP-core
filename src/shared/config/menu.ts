import { RoleStr } from "@/features/auth/domain/types";
import {
  Home,
  BarChart3,
  UserLock,
  LucideIcon,
  Box,
  CircleDollarSign,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  roles: RoleStr[];
}

// ROLE_SYSTEM_ADMIN: the user genereted for de backend
// MANAGER, EMPLOYEE: for example if you create a new role
// in the backend, you can mention it here
export const dashboardMenu: MenuItem[] = [
  {
    title: "General",
    href: "/dashboard",
    icon: Home,
    roles: ["ROLE_SYSTEM_ADMIN", "MANAGER", "EMPLOYEE"],
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
    roles: ["ROLE_SYSTEM_ADMIN", "MANAGER"],
  },
  {
    title: "Catalog",
    href: "/dashboard/catalog",
    icon: Box,
    roles: ["ROLE_SYSTEM_ADMIN", "EMPLOYEE"],
  },
  {
    title: "Catalog - Paddle",
    href: "/dashboard/paddle",
    icon: CircleDollarSign,
    roles: ["ROLE_SYSTEM_ADMIN", "EMPLOYEE"],
  },
  {
    title: "Roles and Permissions",
    href: "/dashboard/roles-and-permissions",
    icon: UserLock,
    roles: ["ROLE_SYSTEM_ADMIN"],
  },
];
