"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeClosed } from "lucide-react";
import { signInSchema } from "@/lib/validation";

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    
    const result = signInSchema.safeParse({ email, password });

    if (!result.success) {
      const error = result.error.flatten().fieldErrors;
      if (error.email) {
        setFormError(error.email[0]);
      } else if (error.password) {
        setFormError(error.password[0]);
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });
      if (result?.error) {
        if (result.error === "Please verify your email before signing in") {
          setFormError("Please verify your email before signing in.");
        } else {
          setFormError("Invalid email or password.");
        }
        return;
      }

      window.location.href = "/";
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = async (provider: "github" | "google") => {
    setFormError("");
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch {
      setFormError("Unable to continue with social sign-in right now.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6fffa] px-4 py-4 sm:py-10">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8 border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
          Welcome back
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-2">
          Sign in to continue to{" "}
          <span className="text-[#0f766e] font-medium">Projectify</span>
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {formError && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {formError}
            </p>
          )}

          <button
            type="button"
            className="self-end text-sm text-[#0f766e] hover:underline"
          >
            Forget your password ?
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-[#0f766e] text-white font-medium hover:bg-[#0d5f5a] transition"
          >
            {isSubmitting ? "Redirecting..." : "Sign in"}
          </button>
        </form>

        <div className="flex items-center gap-2 my-5 sm:my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
            Or Sign Up with
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => handleSocialSignIn("github")}
            aria-label="Sign up with GitHub"
            className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white transition-transform hover:scale-105 hover:bg-gray-50"
          >
            <Image
              src="/github-logo.png"
              alt="GitHub logo"
              width={24}
              height={24}
            />
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            aria-label="Sign up with Google"
            className="inline-flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-gray-200 bg-white transition-transform hover:scale-105 hover:bg-gray-50"
          >
            <Image
              src="/google-logo.png"
              alt="Google logo"
              width={24}
              height={24}
            />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#0f766e] hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
