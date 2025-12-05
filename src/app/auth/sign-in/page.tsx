"use client"
import { useEffect, useState } from "react";
import { signInThunk } from "@/features/auth/redux/thunks/sign_in";
import { useAppDispatch, useAppSelector } from "@/shared/redux/hooks";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

function SignInPage() {
  const { status, isLoading, error, auth } = useAppSelector(
    (state) => state.authReducer
  );
  const dispatch = useAppDispatch();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (status == "signIn" && !isLoading && !error) {
      router.push("/home");
    } else if (status == "needsVerification" && !isLoading && !error) {
      router.push("/auth/verify-email");
    }
    
  }, [status, isLoading, error, auth, router]);

  async function handleSignIn(ev: React.FormEvent) {
    ev.preventDefault();
    dispatch(signInThunk({ email, password }));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-2 text-center ">Sign in</h1>
        <p className="text-sm text-muted-foreground mb-6 text-center text-slate-500">
          Access your account using email and password.
        </p>
        <form onSubmit={handleSignIn} className="space-y-4">
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

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-lg border px-3 py-2 pr-20 focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-600"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={2} />
                ) : (
                  <Eye size={18} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>
          {error && (
            <div className="mb-3 text-sm text-red-600">{error.message}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-semibold flex justify-center items-center ${
              isLoading
                ? "bg-gray-300"
                : "bg-black hover:bg-gray-900 text-white"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-6 w-6 animate-spin text-black" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-slate-500">
          {"Don't have an account?"}{" "}
          <a href="/auth/sign-up" className="text-sky-600 hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
