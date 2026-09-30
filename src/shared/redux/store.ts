import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/redux/slice";
import variationsReducer from "@/features/catalog/variations/redux/slice";

export const store = configureStore({
  reducer: {
    authReducer: authReducer,
    variationsReducer: variationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
