'use client'

import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ConfirmPage() {
  const searchParams = useSearchParams()
  const success = searchParams?.get("success")
  const error = searchParams?.get("error")

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6fffa] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 border border-gray-100 text-center">
        {success ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-800">
              Email verified!
            </h1>
            <p className="text-gray-500 mt-3">
              Your account is now active. You can sign in.
            </p>
            <Link
              href="/signin"
              className="mt-6 inline-block px-6 py-3 bg-[#0f766e] text-white rounded-lg font-medium hover:bg-[#0d5f5a] transition"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
        
            <h1 className="text-2xl font-semibold text-gray-800">
              Verification failed !
            </h1>
            <p className="text-gray-500 mt-3">
              {error === "invalid-token" && "This link is invalid or has already been used."}
              {error === "missing-token" && "No verification token found."}
              {error === "server-error" && "Something went wrong. Please try again."}
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-block text-sm text-[#0f766e] hover:underline"
            >
              Back to Sign up
            </Link>
          </>
        )}
      </div>
    </main>
  )
}