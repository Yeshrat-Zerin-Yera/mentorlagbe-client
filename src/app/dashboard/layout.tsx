
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  CreditCard,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Crown,
  LoaderCircle,
  Home,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Role = "student" | "tutor" | "admin";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const navigation: Record<Role, NavItem[]> = {
  student: [
    {
      label: "Overview",
      href: "/dashboard/student",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "My Applications",
      href: "/dashboard/student/my-applications",
      icon: <BookOpen size={20} />,
    },
  ],
  tutor: [
    {
      label: "Overview",
      href: "/dashboard/tutor",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Post a Tuition",
      href: "/dashboard/tutor/post-tuition",
      icon: <GraduationCap size={20} />,
    },
    {
      label: "My Tuitions",
      href: "/dashboard/tutor/my-tuitions",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Applicants",
      href: "/dashboard/tutor/applicants",
      icon: <Users size={20} />,
    },
  ],
  admin: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Manage Users",
      href: "/dashboard/admin/users",
      icon: <Users size={20} />,
    },
    {
      label: "Manage Tuitions",
      href: "/dashboard/admin/tuitions",
      icon: <BookOpen size={20} />,
    },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: <CreditCard size={20} />,
    },
  ],
};

const pageTitles: Record<string, string> = {
  "/dashboard/student": "Student Overview",
  "/dashboard/student/my-applications": "My Applications",
  "/dashboard/tutor": "Tutor Overview",
  "/dashboard/tutor/post-tuition": "Post a Tuition",
  "/dashboard/tutor/my-tuitions": "My Tuitions",
  "/dashboard/tutor/applicants": "Manage Applicants",
  "/dashboard/admin": "Admin Overview",
  "/dashboard/admin/users": "Manage Users",
  "/dashboard/admin/tuitions": "Manage Tuitions",
  "/dashboard/admin/transactions": "Transactions",
  "/dashboard/profile": "Update Profile",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const role = (user as typeof user & { role?: Role })?.role;
  const plan = (user as typeof user & { plan?: string })?.plan || "free";

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/sign-in");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await authClient.signOut();
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setSigningOut(false);
    }
  };

  if (isPending || !user) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8]">
        <div className="flex items-center gap-3 text-[#477c68]">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!role || !["student", "tutor", "admin"].includes(role)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-5">
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">
            Dashboard unavailable
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your account does not have a recognized dashboard role.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-lg bg-[#267653] px-5 py-2.5 font-semibold text-white"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const navItems = navigation[role];
  const currentTitle =
    pageTitles[pathname] ||
    (pathname.startsWith("/dashboard/") ? "Dashboard" : "My Dashboard");

  const isActive = (href: string) => {
    if (href === `/dashboard/${role}`) {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="min-h-screen bg-[#f7faf8]">
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-100 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
            collapsed ? "lg:w-20" : "lg:w-72"
          } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Brand */}
          <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
            <Link
              href="/"
              className="flex min-w-0 items-center gap-3"
              title="MentorLagbe Home"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#267653] text-white">
                <GraduationCap size={23} />
              </div>

              <span
                className={`whitespace-nowrap text-xl font-bold text-gray-900 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                Mentor<span className="text-[#267653]">Lagbe</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Close menu"
            >
              <X size={21} />
            </button>
          </div>

          {/* Role Label */}
          <div
            className={`px-5 pb-3 pt-6 ${collapsed ? "lg:px-2" : ""}`}
          >
            <p
              className={`text-xs font-bold uppercase tracking-wider text-gray-400 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              {role} menu
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  isActive(item.href)
                    ? "bg-[#e8f3ed] text-[#267653]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#267653]"
                } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className={collapsed ? "lg:hidden" : ""}>
                  {item.label}
                </span>
              </Link>
            ))}

            <div className="my-4 border-t border-gray-100" />

            <Link
              href="/dashboard/profile"
              title={collapsed ? "Update Profile" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive("/dashboard/profile")
                  ? "bg-[#e8f3ed] text-[#267653]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#267653]"
              } ${collapsed ? "lg:justify-center lg:px-2" : ""}`}
            >
              <Settings size={20} className="shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>
                Update Profile
              </span>
            </Link>

            <Link
              href="/"
              title={collapsed ? "Visit Website" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-[#267653] ${
                collapsed ? "lg:justify-center lg:px-2" : ""
              }`}
            >
              <Home size={20} className="shrink-0" />
              <span className={collapsed ? "lg:hidden" : ""}>
                Visit Website
              </span>
            </Link>
          </nav>

          {/* Plan and Sign Out */}
          <div className="border-t border-gray-100 p-3">
            <div
              className={`mb-3 flex items-center gap-3 rounded-xl bg-[#f7faf8] p-3 ${
                collapsed ? "lg:justify-center lg:px-1" : ""
              }`}
            >
              <Crown className="h-5 w-5 shrink-0 text-[#267653]" />
              <div className={collapsed ? "lg:hidden" : ""}>
                <p className="text-xs text-gray-500">Current Plan</p>
                <p className="text-sm font-bold capitalize text-gray-900">
                  {plan}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={signingOut}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60 ${
                collapsed ? "lg:justify-center lg:px-2" : ""
              }`}
            >
              {signingOut ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <LogOut size={20} />
              )}
              <span className={collapsed ? "lg:hidden" : ""}>
                {signingOut ? "Signing out..." : "Sign Out"}
              </span>
            </button>
          </div>

          {/* Desktop Collapse Button */}
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            className="hidden h-12 items-center justify-center border-t border-gray-100 text-gray-500 transition hover:bg-gray-50 hover:text-[#267653] lg:flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        </aside>

        {/* Main Dashboard Area */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={23} />
              </button>

              <div className="min-w-0">
                <p className="truncate text-lg font-bold text-gray-900">
                  {currentTitle}
                </p>
                <p className="hidden text-xs text-gray-500 sm:block">
                  Manage your MentorLagbe account
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="max-w-40 truncate text-sm font-semibold text-gray-900">
                  {user.name || "User"}
                </p>
                <p className="text-xs capitalize text-gray-500">{role}</p>
              </div>

              <Link
                href="/dashboard/profile"
                className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#d8e9df] bg-[#e8f3ed] text-[#267653]"
                title="Update Profile"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={22} />
                )}
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
