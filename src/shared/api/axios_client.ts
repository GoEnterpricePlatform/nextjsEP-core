import axios from "axios";
import { store } from "../redux/store";
import { setNewSession } from "@/features/auth/redux/slice";
import { signOutThunk } from "@/features/auth/redux/thunks/sign_out";
import { refreshToken } from "@/features/auth/api/refresh_token";
import { decodeAccessToken } from "@/features/auth/utils/decode_access_token";

// A reference to the store
let storeRef: typeof store | null = null;

export const setStore = (storeInstance: typeof store) => {
  storeRef = storeInstance;
};

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(
  (request) => {
    if (storeRef) {
      const state = storeRef.getState();
      const token = state.authReducer?.auth?.session?.access_token;

      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
    }
    return request;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // If there is no storeRef yet, we return an error.
    if (!storeRef) {
      return Promise.reject(error);
    }

    // We do not process if the request has already been retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      originalRequest._retry = true;
      try {
        const resp = await refreshToken();
        const newSession = resp.session;
        newSession.jwtPayload = decodeAccessToken(newSession.access_token);

        if (newSession) {
          // Store new token in Redux and retry failed request
          storeRef.dispatch(setNewSession(newSession));
          originalRequest.headers.Authorization = `Bearer ${newSession.access_token}`;
          return api(originalRequest);
        }

        // Refresh failed → Log out
        await storeRef.dispatch(signOutThunk());
        return Promise.reject(error);
      } catch (refreshError) {
        // Logout or redirect if refresh fails
        await storeRef.dispatch(signOutThunk());
        return Promise.reject(refreshError);
      }
    }
    //If it is another type of error, we propagate it
    return Promise.reject(error);
  },
);
