"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { dashboardMenu } from "@/shared/config/menu";
import { useAppSelector } from "@/shared/redux/hooks";

interface DashboardGuardProps {
  children: React.ReactNode;
}

export default function DashboardGuard({ children }: DashboardGuardProps) {
  const router = useRouter();

  const { auth, isInitializing } = useAppSelector((state) => state.authReducer);

  const roles = auth?.session.jwtPayload.role ?? [];

  // Use this constant if you want to test that it
  // loads dashboard sections according to the role;
  // you also have to do it from Sidebar
  //const roles = ["MANAGER"];

  const allowedRoutes = dashboardMenu.filter((item) =>
    item.roles.some((role) => roles.includes(role)),
  );

  const hasAccess = allowedRoutes.length > 0;

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!auth) {
      router.replace("/auth/sign-in");
      return;
    }

    if (!hasAccess) {
      router.replace("/access-denied");
    }
  }, [auth, isInitializing, hasAccess, router]);

  // While initializing
  if (isInitializing) {
    return null;
  }

  // Do not display dashboard while redirecting
  if (!auth || !hasAccess) {
    return null;
  }

  return children;
}
