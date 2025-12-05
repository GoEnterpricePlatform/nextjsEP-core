"use client";

import { useAppSelector } from "@/shared/redux/hooks";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { auth, status } = useAppSelector((state) => state.authReducer);

  useEffect(() => {
    if (!auth || !auth.user || status != "signIn") {
      router.push("/auth/sign-in");
    }
  }, [auth, status, router]);

  if (!auth || !auth.user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="w-full bg-black text-white px-6 py-2 flex items-center justify-between shadow-md">
        <div
          className="text-lg font-semibold cursor-pointer"
          onClick={() => router.push("/")}
        >
          MyApp
        </div>

        <div className="flex items-center gap-4">
          {/* Avatar (only if img_url exists) */}
          {auth!.user.img_url && (
            <Image
              src={auth!.user.img_url}
              width={32}
              height={32}
              alt="User avatar"
              className="rounded-full border border-white/20 object-cover"
              unoptimized
            />
          )}

          {/* Email (always, since user always exists) */}
          <span className="text-sm opacity-90">{auth!.user.email}</span>

          {/* Sign Out (always visible) */}
          <button className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
            Sign out
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex flex-1 items-center justify-center p-6">
        <h1 className="text-3xl font-semibold text-gray-800">Welcome!</h1>
      </main>
    </div>
  );
}
