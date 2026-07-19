import DashboardGuard from "@/shared/components/DashboardGuard";
import Header from "@/shared/components/Header";
import Sidebar from "@/shared/components/Sidebar";
import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </DashboardGuard>
  );
}

export default DashboardLayout;
