"use client";

import { initializeThunk } from "@/features/auth/redux/thunks/initialize";
import { store } from "@/shared/redux/store";
import { useLayoutEffect } from "react";
import { Provider } from "react-redux";

export function AppProviders({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    store.dispatch(initializeThunk());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
