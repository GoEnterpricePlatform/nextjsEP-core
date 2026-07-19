"use client";

import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { UserAvatar } from "./UserAvatar";
import CustomButton from "./CustomButton";
import { signOutThunk } from "@/features/auth/redux/thunks/sign_out";

export default function Header() {
  const { auth } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();

  if (!auth) {
    return null;
  }

  const { user } = auth;

  const handleSignOut = () => {
    dispatch(signOutThunk());
  };

  return (
    <header className="flex h-16 items-center justify-end border-b border-gray-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <UserAvatar email={auth.user.email} imgUrl={auth.user.img_url} />

        <span className="text-sm font-medium text-gray-700">{user.email}</span>

        <CustomButton text="Sign out" variant="dark" onClick={handleSignOut} />
      </div>
    </header>
  );
}
