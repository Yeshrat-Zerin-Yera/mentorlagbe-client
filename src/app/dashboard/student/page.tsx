
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  GraduationCap,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { API_ORIGIN as API_URL } from "@/lib/api";

type Application = {
  _id: string;
  tuitionId: string;
  tuitionTitle: string;
  subject?: string;
  monthlyFee: number;
  tutorName?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
};

type ApplicationsResponse = {
  success: boolean;
  message: string;
  data: Application[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type PlanResponse = {
  success?: boolean;
  data?: { plan?: string };
  user?: { plan?: string };
  plan?: string;
};

export default function StudentDashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const role = (user as typeof user & { role?: string })?.role;

  const [applications, setApplications] = useState<Application[]>([]);
  const [totalApplications, setTotalApplications] = useState(0);
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!user || role !== "student") {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const { data: tokenData, error: tokenError } =
          await authClient.token();

        if (tokenError || !tokenData?.token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const headers = {
          Authorization: `Bearer ${tokenData.token}`,
        };

        const [applicationsResponse, profileResponse] = await Promise.all([
          fetch(`${API_URL}/api/applications/mine?limit=50&page=1`, {
            headers,
            cache: "no-store",
          }),
          fetch(`${API_URL}/api/users/me`, {
            headers,
            cache: "no-store",
          }),
        ]);

        const applicationsResult =
          (await applicationsResponse.json()) as ApplicationsResponse;

        if (!applicationsResponse.ok || !applicationsResult.success) {
          throw new Error(
            applicationsResult.message || "Failed to load applications."
          );
        }

        const applicationList = applicationsResult.data || [];

        setApplications(applicationList);
        setTotalApplications(
          applicationsResult.pagination?.total ?? applicationList.length
        );

        if (profileResponse.ok) {
          const profileResult = (await profileResponse.json()) as PlanResponse;

          const currentPlan =
            profileResult.data?.plan ||
            profileResult.user?.plan ||
            profileResult.plan;

          if (currentPlan) {
            setPlan(currentPlan.toLowerCase());
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [isPending, user, role]);

  const acceptedCount = applications.filter(
    (application) => application.status === "accepted"
  ).length;

  const pendingCount = applications.filter(
    (application) => application.status === "pending"
  ).length;

  if (isPending || loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8]">
        <div className="flex items-center gap-3 text-[#477c68]">
          <LoaderCircle className="h-6 w-6 animate-spin" />
          <span className="font-medium">Loading your dashboard...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-5">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <GraduationCap className="mx-auto mb-4 h-12 w-12 text-[#267653]" />
          <h1 className="text-2xl font-bold text-gray-900">
            Sign in to your dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Please sign in with your student account to continue.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white hover:bg-[#1e6042]"
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
          <UserRound className="mx-auto mb-4 h-12 w-12 text-[#267653]" />
          <h1 className="text-2xl font-bold text-gray-900">
            Student access only
          </h1>
          <p className="mt-2 text-gray-600">
            This dashboard is available only to student accounts.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white hover:bg-[#1e6042]"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const stats = [
    {
      label: "Total Applied Tuitions",
      value: totalApplications,
      icon: <BookOpen className="h-6 w-6" />,
      style: "bg-[#e8f3ed] text-[#267653]",
    },
    {
      label: "Accepted Applications",
      value: acceptedCount,
      icon: <CheckCircle2 className="h-6 w-6" />,
      style: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Pending Applications",
      value: pendingCount,
      icon: <Clock className="h-6 w-6" />,
      style: "bg-amber-100 text-amber-700",
    },
    {
      label: "Current Plan",
      value: plan === "pro" ? "Pro" : "Free",
      icon: <Crown className="h-6 w-6" />,
      style: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome */}
        <section className="mb-8 flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#174d37] to-[#31815d] p-6 text-white sm:flex-row sm:items-center sm:p-8">
          <div>
            <p className="mb-2 text-sm font-medium text-green-100">
              STUDENT DASHBOARD
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Welcome back, {user.name || "Student"}!
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
              Keep track of your tuition applications and find the right
              learning opportunities for your goals.
            </p>
          </div>

          <Link
            href="/tuitions"
            className="text-black inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#267653] transition hover:bg-green-50"
          >
            Browse Tuitions
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Profile Summary */}
        <section className="mb-8 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e8f3ed] text-[#267653]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "Student"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound className="h-7 w-7" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-gray-900">
                {user.name || "Student"}
              </h2>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
              <span className="mt-1 inline-flex rounded-full bg-[#e8f3ed] px-3 py-1 text-xs font-semibold capitalize text-[#267653]">
                Student Account
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/profile"
            className="inline-flex items-center justify-center rounded-lg border border-[#267653] px-4 py-2.5 text-sm font-semibold text-[#267653] transition hover:bg-[#e8f3ed]"
          >
            Update Profile
          </Link>
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900">
              Your Overview
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick look at your learning activity.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.style}`}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Applications */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Check the latest updates on your tuition applications.
              </p>
            </div>

            <Link
              href="/dashboard/student/my-applications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#267653] hover:underline"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-xl bg-[#f7faf8] px-5 py-10 text-center">
              <BookOpen className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <h3 className="font-semibold text-gray-900">
                No applications yet
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Browse available tuitions and submit your first application.
              </p>
              <Link
                href="/tuitions"
                className="mt-4 inline-flex rounded-lg bg-[#267653] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1e6042]"
              >
                Explore Tuitions
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((application) => (
                <div
                  key={application._id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/tuitions/${application.tuitionId}`}
                      className="font-semibold text-gray-900 hover:text-[#267653]"
                    >
                      {application.tuitionTitle}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      {application.subject || "Tuition"} ·{" "}
                      {application.tutorName || "Tutor"}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        application.status === "accepted"
                          ? "bg-emerald-100 text-emerald-700"
                          : application.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {application.status}
                    </span>

                    <span className="text-sm font-semibold text-gray-800">
                      ৳{Number(application.monthlyFee).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Plan Upgrade */}
        {plan !== "pro" && (
          <section className="mt-8 flex flex-col justify-between gap-5 rounded-2xl border border-violet-100 bg-violet-50 p-6 sm:flex-row sm:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-violet-700">
                <Crown className="h-5 w-5" />
                <span className="font-bold">Upgrade your learning plan</span>
              </div>
              <p className="text-sm leading-6 text-gray-600">
                Explore the Pro Student Plan and its priority booking benefits.
              </p>
            </div>

            <Link
              href="/pricing"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-800"
            >
              Explore Pro Plan
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
