"use client";

import { ShieldX } from "lucide-react";
import Link from "next/link";

function AccessDeniedPage() {

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-md">
        <div className="mb-4 flex justify-center">
          <ShieldX className="h-12 w-12 text-slate-500" />
        </div>
        <h1 className="mb-2 text-2xl font-semibold">Access denied</h1>
        <p className="mb-6 text-sm text-slate-500">
          Your account does not have access to this section.
        </p>
        <Link
          href="/home"
          className="block w-full rounded-md bg-black py-2 font-semibold text-white hover:bg-gray-900"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default AccessDeniedPage;
