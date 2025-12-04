"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailThunk } from "@/features/auth/redux/thunks/verify_email";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { Loader2 } from "lucide-react";

function VerifyEmailPage() {
  const { status, isLoading, error, auth } = useAppSelector(
    (state) => state.authReducer
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [digits, setDigits] = useState(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (status === "signIn" && !isLoading && !error) {
      router.push("/home");
    }
  }, [status, isLoading, error, auth, router]);

  function handleChange(value: string, index: number) {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleBackspace(
    ev: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) {
    if (ev.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const otpCode = digits.join("");
    if (otpCode.length !== 6) return;

    dispatch(
      verifyEmailThunk({ otpId: auth!.otp_id, otpCode, userId: auth!.user.id })
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Verify email
        </h1>

        <p className="text-sm text-slate-500 mb-8 text-center">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-black">{auth!.user.email}</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP INPUTS */}
          <div className="flex justify-center gap-4 mb-4">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                inputMode="numeric"
                className="w-12 h-14 text-center text-xl border rounded-lg focus:ring-2 focus:ring-black outline-none"
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyDown={(e) => handleBackspace(e, idx)}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error.message}</p>
          )}

          {/* Verify Button */}
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
              "Verify email"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
