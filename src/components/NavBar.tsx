"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import AuthButtons from "./AuthButton"

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/project-generator", label: "Project Generator" },
    { href: "/my-projects", label: "My Projects" },
  ]

  const getLinkClass = (href: string) => {
    const isActive = pathname === href
    return `font-medium transition-colors ${
      isActive
        ? "text-teal-600 border-b-2 border-teal-600"
        : "text-gray-700 hover:text-teal-600"
    }`
  }

  return (
    <nav className="bg-[#fafffc] shadow-md border-b border-cyan-100">
      <div className="max-w-7xl mx-7 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src="/favicon.ico"
              alt="Projectify Logo"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-teal-600 text-2xl font-bold">Projectify</span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <AuthButtons />

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-700 hover:text-teal-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col gap-4 py-4 border-t border-cyan-100">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={getLinkClass(link.href)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

      </div>
    </nav>
  )
}