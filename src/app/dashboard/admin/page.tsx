
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    GraduationCap,
    BookOpen,
    Clock,
    CheckCircle2,
    Wallet,
    RefreshCw,
    Loader2,
    AlertCircle,
    ArrowRight,
    ShieldCheck,
    UserRound,
    FileCheck,
    CreditCard,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type AdminStats = {
    totalUsers: number;
    totalTutors: number;
    pendingTuitions: number;
    approvedTuitions: number;
    totalRevenue: number;
};

const initialStats: AdminStats = {
    totalUsers: 0,
    totalTutors: 0,
    pendingTuitions: 0,
    approvedTuitions: 0,
    totalRevenue: 0,
};

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    iconStyle,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    iconStyle: string;
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        {title}
                    </p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
                        {value}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [stats, setStats] = useState<AdminStats>(initialStats);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = session?.user;
    const role = (
        user as typeof user & { role?: string }
    )?.role;

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (tokenResult.error || !token) {
                throw new Error("Please sign in again to continue.");
            }

            const response = await fetch(
                `${API_URL}/users/admin/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to load dashboard statistics."
                );
            }

            setStats({
                totalUsers: Number(result.data?.totalUsers || 0),
                totalTutors: Number(result.data?.totalTutors || 0),
                pendingTuitions: Number(
                    result.data?.pendingTuitions || 0
                ),
                approvedTuitions: Number(
                    result.data?.approvedTuitions || 0
                ),
                totalRevenue: Number(result.data?.totalRevenue || 0),
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!sessionLoading && user && role === "admin") {
            void fetchStats();
        }
    }, [sessionLoading, user, role, fetchStats]);

    if (sessionLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-emerald-600" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Sign in required
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Please sign in to access the admin dashboard.
                </p>
                <Link
                    href="/sign-in"
                    className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    if (role !== "admin") {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-rose-600" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Access restricted
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    This page is available to administrators only.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-5 inline-flex rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                >
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    const totalModerated =
        stats.pendingTuitions + stats.approvedTuitions;

    const approvalRate =
        totalModerated > 0
            ? Math.round(
                  (stats.approvedTuitions / totalModerated) * 100
              )
            : 0;

    const quickLinks = [
        {
            title: "Manage Users",
            description: "View users and manage account roles.",
            href: "/dashboard/admin/users",
            icon: Users,
        },
        {
            title: "Manage Tuitions",
            description: "Review and moderate tuition posts.",
            href: "/dashboard/admin/tuitions",
            icon: BookOpen,
        },
        {
            title: "Transactions",
            description: "Review Stripe payment records.",
            href: "/dashboard/admin/transactions",
            icon: CreditCard,
        },
    ];

    return (
        <div className="space-y-7">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-semibold text-emerald-700">
                        Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Admin Dashboard
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Monitor platform activity and manage MentorLagbe.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchStats}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Refresh Statistics
                </button>
            </div>

            {/* Welcome card */}
            <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white shadow-sm sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                            <ShieldCheck className="h-4 w-4" />
                            Administrator Access
                        </div>
                        <h2 className="mt-4 text-2xl font-bold">
                            Welcome back, {user.name || "Admin"}!
                        </h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">
                            Manage users, review tuition posts, and monitor
                            the platform's payment activity from one place.
                        </p>
                    </div>

                    <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:flex">
                        <ShieldCheck className="h-11 w-11" />
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                    <div>
                        <p className="font-semibold">
                            Unable to load statistics
                        </p>
                        <p className="mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* Main statistics */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        Platform Overview
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Key statistics from your platform database.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Users"
                        value={
                            loading && !error
                                ? "..."
                                : stats.totalUsers.toLocaleString()
                        }
                        description="Registered platform accounts"
                        icon={Users}
                        iconStyle="bg-blue-50 text-blue-600"
                    />

                    <StatCard
                        title="Total Tutors"
                        value={
                            loading && !error
                                ? "..."
                                : stats.totalTutors.toLocaleString()
                        }
                        description="Registered tutor accounts"
                        icon={GraduationCap}
                        iconStyle="bg-violet-50 text-violet-600"
                    />

                    <StatCard
                        title="Pending Tuitions"
                        value={
                            loading && !error
                                ? "..."
                                : stats.pendingTuitions.toLocaleString()
                        }
                        description="Waiting for admin review"
                        icon={Clock}
                        iconStyle="bg-amber-50 text-amber-600"
                    />

                    <StatCard
                        title="Approved Tuitions"
                        value={
                            loading && !error
                                ? "..."
                                : stats.approvedTuitions.toLocaleString()
                        }
                        description="Approved tuition posts"
                        icon={CheckCircle2}
                        iconStyle="bg-emerald-50 text-emerald-600"
                    />
                </div>
            </section>

            {/* Tuition moderation and revenue */}
            <section className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-gray-900">
                                Tuition Moderation
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Pending and approved posts
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FileCheck className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-6 flex items-end justify-between">
                        <div>
                            <p className="text-3xl font-bold text-gray-900">
                                {loading ? "..." : `${approvalRate}%`}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                                Approval rate
                            </p>
                        </div>
                        <p className="text-sm text-gray-500">
                            {totalModerated} total posts
                        </p>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-emerald-500 transition-all"
                            style={{
                                width: `${loading ? 0 : approvalRate}%`,
                            }}
                        />
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl bg-amber-50 p-4">
                            <p className="text-xs font-medium text-amber-700">
                                Pending
                            </p>
                            <p className="mt-1 text-2xl font-bold text-amber-800">
                                {loading ? "..." : stats.pendingTuitions}
                            </p>
                        </div>

                        <div className="rounded-xl bg-emerald-50 p-4">
                            <p className="text-xs font-medium text-emerald-700">
                                Approved
                            </p>
                            <p className="mt-1 text-2xl font-bold text-emerald-800">
                                {loading ? "..." : stats.approvedTuitions}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard/admin/tuitions"
                        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        Review Tuitions
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-gray-900">
                                Stripe Revenue
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Successful recorded payments
                            </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Wallet className="h-5 w-5" />
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-sm text-gray-500">
                            Total Revenue
                        </p>
                        <p className="mt-2 break-words text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            {loading
                                ? "..."
                                : `৳${stats.totalRevenue.toLocaleString(
                                      "en-BD",
                                      {
                                          maximumFractionDigits: 2,
                                      }
                                  )}`}
                        </p>
                        <p className="mt-3 text-xs text-gray-500">
                            Calculated from payment records marked as paid.
                        </p>
                    </div>

                    <Link
                        href="/dashboard/admin/transactions"
                        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                    >
                        View Transactions
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            {/* Quick links */}
            <section>
                <div className="mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        Quick Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Jump directly to an administration section.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {quickLinks.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-gray-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
                                </div>

                                <h3 className="mt-4 font-bold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                    {item.description}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
