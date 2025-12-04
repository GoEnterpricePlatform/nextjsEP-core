import { createAsyncThunk } from "@reduxjs/toolkit";
import { signUp } from "../../api/sign_up";
import { Auth } from "../../domain/domain";
import { uploadImage } from "@/features/user/api/upload_image";

interface SignUpParams {
  email: string;
  password: string;
  confirmPassword: string;
  profilePic?: File | null;
}

export const signUpThunk = createAsyncThunk<Auth, SignUpParams>(
  "auth/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      // Create the user
      const resp = await signUp(
        payload.email,
        payload.password,
        payload.confirmPassword
      );

      const userId = resp.user.id;

      // Upload avatar if it exists
      if (payload.profilePic && userId) {
        await uploadImage(userId, payload.profilePic);
      }

      return resp;
    } catch (err) {
      if (err instanceof Error) {
        return rejectWithValue({ message: err.message });
      }
      return rejectWithValue({ message: "Unexpected error occurred" });
    }
  }
);
