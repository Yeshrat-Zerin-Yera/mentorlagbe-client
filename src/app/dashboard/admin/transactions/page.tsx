
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    CreditCard,
    DollarSign,
    Receipt,
    CalendarDays,
    UserRound,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Crown,
    ExternalLink,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type Payment = {
    _id: string;
    userEmail: string;
    userName: string;
    userRole: string;
    planName: string;
    amount: number;
    currency: string;
    transactionId: string;
    stripeSessionId: string;
    paymentStatus: string;
    paidAt?: string;
};

type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "Date unavailable";
    }

    return parsed.toLocaleString("en-BD", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
};

const formatAmount = (amount: number, currency?: string) => {
    const normalizedCurrency = (currency || "").toUpperCase();

    if (!normalizedCurrency) {
        return Number(amount || 0).toLocaleString("en-BD");
    }

    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: normalizedCurrency,
        }).format(Number(amount || 0));
    } catch {
        return `${normalizedCurrency} ${Number(amount || 0).toLocaleString("en-BD")}`;
    }
};

export default function AdminTransactionsPage() {
    const { data: session, isPending } = authClient.useSession();

    const [payments, setPayments] = useState<Payment[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 1,
    });
    const [revenue, setRevenue] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUser = session?.user;
    const currentRole = (
        currentUser as typeof currentUser & { role?: string }
    )?.role;

    const fetchPayments = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (!token) {
                throw new Error(
                    "Authentication token not found. Please sign in again."
                );
            }

            const response = await fetch(
                `${API_URL}/payments/admin/all?page=${page}&limit=20`,
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
                    result.message || "Failed to retrieve payment records."
                );
            }

            setPayments(result.data || []);
            setRevenue(Number(result.revenue || 0));
            setPagination(
                result.pagination || {
                    page,
                    limit: 20,
                    total: 0,
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
    }, []);

    useEffect(() => {
        if (isPending) return;

        if (currentRole === "admin") {
            void fetchPayments(1);
        }
    }, [isPending, currentRole, fetchPayments]);

    if (isPending || (loading && currentRole === "admin")) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading transactions...
                    </p>
                </div>
            </div>
        );
    }

    if (currentRole !== "admin") {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                <CreditCard className="mx-auto h-10 w-10 text-red-500" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Access denied
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Only administrators can view payment transactions.
                </p>
            </div>
        );
    }

    const filteredPayments = payments.filter((payment) => {
        const query = search.toLowerCase();

        return (
            payment.userName?.toLowerCase().includes(query) ||
            payment.userEmail?.toLowerCase().includes(query) ||
            payment.transactionId?.toLowerCase().includes(query) ||
            payment.stripeSessionId?.toLowerCase().includes(query) ||
            payment.planName?.toLowerCase().includes(query)
        );
    });

    const paidOnCurrentPage = payments.filter(
        (payment) => payment.paymentStatus === "paid"
    ).length;

    const currentPageRevenue = payments
        .filter((payment) => payment.paymentStatus === "paid")
        .reduce((total, payment) => total + Number(payment.amount || 0), 0);

    return (
        <div className="space-y-7">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-600">
                        Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Transactions
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Review Stripe payments and subscription purchases.
                    </p>
                </div>

                <button
                    onClick={() => fetchPayments(pagination.page)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Total Paid Transactions
                        </p>
                        <Receipt className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {pagination.total.toLocaleString("en-BD")}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Successful payments
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Total Recorded Revenue
                        </p>
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {revenue.toLocaleString("en-US", {
                            maximumFractionDigits: 2,
                        })}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Sum reported by the payments API
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                            Payments on This Page
                        </p>
                        <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {paidOnCurrentPage}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Current page only
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by user, email, plan, or transaction ID..."
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                </div>
            </div>

            {/* Transaction list */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-gray-900">
                            Payment Records
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Showing {filteredPayments.length} of{" "}
                            {payments.length} records on this page
                        </p>
                    </div>
                    <span className="text-xs text-gray-400">
                        Page {pagination.page} of{" "}
                        {Math.max(1, pagination.totalPages)}
                    </span>
                </div>

                {filteredPayments.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <Receipt className="mx-auto h-10 w-10 text-gray-300" />
                        <h3 className="mt-3 font-semibold text-gray-800">
                            No transactions found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {search
                                ? "Try another search term."
                                : "Successful payment records will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredPayments.map((payment) => (
                            <div
                                key={payment._id}
                                className="space-y-4 p-5 transition hover:bg-gray-50/70"
                            >
                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                            <UserRound className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="truncate font-semibold text-gray-900">
                                                {payment.userName || "Unknown user"}
                                            </h3>
                                            <p className="break-all text-sm text-gray-500">
                                                {payment.userEmail}
                                            </p>
                                            <p className="mt-1 text-xs capitalize text-gray-400">
                                                {payment.userRole || "User"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <p className="text-xl font-bold text-gray-900">
                                            {formatAmount(
                                                payment.amount,
                                                payment.currency
                                            )}
                                        </p>
                                        <span
                                            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                                                payment.paymentStatus === "paid"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                            }`}
                                        >
                                            {payment.paymentStatus || "Unknown"}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 rounded-xl bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Subscription Plan
                                        </p>
                                        <p className="mt-1 flex items-center gap-2 text-sm font-semibold capitalize text-gray-800">
                                            <Crown className="h-4 w-4 text-amber-500" />
                                            {payment.planName || "N/A"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Transaction ID
                                        </p>
                                        <p className="mt-1 break-all text-sm font-medium text-gray-700">
                                            {payment.transactionId || "Not available"}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-400">
                                            Payment Date
                                        </p>
                                        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                                            <CalendarDays className="h-4 w-4 text-gray-400" />
                                            {formatDate(payment.paidAt)}
                                        </p>
                                    </div>
                                </div>

                                {payment.stripeSessionId && (
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="break-all text-xs text-gray-400">
                                            Stripe Session: {payment.stripeSessionId}
                                        </p>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700">
                                            Stripe record
                                            <ExternalLink className="h-3 w-3" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-500">
                        {pagination.total} paid transactions
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchPayments(pagination.page - 1)}
                            disabled={pagination.page <= 1 || loading}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>

                        <button
                            onClick={() => fetchPayments(pagination.page + 1)}
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
            </div>

            <p className="text-xs text-gray-400">
                Current-page revenue:{" "}
                {currentPageRevenue.toLocaleString("en-US", {
                    maximumFractionDigits: 2,
                })}{" "}
                across the displayed paid records. Individual payments show
                their own currency above.
            </p>
        </div>
    );
}
