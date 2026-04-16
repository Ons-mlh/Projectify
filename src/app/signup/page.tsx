'use client'

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Eye, EyeClosed } from "lucide-react"

function getPasswordChecks(password: string) {
	return {
		minLength: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /[0-9]/.test(password),
		special: /[^A-Za-z0-9]/.test(password),
	}
}

export default function SignUpPage() {
	const [password, setPassword] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [confirmPassword, setConfirmPassword] = useState("")

	const checks = useMemo(() => getPasswordChecks(password), [password])
	const passedChecks = Object.values(checks).filter(Boolean).length

	const strengthLabel = useMemo(() => {
		if (!password) return ""
		if (passedChecks <= 2) return "Weak"
		if (passedChecks <= 4) return "Medium"
		return "Strong"
	}, [password, passedChecks])

	const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

	return (
		<main className="min-h-screen flex items-center justify-center bg-[#f6fffa] px-3 py-3 sm:px-4 sm:py-10">
			<div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-8 border border-gray-100">
				<h1 className="text-lg sm:text-2xl font-semibold text-center text-gray-800">
					Create your account
				</h1>
				<p className="text-center text-sm text-gray-500 mt-2 sm:text-base">
					Join <span className="text-[#0f766e] font-medium">Projectify</span> and start building faster
				</p>

				<form className="mt-5 sm:mt-6 flex flex-col gap-3.5 sm:gap-4">
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="flex flex-col gap-1.5">
							<label htmlFor="firstName" className="text-sm font-medium text-gray-700">
								Name
							</label>
							<input
								id="firstName"
								type="text"
								placeholder="John"
								className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
							/>
						</div>

						<div className="flex flex-col gap-1.5">
							<label htmlFor="lastName" className="text-sm font-medium text-gray-700">
								Last name
							</label>
							<input
								id="lastName"
								type="text"
								placeholder="Doe"
								className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
							/>
						</div>
					</div>

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
								placeholder="Create a password"
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

						<div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs sm:text-sm text-gray-600">
							<p className="font-medium text-gray-700">
								Password strength: <span className="text-[#0f766e]">{strengthLabel || "Not set"}</span>
							</p>
							<ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
								<li className={checks.minLength ? "text-[#0f766e]" : "text-gray-500"}>At least 8 characters</li>
								<li className={checks.upper ? "text-[#0f766e]" : "text-gray-500"}>At least 1 uppercase letter</li>
								<li className={checks.lower ? "text-[#0f766e]" : "text-gray-500"}>At least 1 lowercase letter</li>
								<li className={checks.number ? "text-[#0f766e]" : "text-gray-500"}>At least 1 number</li>
								<li className={checks.special ? "text-[#0f766e]" : "text-gray-500"}>At least 1 special character</li>
							</ul>
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
							Confirm password
						</label>
						<div className="relative">
							<input
								id="confirmPassword"
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-3 py-2.5 pr-11 text-base text-gray-800 outline-none focus:border-[#0f766e] focus:ring-2 focus:ring-[#0f766e]/20"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword((prev) => !prev)}
								aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
								className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
							>
								{showConfirmPassword ? <EyeClosed size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{confirmPassword.length > 0 && (
							<p className={`text-xs sm:text-sm ${passwordsMatch ? "text-[#0f766e]" : "text-red-500"}`}>
								{passwordsMatch ? "Passwords match" : "Passwords do not match"}
							</p>
						)}
					</div>

					<button
						type="submit"
						className="w-full py-3 rounded-lg bg-[#0f766e] text-white font-medium hover:bg-[#0d5f5a] transition"
					>
						Create account
					</button>
				</form>

				<div className="flex items-center gap-2 my-5 sm:my-6">
					<div className="flex-1 h-px bg-gray-200"></div>
					<span className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">Or Sign Up with</span>
					<div className="flex-1 h-px bg-gray-200"></div>
				</div>

				<div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
					<button
						type="button"
						onClick={() => signIn("github", { callbackUrl: "/" })}
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
						onClick={() => signIn("google", { callbackUrl: "/" })}
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

				<p className="mt-5 sm:mt-6 text-center text-sm text-gray-500">
					Already have an account?{" "}
					<Link href="/signin" className="font-medium text-[#0f766e] hover:underline">
						Sign in
					</Link>
				</p>
			</div>
		</main>
	)
}
