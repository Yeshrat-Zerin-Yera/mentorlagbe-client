
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Menu,
  X,
  UserRound,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Browse Tuitions", href: "/tuitions" },
  { label: "Pricing", href: "/pricing" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const user = session?.user;

  // Read the custom role field from the authenticated user.
  const role =
    (user as typeof user & { role?: string } | null)?.role || "student";

  const dashboardHref =
    role === "admin"
      ? "/dashboard/admin"
      : role === "tutor"
        ? "/dashboard/tutor"
        : "/dashboard/student";

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await authClient.signOut();
      setProfileOpen(false);
      setMenuOpen(false);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setSigningOut(false);
    }
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e3ece9] bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={closeMenus}
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
          {isPending ? (
            <div className="h-10 w-28 animate-pulse rounded-xl bg-[#e8f4f1]" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                aria-expanded={profileOpen}
                className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-[#e8f4f1]"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f4f1] text-[#087f78]">
                    <UserRound size={19} />
                  </span>
                )}

                <span className="max-w-32 truncate text-sm font-bold text-[#142b35]">
                  {user.name}
                </span>

                <ChevronDown size={16} className="text-[#64777d]" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-[#e3ece9] bg-white p-2 shadow-xl">
                  <div className="border-b border-[#e3ece9] px-3 py-3">
                    <p className="truncate text-sm font-bold text-[#142b35]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#64777d]">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs font-semibold capitalize text-[#087f78]">
                      {role}
                    </p>
                  </div>

                  <Link
                    href={dashboardHref}
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#536970] transition hover:bg-[#e8f4f1] hover:text-[#087f78]"
                  >
                    <LayoutDashboard size={17} />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={closeMenus}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#536970] transition hover:bg-[#e8f4f1] hover:text-[#087f78]"
                  >
                    <UserRound size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <LogOut size={17} />
                    {signingOut ? "Signing out..." : "Sign Out"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
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
                onClick={closeMenus}
                className="text-sm font-semibold text-[#536970] transition hover:text-[#087f78]"
              >
                {link.label}
              </Link>
            ))}

            {!isPending && (
              <>
                {user ? (
                  <div className="border-t border-[#e3ece9] pt-4">
                    <div className="mb-3 flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f4f1] text-[#087f78]">
                          <UserRound size={20} />
                        </span>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#142b35]">
                          {user.name}
                        </p>
                        <p className="text-xs capitalize text-[#64777d]">
                          {role}
                        </p>
                      </div>
                    </div>

                    <Link
                      href={dashboardHref}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold text-[#536970]"
                    >
                      <LayoutDashboard size={18} />
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-lg py-2.5 text-sm font-semibold text-[#536970]"
                    >
                      <UserRound size={18} />
                      My Profile
                    </Link>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="flex w-full items-center gap-3 rounded-lg py-2.5 text-left text-sm font-semibold text-red-600 disabled:opacity-60"
                    >
                      <LogOut size={18} />
                      {signingOut ? "Signing out..." : "Sign Out"}
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3 border-t border-[#e3ece9] pt-4">
                    <Link
                      href="/sign-in"
                      onClick={closeMenus}
                      className="flex-1 rounded-xl border border-[#e3ece9] px-4 py-3 text-center text-sm font-bold text-[#142b35]"
                    >
                      Sign In
                    </Link>

                    <Link
                      href="/sign-up"
                      onClick={closeMenus}
                      className="flex-1 rounded-xl bg-[#087f78] px-4 py-3 text-center text-sm font-bold !text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
