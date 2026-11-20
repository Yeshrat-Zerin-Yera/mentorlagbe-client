
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#e3ece9] bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087f78] text-white">
            <GraduationCap size={25} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#142b35]">
            Mentor<span className="text-[#087f78]">Lagbe</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-semibold text-[#536970] md:flex">
          <Link href="/" className="text-[#087f78]">
            Home
          </Link>
          <Link
            href="/tuitions"
            className="transition hover:text-[#087f78]"
          >
            Browse Tuitions
          </Link>
          <Link
            href="/pricing"
            className="transition hover:text-[#087f78]"
          >
            Pricing
          </Link>
          <a
            href="#how-it-works"
            className="transition hover:text-[#087f78]"
          >
            How It Works
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-bold text-[#142b35] transition hover:bg-[#e8f4f1] sm:inline-flex"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="rounded-xl bg-[#087f78] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#06645f]"
          >
            Get Started <span className="ml-1">→</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
