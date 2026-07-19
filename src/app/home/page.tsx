"use client";

import { signOutThunk } from "@/features/auth/redux/thunks/sign_out";
import CustomButton from "@/shared/components/CustomButton";
import { UserAvatar } from "@/shared/components/UserAvatar";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { auth, status, isLoading, isInitializing, error } = useAppSelector(
    (state) => state.authReducer,
  );

  useEffect(() => {
    if (status === "signOut" && !isLoading && !error) {
      router.push("/auth/sign-in");
      return;
    }

    if (!isInitializing && !auth) {
      router.push("/auth/sign-in");
    }
  }, [auth, status, isLoading, isInitializing, error, router]);

  // Do not render the /home view while the authentication state is initializing
  if (isInitializing) return null;

  // After initialization, validate the authentication state
  if (!auth) return null;

  const handleSignOut = () => {
    dispatch(signOutThunk());
  };
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
          <UserAvatar email={auth.user.email} imgUrl={auth.user.img_url} />

          {/* Email (always, since user always exists) */}
          <span className="text-sm opacity-90">{auth!.user.email}</span>

          <CustomButton
            onClick={() => router.push("/dashboard")}
            text="Go to Dashboard"
          />

          {/* Sign Out (always visible) */}
          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
          >
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
