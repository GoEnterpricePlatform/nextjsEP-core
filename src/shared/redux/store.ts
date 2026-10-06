import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/redux/slice";
import variationsReducer from "@/features/catalog/variations/redux/slice";
import paddlePlansReducer from "@/features/catalog/paddle-plans/redux/slice";

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    variationsReducer: variationsReducer,
    paddlePlansReducer: paddlePlansReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
