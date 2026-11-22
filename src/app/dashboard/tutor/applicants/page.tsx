
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    CheckCircle2,
    XCircle,
    Clock,
    CalendarDays,
    Phone,
    Mail,
    BookOpen,
    Loader2,
    AlertCircle,
    FileText,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";
import { toast } from "sonner";

type ApplicationStatus = "pending" | "accepted" | "rejected";

type Applicant = {
    _id: string;
    tuitionId: string;
    tuitionTitle: string;
    subject: string;
    monthlyFee: number;
    tutorEmail: string;
    tutorName?: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
    preferredSchedule: string;
    studentNote?: string;
    status: ApplicationStatus;
    appliedAt: string;
};

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

const statusStyles: Record<ApplicationStatus, string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200",
    accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    rejected: "bg-rose-50 text-rose-700 ring-rose-200",
};

function formatDate(date: string) {
    if (!date) return "—";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

function getErrorMessage(result: unknown, fallback: string) {
    if (
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof result.message === "string"
    ) {
        return result.message;
    }

    return fallback;
}

export default function TutorApplicantsPage() {
    const { data: session, isPending: sessionLoading } =
        authClient.useSession();

    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
    });

    const [statusFilter, setStatusFilter] = useState<
        "all" | ApplicationStatus
    >("all");

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const user = session?.user;
    const role = (
        user as typeof user & { role?: string }
    )?.role;

    const fetchApplicants = useCallback(
        async (page = 1) => {
            try {
                setLoading(true);
                setError("");

                const tokenResult = await authClient.token();
                const token = tokenResult.data?.token;

                if (tokenResult.error || !token) {
                    throw new Error("Please sign in again to continue.");
                }

                const params = new URLSearchParams({
                    page: String(page),
                    limit: "10",
                });

                if (statusFilter !== "all") {
                    params.set("status", statusFilter);
                }

                const response = await fetch(
                    `${API_URL}/applications/tutor?${params.toString()}`,
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
                        getErrorMessage(
                            result,
                            "Failed to load applicants."
                        )
                    );
                }

                setApplicants(
                    Array.isArray(result.data) ? result.data : []
                );

                setPagination(
                    result.pagination || {
                        total: 0,
                        page,
                        limit: 10,
                        totalPages: 0,
                    }
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
                setApplicants([]);
            } finally {
                setLoading(false);
            }
        },
        [statusFilter]
    );

    useEffect(() => {
        if (!sessionLoading && user && role === "tutor") {
            void fetchApplicants(1);
        }
    }, [sessionLoading, user, role, fetchApplicants]);

    const handleStatusUpdate = async (
        applicationId: string,
        status: "accepted" | "rejected"
    ) => {
        const actionLabel = status === "accepted" ? "accept" : "reject";

        if (
            !window.confirm(
                `Are you sure you want to ${actionLabel} this application?`
            )
        ) {
            return;
        }

        try {
            setActionId(applicationId);
            setError("");
            setNotice("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (tokenResult.error || !token) {
                throw new Error("Please sign in again to continue.");
            }

            const response = await fetch(
                `${API_URL}/applications/${applicationId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    getErrorMessage(
                        result,
                        "Could not update this application."
                    )
                );
            }

            const message =
                result.message ||
                `Application ${status} successfully.`;

            setNotice(message);
            toast.success(message);

            await fetchApplicants(pagination.page);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to update application.";

            setError(message);
            toast.error(message);
        } finally {
            setActionId(null);
        }
    };

    const filteredApplicants = applicants.filter((applicant) => {
        const query = search.trim().toLowerCase();

        if (!query) return true;

        return [
            applicant.studentName,
            applicant.studentEmail,
            applicant.studentPhone,
            applicant.tuitionTitle,
            applicant.subject,
        ].some((value) => value?.toLowerCase().includes(query));
    });

    if (sessionLoading || loading && !user) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900">
                    Sign in required
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    Please sign in to view your applicants.
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

    if (role !== "tutor") {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
                <AlertCircle className="mx-auto h-9 w-9 text-rose-600" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Access restricted
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    This page is available to tutor accounts only.
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

    const filterOptions = [
        { value: "all", label: "All Applicants" },
        { value: "pending", label: "Pending" },
        { value: "accepted", label: "Accepted" },
        { value: "rejected", label: "Rejected" },
    ] as const;

    return (
        <div className="space-y-6">
            {/* Heading */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-emerald-700">
                        Tutor Dashboard
                    </p>
                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                        Applicants
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review student applications and manage their status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => fetchApplicants(pagination.page)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Summary */}
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-5 sm:p-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">
                            Applications in this view
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {pagination.total}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {filterOptions.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    setStatusFilter(option.value);
                                    setSearch("");
                                }}
                                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${statusFilter === option.value
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search applicants..."
                            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                        />
                    </div>
                </div>
            </div>

            {/* Messages */}
            {error && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {notice && (
                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{notice}</span>
                </div>
            )}

            {/* Applicants */}
            {loading ? (
                <div className="flex min-h-52 items-center justify-center rounded-2xl border border-gray-200 bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                </div>
            ) : filteredApplicants.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                        <Users className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 text-lg font-bold text-gray-900">
                        No applicants found
                    </h3>
                    <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                        {search
                            ? "Try another search term."
                            : statusFilter === "all"
                                ? "You haven't received any applications yet."
                                : `There are no ${statusFilter} applications right now.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredApplicants.map((applicant) => (
                        <article
                            key={applicant._id}
                            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-700">
                                        {applicant.studentName
                                            ?.charAt(0)
                                            .toUpperCase() || "S"}
                                    </div>

                                    <div className="min-w-0">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            {applicant.studentName || "Student"}
                                        </h2>
                                        <p className="mt-1 break-all text-sm text-gray-500">
                                            {applicant.studentEmail}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-400">
                                            Applied on{" "}
                                            {formatDate(applicant.appliedAt)}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold capitalize ring-1 ring-inset ${statusStyles[applicant.status] || statusStyles.pending}`}
                                >
                                    {applicant.status === "pending" ? (
                                        <Clock className="h-3.5 w-3.5" />
                                    ) : applicant.status === "accepted" ? (
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    ) : (
                                        <XCircle className="h-3.5 w-3.5" />
                                    )}
                                    {applicant.status}
                                </span>
                            </div>

                            <div className="grid gap-5 p-5 md:grid-cols-2">
                                {/* Student details */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Student Information
                                    </h3>

                                    <p className="flex items-center gap-2 break-all text-sm text-gray-600">
                                        <Mail className="h-4 w-4 shrink-0 text-emerald-600" />
                                        {applicant.studentEmail || "Not provided"}
                                    </p>

                                    <p className="flex items-center gap-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4 shrink-0 text-emerald-600" />
                                        {applicant.studentPhone || "Not provided"}
                                    </p>

                                    <p className="flex items-start gap-2 text-sm text-gray-600">
                                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                        <span>
                                            <span className="font-medium text-gray-700">
                                                Preferred schedule:
                                            </span>{" "}
                                            {applicant.preferredSchedule || "Not provided"}
                                        </span>
                                    </p>
                                </div>

                                {/* Tuition details */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Applied Tuition
                                    </h3>

                                    <p className="flex items-start gap-2 text-sm text-gray-700">
                                        <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                                        <span className="font-semibold">
                                            {applicant.tuitionTitle}
                                        </span>
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        Subject: {applicant.subject || "—"}
                                    </p>

                                    <p className="text-sm font-semibold text-emerald-700">
                                        Monthly fee: ৳
                                        {Number(applicant.monthlyFee || 0).toLocaleString(
                                            "en-BD"
                                        )}
                                    </p>

                                    {applicant.tuitionId && (
                                        <Link
                                            href={`/tuitions/${applicant.tuitionId}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                        >
                                            View Tuition
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {/* Student note */}
                            {applicant.studentNote && (
                                <div className="mx-5 mb-5 rounded-xl bg-gray-50 p-4">
                                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                                        <FileText className="h-4 w-4" />
                                        Student Note
                                    </p>
                                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                        {applicant.studentNote}
                                    </p>
                                </div>
                            )}

                            {/* Actions */}
                            {applicant.status === "pending" && (
                                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 p-5 sm:flex-row sm:justify-end">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusUpdate(
                                                applicant._id,
                                                "rejected"
                                            )
                                        }
                                        disabled={actionId !== null}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionId === applicant._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="h-4 w-4" />
                                        )}
                                        Reject
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleStatusUpdate(
                                                applicant._id,
                                                "accepted"
                                            )
                                        }
                                        disabled={actionId !== null}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {actionId === applicant._id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-4 w-4" />
                                        )}
                                        Accept
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        Page{" "}
                        <span className="font-semibold text-gray-900">
                            {pagination.page}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-gray-900">
                            {pagination.totalPages}
                        </span>
                        {" · "}
                        {pagination.total} applications
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                fetchApplicants(pagination.page - 1)
                            }
                            disabled={pagination.page <= 1}
                            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                fetchApplicants(pagination.page + 1)
                            }
                            disabled={
                                pagination.page >= pagination.totalPages
                            }
                            className="inline-flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
