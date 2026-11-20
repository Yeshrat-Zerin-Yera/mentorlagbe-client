
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e3ece9] bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={() => setMenuOpen(false)}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087f78] text-white">
            <GraduationCap size={25} />
          </span>

          <span className="text-xl font-extrabold tracking-tight text-[#142b35]">
            Mentor<span className="text-[#087f78]">Lagbe</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#536970] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-[#087f78]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/sign-in"
            className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#142b35] transition hover:bg-[#e8f4f1]"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="rounded-xl bg-[#087f78] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#06645f]"
          >
            Get Started →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="rounded-lg p-2 text-[#142b35] hover:bg-[#e8f4f1] md:hidden"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#e3ece9] bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold text-[#536970] transition hover:text-[#087f78]"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex gap-3 border-t border-[#e3ece9] pt-4">
              <Link
                href="/sign-in"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl border border-[#e3ece9] px-4 py-3 text-center text-sm font-bold text-[#142b35]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-xl bg-[#087f78] px-4 py-3 text-center text-sm font-bold text-white"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
