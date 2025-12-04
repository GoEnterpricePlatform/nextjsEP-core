import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Instead of using useDispatch() directly:
export const useAppDispatch: () => AppDispatch = useDispatch;

// Instead of useSelector((state: any) => ...)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
