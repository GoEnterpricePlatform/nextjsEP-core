"use client";

import { signUpThunk } from "@/features/auth/redux/thunks/sign_up";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { Eye, EyeOff, Loader2, Camera } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function SignUpPage() {
  const { status, isLoading, error } = useAppSelector(
    (state) => state.authReducer
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPass, setConfirmPass] = useState("");
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (status === "needsVerification" && !isLoading && !error) {
      router.push("/auth/verify-email");
    }
  }, [status, isLoading, error, router]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    dispatch(
      signUpThunk({
        email,
        password,
        confirmPassword: confirmPass,
        profilePic,
      })
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold mb-2 text-center">Register</h1>
        <p className="text-sm text-slate-500 mb-6 text-center">
          Create a new account to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/*  Avatar selector */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative">
              {/* Avatar */}
              <div className="h-22 w-22 rounded-full overflow-hidden bg-gray-200 border shadow-sm flex items-center justify-center">
                {preview && (
                  <Image
                    src={preview}
                    alt="Preview"
                    width={88}
                    height={88}
                    unoptimized
                    className="object-cover h-full w-full"
                  />
                )}
              </div>

              {/* Camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-700 transition"
              >
                <Camera size={16} />
              </button>

              {/* input hidden */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password:</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-2 pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-2 pr-12 focus:ring-2 focus:ring-gray-500 focus:outline-none"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error.message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-semibold flex justify-center items-center ${
              isLoading
                ? "bg-gray-300 text-black"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Do you already have an account?{" "}
          <a href="/auth/sign-in" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
