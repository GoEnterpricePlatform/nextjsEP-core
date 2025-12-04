"use client";

import { store } from "@/shared/redux/store";
import { Provider } from "react-redux";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
