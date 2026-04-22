'use client'

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams?.get("email") ?? null

  const handleResend = async () => {
    if (!email) return
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    alert("Verification email resent! Check your inbox.")
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6fffa] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-100 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Check your email
        </h1>
        <p className="text-gray-500 mt-3">
          We sent a verification link to{" "}
          {email && (
            <span className="font-medium text-gray-800">{email}</span>
          )}
        </p>
        <p className="text-gray-400 text-sm mt-4">
          Didn't receive it? Check your spam folder or resend below.
        </p>
        <button
          onClick={handleResend}
          className="mt-4 text-sm text-[#0f766e] hover:underline"
        >
          Resend verification email
        </button>
        <div className="mt-6">
          <Link
            href="/signin"
            className="text-sm text-gray-400 hover:underline"
          >
            Back to Sign in
          </Link>
        </div>
      </div>
    </main>
  )
}