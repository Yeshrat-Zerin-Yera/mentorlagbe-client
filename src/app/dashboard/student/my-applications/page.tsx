
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Mail,
  MapPin,
  Trash2,
  XCircle,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_ORIGIN as API_URL } from "@/lib/api";
import { toast } from "sonner";

type Application = {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject?: string;
  monthlyFee: number;
  tutorName?: string;
  tutorEmail: string;
  appliedAt: string;
  status: "pending" | "accepted" | "rejected";
};

type ApplicationsResponse = {
  success: boolean;
  message: string;
  data: Application[];
};

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function MyApplicationsPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as typeof user & { role?: string })?.role;

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cancellingId, setCancellingId] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!user || role !== "student") {
      setLoading(false);
      return;
    }

    const loadApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const response = await fetch(
          `${API_URL}/api/applications/mine?limit=50&page=1`,
          {
            headers: {
              Authorization: `Bearer ${tokenData.token}`,
            },
            cache: "no-store",
          }
        );

        const result: ApplicationsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to load applications.");
        }

        setApplications(result.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while loading applications."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadApplications();
  }, [isPending, user, role]);

  const handleCancel = async (application: Application) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this application?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(application._id);
      setError("");
      setSuccess("");

      const { data: tokenData, error: tokenError } =
        await authClient.token();

      if (tokenError || !tokenData?.token) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/applications/mine/${application._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to cancel application.");
      }

      setApplications((current) =>
        current.filter((item) => item._id !== application._id)
      );

      const message = "Your application was cancelled successfully.";

      setSuccess(message);
      toast.success(message);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setCancellingId("");
    }
  };

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "rejected"
  ).length;

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8]">
        <div className="flex items-center gap-3 text-[#477c68]">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading your applications...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#477c68]" />
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to continue
          </h1>
          <p className="mt-2 text-gray-600">
            Please sign in with your student account to view your applications.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white transition hover:bg-[#1e6042]"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (role !== "student") {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <BookOpen className="mx-auto mb-4 h-12 w-12 text-[#477c68]" />
          <h1 className="text-2xl font-bold text-gray-900">
            Student access only
          </h1>
          <p className="mt-2 text-gray-600">
            This page is available only to student accounts.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white transition hover:bg-[#1e6042]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#267653]">
            Student Dashboard
          </p>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            My Applications
          </h1>
          <p className="mt-2 text-gray-600">
            Track your tuition applications and manage pending requests.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Applications"
            value={applications.length}
            icon={<BookOpen className="h-6 w-6" />}
            color="bg-[#e8f3ed] text-[#267653]"
          />
          <SummaryCard
            label="Pending"
            value={pendingCount}
            icon={<Clock className="h-6 w-6" />}
            color="bg-amber-100 text-amber-700"
          />
          <SummaryCard
            label="Accepted"
            value={acceptedCount}
            icon={<CheckCircle2 className="h-6 w-6" />}
            color="bg-emerald-100 text-emerald-700"
          />
          <SummaryCard
            label="Rejected"
            value={rejectedCount}
            icon={<XCircle className="h-6 w-6" />}
            color="bg-red-100 text-red-700"
          />
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Applications */}
        {applications.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <BookOpen className="mx-auto mb-4 h-14 w-14 text-gray-300" />
            <h2 className="text-xl font-bold text-gray-900">
              No applications yet
            </h2>
            <p className="mx-auto mt-2 max-w-md text-gray-500">
              You have not applied for any tuition yet. Explore available
              tuitions and send your first application.
            </p>
            <Link
              href="/tuitions"
              className="mt-6 inline-flex rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white transition hover:bg-[#1e6042]"
            >
              Browse Tuitions
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {applications.map((application) => (
              <article
                key={application._id}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[application.status]
                          }`}
                      >
                        {application.status}
                      </span>
                      {application.subject && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                          {application.subject}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">
                      {application.tuitionTitle}
                    </h2>

                    <div className="mt-4 grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                      <p className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 shrink-0 text-[#477c68]" />
                        Tutor: {application.tutorName || "Tutor"}
                      </p>

                      <p className="flex items-center gap-2 break-all">
                        <Mail className="h-4 w-4 shrink-0 text-[#477c68]" />
                        {application.tutorEmail}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#477c68]" />
                        Applied:{" "}
                        {new Intl.DateTimeFormat("en-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(application.appliedAt))}
                      </p>

                      <p className="flex items-center gap-2 font-semibold text-gray-900">
                        <MapPin className="h-4 w-4 shrink-0 text-[#477c68]" />
                        Monthly Fee: ৳
                        {Number(application.monthlyFee).toLocaleString("en-BD")}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-3 sm:flex-col sm:items-end">
                    <Link
                      href={`/tuitions/${application.tuitionId}`}
                      className="rounded-lg border border-[#267653] px-4 py-2 text-sm font-semibold text-[#267653] transition hover:bg-[#e8f3ed]"
                    >
                      View Tuition
                    </Link>

                    {application.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => void handleCancel(application)}
                        disabled={cancellingId === application._id}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {cancellingId === application._id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        {cancellingId === application._id
                          ? "Cancelling..."
                          : "Cancel Application"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
