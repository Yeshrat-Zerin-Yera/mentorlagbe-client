
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    BookOpen,
    Clock,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    MapPin,
    CalendarDays,
    UserRound,
    Banknote,
    Eye,
    X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type ApprovalStatus = "pending" | "approved" | "rejected";

type Tuition = {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage: string;
    description: string;
    tutorName: string;
    tutorEmail: string;
    approvalStatus: ApprovalStatus;
    isActive: boolean;
    createdAt?: string;
};

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

const statusStyles: Record<ApprovalStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    approved: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
};

const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "Date unavailable";

    return parsed.toLocaleDateString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export default function AdminTuitionsPage() {
    const { data: session, isPending } = authClient.useSession();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [statusFilter, setStatusFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [selectedTuition, setSelectedTuition] = useState<Tuition | null>(
        null
    );

    const currentUser = session?.user;
    const currentRole = (
        currentUser as typeof currentUser & { role?: string }
    )?.role;

    const fetchTuitions = useCallback(
        async (page = 1, status = statusFilter) => {
            try {
                setLoading(true);
                setError("");
                setNotice("");

                const tokenResult = await authClient.token();
                const token = tokenResult.data?.token;

                if (!token) {
                    throw new Error(
                        "Authentication token not found. Please sign in again."
                    );
                }

                const params = new URLSearchParams({
                    page: String(page),
                    limit: "20",
                });

                if (status !== "all") {
                    params.set("status", status);
                }

                const response = await fetch(
                    `${API_URL}/tuitions/admin/all?${params.toString()}`,
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
                        result.message || "Failed to load tuition posts."
                    );
                }

                setTuitions(result.data || []);
                setPagination(
                    result.pagination || {
                        total: 0,
                        page,
                        limit: 20,
                        totalPages: 1,
                    }
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                setLoading(false);
            }
        },
        [statusFilter]
    );

    useEffect(() => {
        if (isPending) return;

        if (currentRole === "admin") {
            void fetchTuitions(1, statusFilter);
        }
    }, [isPending, currentRole, statusFilter, fetchTuitions]);

    const handleModeration = async (
        tuition: Tuition,
        approvalStatus: "approved" | "rejected"
    ) => {
        const action = approvalStatus === "approved" ? "approve" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${action} "${tuition.title}"?`
            )
        ) {
            return;
        }

        try {
            setProcessingId(tuition._id);
            setError("");
            setNotice("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(
                `${API_URL}/tuitions/admin/${tuition._id}/moderation`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ approvalStatus }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || `Could not ${action} this tuition.`
                );
            }

            setSelectedTuition(null);
            await fetchTuitions(pagination.page, statusFilter);
            setNotice(result.message || `Tuition ${action}d successfully.`);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update tuition status."
            );
        } finally {
            setProcessingId(null);
        }
    };

    if (isPending || (loading && currentRole === "admin")) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading tuition posts...
                    </p>
                </div>
            </div>
        );
    }

    if (currentRole !== "admin") {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                <XCircle className="mx-auto h-10 w-10 text-red-500" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Access denied
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Only administrators can manage tuition posts.
                </p>
            </div>
        );
    }

    const filteredTuitions = tuitions.filter((tuition) => {
        const query = search.toLowerCase();

        return (
            tuition.title?.toLowerCase().includes(query) ||
            tuition.subject?.toLowerCase().includes(query) ||
            tuition.tutorName?.toLowerCase().includes(query) ||
            tuition.tutorEmail?.toLowerCase().includes(query) ||
            tuition.location?.toLowerCase().includes(query)
        );
    });

    const pendingCount = tuitions.filter(
        (tuition) => tuition.approvalStatus === "pending"
    ).length;

    const approvedCount = tuitions.filter(
        (tuition) => tuition.approvalStatus === "approved"
    ).length;

    const rejectedCount = tuitions.filter(
        (tuition) => tuition.approvalStatus === "rejected"
    ).length;

    const tabs = [
        { value: "pending", label: "Pending", icon: Clock },
        { value: "approved", label: "Approved", icon: CheckCircle2 },
        { value: "rejected", label: "Rejected", icon: XCircle },
        { value: "all", label: "All Posts", icon: BookOpen },
    ];

    return (
        <div className="space-y-7">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-600">
                        Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Manage Tuitions
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review tuition posts and manage their approval status.
                    </p>
                </div>

                <button
                    onClick={() =>
                        fetchTuitions(pagination.page, statusFilter)
                    }
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Status summary for current page */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Matching Posts</p>
                        <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {pagination.total}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Posts matching selected status
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Pending</p>
                        <Clock className="h-5 w-5 text-amber-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {pendingCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Approved</p>
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {approvedCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Rejected</p>
                        <XCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {rejectedCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {notice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {notice}
                </div>
            )}

            {/* Filters */}
            <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = statusFilter === tab.value;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${active
                                        ? "bg-emerald-600 text-white shadow-sm"
                                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search title, subject, tutor, or location..."
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                </div>
            </div>

            {/* Tuition cards */}
            <div className="space-y-4">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <h2 className="font-bold text-gray-900">
                        Tuition Posts
                    </h2>
                    <p className="text-xs text-gray-500">
                        Page {pagination.page} of{" "}
                        {Math.max(1, pagination.totalPages)}
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center rounded-2xl border border-gray-100 bg-white py-16">
                        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                ) : filteredTuitions.length === 0 ? (
                    <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center">
                        <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
                        <h3 className="mt-3 font-semibold text-gray-800">
                            No tuition posts found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try another status or search term.
                        </p>
                    </div>
                ) : (
                    filteredTuitions.map((tuition) => (
                        <article
                            key={tuition._id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex flex-col md:flex-row">
                                {tuition.bannerImage ? (
                                    <img
                                        src={tuition.bannerImage}
                                        alt={tuition.title}
                                        className="h-48 w-full object-cover md:h-auto md:w-56"
                                    />
                                ) : (
                                    <div className="flex h-40 w-full items-center justify-center bg-emerald-50 md:h-auto md:w-56">
                                        <BookOpen className="h-12 w-12 text-emerald-300" />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1 p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {tuition.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-emerald-700">
                                                {tuition.subject} ·{" "}
                                                {tuition.classLevel}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[
                                                tuition.approvalStatus
                                                ]
                                                }`}
                                        >
                                            {tuition.approvalStatus}
                                        </span>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-3">
                                        <p className="flex items-center gap-2">
                                            <UserRound className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span className="truncate">
                                                {tuition.tutorName || "Tutor"}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                                            <span className="truncate">
                                                {tuition.mode} · {tuition.location}
                                            </span>
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 shrink-0 text-gray-400" />
                                            {tuition.daysPerWeek} days/week
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <Banknote className="h-4 w-4 shrink-0 text-gray-400" />
                                            ৳{Number(tuition.monthlyFee || 0).toLocaleString("en-BD")} / month
                                        </p>
                                        <p className="text-gray-500 sm:col-span-2">
                                            Tutor: {tuition.tutorEmail}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                        <span className="text-xs text-gray-400">
                                            Posted {formatDate(tuition.createdAt)}
                                        </span>

                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() =>
                                                    setSelectedTuition(tuition)
                                                }
                                                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Details
                                            </button>

                                            {tuition.approvalStatus !==
                                                "approved" && (
                                                    <button
                                                        onClick={() =>
                                                            handleModeration(
                                                                tuition,
                                                                "approved"
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                            tuition._id
                                                        }
                                                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                                                    >
                                                        {processingId ===
                                                            tuition._id
                                                            ? "Processing..."
                                                            : "Approve"}
                                                    </button>
                                                )}

                                            {tuition.approvalStatus !==
                                                "rejected" && (
                                                    <button
                                                        onClick={() =>
                                                            handleModeration(
                                                                tuition,
                                                                "rejected"
                                                            )
                                                        }
                                                        disabled={
                                                            processingId ===
                                                            tuition._id
                                                        }
                                                        className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4">
                <p className="text-xs text-gray-500">
                    {pagination.total} matching posts
                </p>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() =>
                            fetchTuitions(pagination.page - 1, statusFilter)
                        }
                        disabled={pagination.page <= 1 || loading}
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </button>

                    <button
                        onClick={() =>
                            fetchTuitions(pagination.page + 1, statusFilter)
                        }
                        disabled={
                            pagination.page >= pagination.totalPages ||
                            loading
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Tuition details modal */}
            {selectedTuition && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={() => setSelectedTuition(null)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="sticky top-0 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4">
                            <h2 className="font-bold text-gray-900">
                                Tuition Details
                            </h2>
                            <button
                                onClick={() => setSelectedTuition(null)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close details"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            {selectedTuition.bannerImage && (
                                <img
                                    src={selectedTuition.bannerImage}
                                    alt={selectedTuition.title}
                                    className="max-h-64 w-full rounded-xl object-cover"
                                />
                            )}

                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {selectedTuition.title}
                                </h3>
                                <p className="mt-1 text-sm text-emerald-700">
                                    {selectedTuition.subject} ·{" "}
                                    {selectedTuition.classLevel}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Tutor:</strong>{" "}
                                    {selectedTuition.tutorName}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Email:</strong>{" "}
                                    {selectedTuition.tutorEmail}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Mode:</strong>{" "}
                                    {selectedTuition.mode}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Location:</strong>{" "}
                                    {selectedTuition.location}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Monthly fee:</strong>{" "}
                                    ৳{Number(selectedTuition.monthlyFee || 0).toLocaleString("en-BD")}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong className="text-gray-900">Days per week:</strong>{" "}
                                    {selectedTuition.daysPerWeek}
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    Description
                                </h4>
                                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                    {selectedTuition.description ||
                                        "No description provided."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                                {selectedTuition.approvalStatus !==
                                    "approved" && (
                                        <button
                                            onClick={() =>
                                                handleModeration(
                                                    selectedTuition,
                                                    "approved"
                                                )
                                            }
                                            disabled={
                                                processingId === selectedTuition._id
                                            }
                                            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                                        >
                                            Approve Tuition
                                        </button>
                                    )}

                                {selectedTuition.approvalStatus !==
                                    "rejected" && (
                                        <button
                                            onClick={() =>
                                                handleModeration(
                                                    selectedTuition,
                                                    "rejected"
                                                )
                                            }
                                            disabled={
                                                processingId === selectedTuition._id
                                            }
                                            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        >
                                            Reject Tuition
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
