'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Eye, EyeClosed } from 'lucide-react'

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6fffa] px-4 py-4 sm:py-10">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-md p-5 sm:p-8 border border-gray-100">
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-800">
          Welcome back
        </h1>
        <p className="text-center text-sm sm:text-base text-gray-500 mt-2">
          Sign in to continue to <span className="text-[#0f766e] font-medium">Projectify</span>
        </p>

        <form className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <button
            type="button"
            className="self-end text-sm text-[#0f766e] hover:underline"
          >
            Forget your password ?
          </button>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-[#0f766e] text-white font-medium hover:bg-[#0d5f5a] transition"
          >
            Sign in
          </button>
        </form>

        <div className="flex items-center gap-2 my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm text-gray-400">Or Sign In with </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/" })}
            aria-label="Sign in with GitHub"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition-transform hover:scale-105 hover:bg-gray-50"
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
            onClick={() => signIn("google", { callbackUrl: "/" })}
            aria-label="Sign in with Google"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition-transform hover:scale-105 hover:bg-gray-50"
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
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-[#0f766e] hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </main>
  );
}