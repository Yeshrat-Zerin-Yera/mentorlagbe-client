
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    Eye,
    Loader2,
    RefreshCw,
    X,
    BookOpen,
    MapPin,
    CalendarDays,
    Users,
} from "lucide-react";

const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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
    approvalStatus: "pending" | "approved" | "rejected";
    isActive: boolean;
    createdAt: string;
};

type EditForm = {
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: string;
    daysPerWeek: string;
    bannerImage: string;
    description: string;
};

const emptyEditForm: EditForm = {
    title: "",
    subject: "",
    classLevel: "",
    mode: "Online",
    location: "",
    monthlyFee: "",
    daysPerWeek: "3",
    bannerImage: "",
    description: "",
};

export default function MyTuitionsPage() {
    const { data: session, isPending } = authClient.useSession();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [editingTuition, setEditingTuition] =
        useState<Tuition | null>(null);
    const [editForm, setEditForm] =
        useState<EditForm>(emptyEditForm);
    const [editError, setEditError] = useState("");
    const [saving, setSaving] = useState(false);

    const [actionId, setActionId] = useState("");
    const [message, setMessage] = useState("");

    const user = session?.user;
    const role = (user as typeof user & { role?: string })?.role;

    const getToken = async () => {
        const { data, error } = await authClient.token();

        if (error || !data?.token) {
            throw new Error("Your session has expired. Please sign in again.");
        }

        return data.token;
    };

    const fetchTuitions = useCallback(async () => {
        setLoading(true);
        setPageError("");

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/tuitions/mine`,
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
                    result.message || "Failed to load your tuition posts."
                );
            }

            setTuitions(
                Array.isArray(result.data) ? result.data : []
            );
        } catch (error) {
            setPageError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isPending && session && role === "tutor") {
            fetchTuitions();
        } else if (!isPending) {
            setLoading(false);
        }
    }, [isPending, session, role, fetchTuitions]);

    const openEditModal = (tuition: Tuition) => {
        setEditingTuition(tuition);
        setEditError("");
        setEditForm({
            title: tuition.title || "",
            subject: tuition.subject || "",
            classLevel: tuition.classLevel || "",
            mode: tuition.mode || "Online",
            location: tuition.location || "",
            monthlyFee: String(tuition.monthlyFee ?? ""),
            daysPerWeek: String(tuition.daysPerWeek ?? 3),
            bannerImage: tuition.bannerImage || "",
            description: tuition.description || "",
        });
    };

    const closeEditModal = () => {
        if (saving) return;

        setEditingTuition(null);
        setEditError("");
        setEditForm(emptyEditForm);
    };

    const handleEditChange = (
        field: keyof EditForm,
        value: string
    ) => {
        setEditForm((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const handleUpdate = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!editingTuition) return;

        setEditError("");
        setMessage("");

        if (
            !editForm.title.trim() ||
            !editForm.subject.trim() ||
            !editForm.classLevel.trim() ||
            !editForm.location.trim() ||
            !editForm.description.trim()
        ) {
            setEditError("Please complete all required fields.");
            return;
        }

        const monthlyFee = Number(editForm.monthlyFee);
        const daysPerWeek = Number(editForm.daysPerWeek);

        if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
            setEditError("Monthly fee must be greater than zero.");
            return;
        }

        if (
            !Number.isInteger(daysPerWeek) ||
            daysPerWeek < 1 ||
            daysPerWeek > 7
        ) {
            setEditError("Days per week must be between 1 and 7.");
            return;
        }

        if (editForm.bannerImage.trim()) {
            try {
                const imageUrl = new URL(editForm.bannerImage.trim());

                if (
                    !["http:", "https:"].includes(imageUrl.protocol)
                ) {
                    throw new Error();
                }
            } catch {
                setEditError("Please provide a valid HTTP or HTTPS image URL.");
                return;
            }
        }

        setSaving(true);

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/tuitions/${editingTuition._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        title: editForm.title.trim(),
                        subject: editForm.subject.trim(),
                        classLevel: editForm.classLevel.trim(),
                        mode: editForm.mode,
                        location: editForm.location.trim(),
                        monthlyFee,
                        daysPerWeek,
                        bannerImage: editForm.bannerImage.trim(),
                        description: editForm.description.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update tuition."
                );
            }

            setTuitions((previous) =>
                previous.map((tuition) =>
                    tuition._id === editingTuition._id
                        ? result.data
                        : tuition
                )
            );

            setEditingTuition(null);
            setEditForm(emptyEditForm);
            setMessage(
                "Tuition updated successfully. It is now waiting for admin approval."
            );
        } catch (error) {
            setEditError(
                error instanceof Error
                    ? error.message
                    : "Failed to update tuition."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async (tuition: Tuition) => {
        setActionId(tuition._id);
        setMessage("");
        setPageError("");

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/tuitions/${tuition._id}/active`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        isActive: !tuition.isActive,
                    }),
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to update tuition status."
                );
            }

            setTuitions((previous) =>
                previous.map((item) =>
                    item._id === tuition._id
                        ? { ...item, isActive: !item.isActive }
                        : item
                )
            );

            setMessage(result.message || "Tuition status updated.");
        } catch (error) {
            setPageError(
                error instanceof Error
                    ? error.message
                    : "Failed to update tuition status."
            );
        } finally {
            setActionId("");
        }
    };

    const handleDelete = async (tuition: Tuition) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${tuition.title}"? This action cannot be undone.`
        );

        if (!confirmed) return;

        setActionId(tuition._id);
        setMessage("");
        setPageError("");

        try {
            const token = await getToken();

            const response = await fetch(
                `${API_URL}/tuitions/${tuition._id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || "Failed to delete tuition."
                );
            }

            setTuitions((previous) =>
                previous.filter((item) => item._id !== tuition._id)
            );

            setMessage("Tuition post deleted successfully.");
        } catch (error) {
            setPageError(
                error instanceof Error
                    ? error.message
                    : "Failed to delete tuition."
            );
        } finally {
            setActionId("");
        }
    };

    const filteredTuitions = tuitions.filter((tuition) => {
        const query = search.toLowerCase();

        const matchesSearch =
            tuition.title.toLowerCase().includes(query) ||
            tuition.subject.toLowerCase().includes(query) ||
            tuition.classLevel.toLowerCase().includes(query) ||
            tuition.location.toLowerCase().includes(query);

        const matchesStatus =
            statusFilter === "all" ||
            tuition.approvalStatus === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const pendingCount = tuitions.filter(
        (item) => item.approvalStatus === "pending"
    ).length;

    const approvedCount = tuitions.filter(
        (item) => item.approvalStatus === "approved"
    ).length;

    const rejectedCount = tuitions.filter(
        (item) => item.approvalStatus === "rejected"
    ).length;

    const activeCount = tuitions.filter(
        (item) => item.isActive
    ).length;

    const statusStyle = (status: Tuition["approvalStatus"]) => {
        switch (status) {
            case "approved":
                return "bg-emerald-50 text-emerald-700";
            case "rejected":
                return "bg-red-50 text-red-700";
            default:
                return "bg-amber-50 text-amber-700";
        }
    };

    const inputClass =
        "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

    if (isPending || loading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!session || role !== "tutor") {
        return (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                <h2 className="text-xl font-bold text-gray-900">
                    Tutor access required
                </h2>
                <p className="mt-2 text-gray-500">
                    Only tutors can manage tuition posts.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-5 inline-block rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-7">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
                        Tutor Dashboard
                    </p>
                    <h1 className="mt-2 text-3xl font-bold text-gray-900">
                        My Tuitions
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Manage, update, and track your tuition posts.
                    </p>
                </div>

                <Link
                    href="/dashboard/tutor/post-tuition"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                    <Plus size={18} />
                    Post New Tuition
                </Link>
            </div>

            {message && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            {pageError && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <span>{pageError}</span>
                    <button
                        onClick={fetchTuitions}
                        className="font-semibold underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Tuitions",
                        value: tuitions.length,
                        color: "text-gray-900",
                    },
                    {
                        label: "Approved",
                        value: approvedCount,
                        color: "text-emerald-600",
                    },
                    {
                        label: "Pending Review",
                        value: pendingCount,
                        color: "text-amber-600",
                    },
                    {
                        label: "Active Posts",
                        value: activeCount,
                        color: "text-blue-600",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                    >
                        <p className="text-sm text-gray-500">
                            {stat.label}
                        </p>
                        <p className={`mt-2 text-3xl font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                        {approvedCount} Approved
                    </span>
                    <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
                        {pendingCount} Pending
                    </span>
                    <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
                        {rejectedCount} Rejected
                    </span>
                </div>

                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search title, subject, class, or location..."
                            className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500"
                    >
                        <option value="all">All statuses</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>

                    <button
                        onClick={fetchTuitions}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                    >
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>

                <div className="mt-6 space-y-4">
                    {filteredTuitions.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-gray-300 px-5 py-14 text-center">
                            <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
                            <h3 className="mt-4 font-bold text-gray-800">
                                No tuition posts found
                            </h3>
                            <p className="mt-2 text-sm text-gray-500">
                                {tuitions.length === 0
                                    ? "You haven't posted any tuition opportunities yet."
                                    : "Try changing your search or status filter."}
                            </p>
                            {tuitions.length === 0 && (
                                <Link
                                    href="/dashboard/tutor/post-tuition"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white"
                                >
                                    <Plus size={17} />
                                    Create Your First Tuition
                                </Link>
                            )}
                        </div>
                    ) : (
                        filteredTuitions.map((tuition) => (
                            <article
                                key={tuition._id}
                                className="overflow-hidden rounded-2xl border border-gray-100 transition hover:border-emerald-200 hover:shadow-sm"
                            >
                                <div className="flex flex-col gap-5 p-4 sm:flex-row sm:p-5">
                                    {tuition.bannerImage ? (
                                        <img
                                            src={tuition.bannerImage}
                                            alt={tuition.title}
                                            className="h-44 w-full rounded-xl object-cover sm:h-36 sm:w-48"
                                        />
                                    ) : (
                                        <div className="flex h-36 w-full items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 sm:w-48">
                                            <BookOpen size={38} />
                                        </div>
                                    )}

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">
                                                    {tuition.title}
                                                </h3>
                                                <p className="mt-1 text-sm font-medium text-emerald-700">
                                                    {tuition.subject} · {tuition.classLevel}
                                                </p>
                                            </div>

                                            <span
                                                className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize ${statusStyle(tuition.approvalStatus)}`}
                                            >
                                                {tuition.approvalStatus}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
                                            <span className="inline-flex items-center gap-1.5">
                                                <MapPin size={15} />
                                                {tuition.location}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <CalendarDays size={15} />
                                                {tuition.daysPerWeek} days/week
                                            </span>
                                            <span className="inline-flex items-center gap-1.5">
                                                <Users size={15} />
                                                {tuition.mode}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <p className="font-bold text-gray-900">
                                                ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                                                <span className="ml-1 text-xs font-normal text-gray-500">
                                                    / month
                                                </span>
                                            </p>

                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={`/tuitions/${tuition._id}`}
                                                    target="_blank"
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                                                >
                                                    <Eye size={14} />
                                                    View
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        openEditModal(tuition)
                                                    }
                                                    disabled={!!actionId}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleToggleActive(tuition)
                                                    }
                                                    disabled={actionId === tuition._id}
                                                    className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                                                        tuition.isActive
                                                            ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
                                                            : "border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                    }`}
                                                >
                                                    {actionId === tuition._id
                                                        ? "Please wait..."
                                                        : tuition.isActive
                                                          ? "Deactivate"
                                                          : "Activate"}
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(tuition)
                                                    }
                                                    disabled={!!actionId}
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-3 text-xs text-gray-400">
                                            {tuition.isActive
                                                ? "Post is active"
                                                : "Post is inactive"}
                                            {tuition.createdAt &&
                                                ` · Created ${new Date(tuition.createdAt).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>

            {editingTuition && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-8">
                    <div className="my-auto w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-gray-100 p-5 sm:p-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    Edit Tuition
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Changes will be sent for admin approval.
                                </p>
                            </div>

                            <button
                                onClick={closeEditModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label="Close edit form"
                            >
                                <X size={21} />
                            </button>
                        </div>

                        <form
                            onSubmit={handleUpdate}
                            className="space-y-5 p-5 sm:p-6"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Tuition Title *
                                    </label>
                                    <input
                                        value={editForm.title}
                                        onChange={(event) =>
                                            handleEditChange("title", event.target.value)
                                        }
                                        maxLength={150}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Subject *
                                    </label>
                                    <input
                                        value={editForm.subject}
                                        onChange={(event) =>
                                            handleEditChange("subject", event.target.value)
                                        }
                                        maxLength={150}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Class / Level *
                                    </label>
                                    <input
                                        value={editForm.classLevel}
                                        onChange={(event) =>
                                            handleEditChange("classLevel", event.target.value)
                                        }
                                        maxLength={150}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Teaching Mode *
                                    </label>
                                    <select
                                        value={editForm.mode}
                                        onChange={(event) =>
                                            handleEditChange(
                                                "mode",
                                                event.target.value as "Online" | "Offline"
                                            )
                                        }
                                        className={inputClass}
                                    >
                                        <option value="Online">Online</option>
                                        <option value="Offline">Offline</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Location *
                                    </label>
                                    <input
                                        value={editForm.location}
                                        onChange={(event) =>
                                            handleEditChange("location", event.target.value)
                                        }
                                        maxLength={150}
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Monthly Fee (৳) *
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.monthlyFee}
                                        onChange={(event) =>
                                            handleEditChange("monthlyFee", event.target.value)
                                        }
                                        required
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700">
                                        Days Per Week *
                                    </label>
                                    <select
                                        value={editForm.daysPerWeek}
                                        onChange={(event) =>
                                            handleEditChange("daysPerWeek", event.target.value)
                                        }
                                        className={inputClass}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                            <option key={day} value={day}>
                                                {day} {day === 1 ? "day" : "days"}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Banner Image URL
                                    </label>
                                    <input
                                        type="url"
                                        value={editForm.bannerImage}
                                        onChange={(event) =>
                                            handleEditChange("bannerImage", event.target.value)
                                        }
                                        placeholder="https://..."
                                        className={inputClass}
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700">
                                        Description *
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(event) =>
                                            handleEditChange("description", event.target.value)
                                        }
                                        maxLength={3000}
                                        rows={5}
                                        required
                                        className={`${inputClass} resize-y`}
                                    />
                                </div>
                            </div>

                            {editError && (
                                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                                    {editError}
                                </div>
                            )}

                            <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {saving && (
                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />
                                    )}
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
