"use client";

import { initializeThunk } from "@/features/auth/redux/thunks/initialize";
import { setStore } from "@/shared/api/axios_client";
import { store } from "@/shared/redux/store";
import { useLayoutEffect } from "react";
import { Provider } from "react-redux";

setStore(store);

export function AppProviders({ children }: { children: React.ReactNode }) {
  useLayoutEffect(() => {
    store.dispatch(initializeThunk());
  }, []);
  return <Provider store={store}>{children}</Provider>;
}
