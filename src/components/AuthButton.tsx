"use client";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

function getGradient(name: string) {
  const gradients = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-pink-600",
    "from-rose-500 to-red-600",
    "from-amber-500 to-yellow-600",
  ]
  const index = name.charCodeAt(0) % gradients.length
  return gradients[index]
}

function Avatar({ name, image }: { name?: string | null, image?: string | null }) {
  if (image) {
    return (
      <Image
        src={image}
        alt={name ?? "User"}
        width={32}
        height={32}
        className="rounded-full ring-2 ring-white"
      />
    )
  }

  const initials = name
    ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  const gradient = getGradient(name ?? "A")

  return (
    <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${gradient} ring-2 ring-white shadow-sm`}>
      <span className="text-xs font-bold text-white">{initials}</span>
    </div>
  )
}

export default function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-10 w-24 animate-pulse rounded-xl bg-gray-200" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Avatar
          name={session.user?.name}
          image={session.user?.image}
        />
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="inline-flex items-center justify-center gap-1 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium px-3 py-2.5 rounded-xl transition-colors text-sm bg-white"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/signin"
        className="inline-flex items-center justify-center gap-1 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 font-medium px-3 py-2.5 rounded-xl transition-colors text-sm bg-white"
      >
        Sign in
      </Link>
    </div>
  );
}