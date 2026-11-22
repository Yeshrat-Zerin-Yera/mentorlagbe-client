
"use client";

import { useCallback, useEffect, useState } from "react";
import {
    Search,
    Users,
    GraduationCap,
    ShieldCheck,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    UserRound,
    Crown,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

type UserRole = "student" | "tutor" | "admin";

type ManagedUser = {
    id: string;
    name: string;
    email: string;
    image: string;
    role: UserRole;
    phone: string;
    bio: string;
    plan: "free" | "pro";
    createdAt?: string;
};

type Pagination = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

const roleStyles: Record<UserRole, string> = {
    student: "bg-blue-50 text-blue-700",
    tutor: "bg-emerald-50 text-emerald-700",
    admin: "bg-violet-50 text-violet-700",
};

export default function AdminUsersPage() {
    const { data: session, isPending } = authClient.useSession();

    const [users, setUsers] = useState<ManagedUser[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const currentUser = session?.user;
    const currentRole = (
        currentUser as typeof currentUser & { role?: string }
    )?.role;

    const fetchUsers = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError("");
            setNotice("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (!token) {
                throw new Error("Authentication token not found. Please sign in again.");
            }

            const response = await fetch(
                `${API_URL}/users?page=${page}&limit=20`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    cache: "no-store",
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to load users.");
            }

            setUsers(result.data || []);
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
                err instanceof Error ? err.message : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isPending) return;

        if (currentRole === "admin") {
            void fetchUsers(1);
        }
    }, [isPending, currentRole, fetchUsers]);

    const handleRoleChange = async (
        userId: string,
        newRole: UserRole
    ) => {
        const user = users.find((item) => item.id === userId);

        if (!user || user.role === newRole) return;

        const confirmed = window.confirm(
            `Change ${user.name}'s role from ${user.role} to ${newRole}?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(userId);
            setError("");
            setNotice("");

            const tokenResult = await authClient.token();
            const token = tokenResult.data?.token;

            if (!token) {
                throw new Error("Authentication token not found.");
            }

            const response = await fetch(
                `${API_URL}/users/${userId}/role`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ role: newRole }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Could not update user role.");
            }

            setUsers((previous) =>
                previous.map((item) =>
                    item.id === userId
                        ? { ...item, role: result.data?.role || newRole }
                        : item
                )
            );

            const message = `${user.name}'s role was updated to ${newRole}.`;

            setNotice(message);
            toast.success(message);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Could not update user role.";

            setError(message);
            toast.error(message);
        } finally {
            setUpdatingId(null);
        }
    };

    if (isPending || loading && currentRole === "admin") {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-9 w-9 animate-spin text-emerald-600" />
                    <p className="mt-3 text-sm text-gray-500">
                        Loading users...
                    </p>
                </div>
            </div>
        );
    }

    if (currentRole !== "admin") {
        return (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                <ShieldCheck className="mx-auto h-10 w-10 text-red-500" />
                <h2 className="mt-3 text-xl font-bold text-gray-900">
                    Access denied
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                    Only administrators can manage users.
                </p>
            </div>
        );
    }

    const filteredUsers = users.filter((user) => {
        const searchMatch =
            user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase());

        const roleMatch =
            roleFilter === "all" || user.role === roleFilter;

        return searchMatch && roleMatch;
    });

    const studentCount = users.filter(
        (user) => user.role === "student"
    ).length;

    const tutorCount = users.filter(
        (user) => user.role === "tutor"
    ).length;

    const adminCount = users.filter(
        (user) => user.role === "admin"
    ).length;

    return (
        <div className="space-y-7">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-emerald-600">
                        Administration
                    </p>
                    <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                        Manage Users
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        View registered users and manage their platform roles.
                    </p>
                </div>

                <button
                    onClick={() => fetchUsers(pagination.page)}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <Users className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {pagination.total}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        Registered accounts
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Students</p>
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {studentCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Tutors</p>
                        <UserRound className="h-5 w-5 text-emerald-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {tutorCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">Admins</p>
                        <ShieldCheck className="h-5 w-5 text-violet-600" />
                    </div>
                    <p className="mt-3 text-3xl font-bold text-gray-900">
                        {adminCount}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        On this page
                    </p>
                </div>
            </div>

            {/* Feedback */}
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

            {/* Search and filter */}
            <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 outline-none focus:border-emerald-500"
                >
                    <option value="all">All roles</option>
                    <option value="student">Students</option>
                    <option value="tutor">Tutors</option>
                    <option value="admin">Admins</option>
                </select>
            </div>

            {/* Users list */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="font-bold text-gray-900">
                            Registered Users
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            Showing {filteredUsers.length} of {pagination.total} users on this page
                        </p>
                    </div>
                    <span className="text-xs text-gray-400">
                        Page {pagination.page} of {Math.max(1, pagination.totalPages)}
                    </span>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="px-5 py-16 text-center">
                        <Users className="mx-auto h-10 w-10 text-gray-300" />
                        <h3 className="mt-3 font-semibold text-gray-800">
                            No users found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try changing your search or role filter.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredUsers.map((user) => {
                            const isCurrentUser =
                                user.email === currentUser?.email;

                            return (
                                <div
                                    key={user.id}
                                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.name}
                                                className="h-12 w-12 shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                                                <UserRound className="h-6 w-6" />
                                            </div>
                                        )}

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="truncate font-semibold text-gray-900">
                                                    {user.name || "Unnamed user"}
                                                </h3>
                                                {isCurrentUser && (
                                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                                                        YOU
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 break-all text-sm text-gray-500">
                                                {user.email}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${roleStyles[user.role]}`}
                                                >
                                                    {user.role}
                                                </span>

                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-700">
                                                    <Crown className="h-3 w-3" />
                                                    {user.plan || "free"} plan
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:min-w-40">
                                        <label className="text-xs font-medium text-gray-500">
                                            Change user role
                                        </label>
                                        <select
                                            value={user.role}
                                            disabled={
                                                updatingId === user.id ||
                                                isCurrentUser
                                            }
                                            onChange={(event) =>
                                                handleRoleChange(
                                                    user.id,
                                                    event.target.value as UserRole
                                                )
                                            }
                                            className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm capitalize text-gray-700 outline-none focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
                                        >
                                            <option value="student">Student</option>
                                            <option value="tutor">Tutor</option>
                                            <option value="admin">Admin</option>
                                        </select>

                                        {updatingId === user.id && (
                                            <span className="flex items-center gap-1 text-xs text-emerald-600">
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                Updating...
                                            </span>
                                        )}

                                        {isCurrentUser && (
                                            <span className="text-xs text-gray-400">
                                                You cannot change your own role here.
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                    <p className="text-xs text-gray-500">
                        {pagination.total} total users
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => fetchUsers(pagination.page - 1)}
                            disabled={pagination.page <= 1 || loading}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </button>

                        <button
                            onClick={() => fetchUsers(pagination.page + 1)}
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
        </div>
    );
}
