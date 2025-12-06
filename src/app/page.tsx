"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import Image from "next/image";
import { useEffect } from "react";

function LandingPage() {
  const { status, isLoading, error, auth } = useAppSelector(
    (state) => state.authReducer
  );

  useEffect(() => {}, [status, isLoading, error, auth]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="w-full bg-black text-white px-6 py-2 flex items-center justify-between shadow-md">
        <div
          className="text-lg font-semibold cursor-pointer"
          onClick={() => (window.location.href = "/")}
        >
          MyApp
        </div>

        {auth?.user ? (
          <div className="flex items-center gap-3">
            {auth.user.img_url && (
              <Image
                src={auth.user.img_url}
                width={32}
                height={32}
                alt="User avatar"
                className="rounded-full border border-white/20 object-cover"
                unoptimized
              />
            )}

            <span className="text-sm opacity-90">{auth.user.email}</span>
          </div>
        ) : (
          // If you are not authenticated
          <button
            onClick={() => (window.location.href = "/auth/sign-in")}
            className="px-4 py-1 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-100 transition"
          >
            Sign in
          </button>
        )}
      </nav>
    </div>
  );
}

export default LandingPage;
