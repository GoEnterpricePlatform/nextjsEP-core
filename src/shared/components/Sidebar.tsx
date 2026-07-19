"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { dashboardMenu } from "../config/menu";
import { useAppSelector } from "../redux/hooks";
import { ArrowLeft } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const { auth } = useAppSelector((state) => state.authReducer);

  if (!auth) {
    return null;
  }

  const roles = auth.session.jwtPayload.role ?? [];

  const menuByRole = dashboardMenu.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-gray-200 bg-white px-4 py-6 shadow-sm">
      <h1 className="mb-8 text-center text-xl font-bold text-gray-900">
        Mi Dashboard
      </h1>

      <nav className="flex flex-col gap-2">
        {menuByRole.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-black"
              }`}
            >
              <Icon size={20} strokeWidth={2} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/home"
        className="mt-auto flex items-center gap-3 rounded-md border px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-black"
      >
        <ArrowLeft size={20} strokeWidth={2} />
        <span>Back to Home</span>
      </Link>
    </aside>
  );
}
