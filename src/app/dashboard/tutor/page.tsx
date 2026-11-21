
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  BookOpen,
  CheckCircle2,
  Users,
  Crown,
  Plus,
  ArrowRight,
  Clock,
  LoaderCircle,
} from "lucide-react";
import { API_ORIGIN as API_URL } from "@/lib/api";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  monthlyFee: number;
  approvalStatus: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: string;
};

type DashboardData = {
  totalTuitions: number;
  activeTuitions: number;
  totalApplicants: number | null;
  plan: string;
  tuitions: Tuition[];
};

export default function TutorDashboardPage() {
  const { data: session, isPending } = authClient.useSession();

  const [dashboard, setDashboard] = useState<DashboardData>({
    totalTuitions: 0,
    activeTuitions: 0,
    totalApplicants: null,
    plan: "free",
    tuitions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const tokenResponse = await authClient.token();
        const token = tokenResponse.data?.token;

        if (tokenResponse.error || !token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [tuitionResponse, applicantResponse, profileResponse] =
          await Promise.all([
            fetch(`${API_URL}/api/tuitions/mine?limit=50&page=1`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/applications/tutor?limit=50&page=1`, {
              headers,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/users/me`, {
              headers,
              cache: "no-store",
            }),
          ]);

        const [tuitionResult, applicantResult, profileResult] =
          await Promise.all([
            tuitionResponse.json(),
            applicantResponse.json(),
            profileResponse.json(),
          ]);

        if (!tuitionResponse.ok || !tuitionResult.success) {
          throw new Error(
            tuitionResult.message || "Could not load your tuitions."
          );
        }

        if (!profileResponse.ok || !profileResult.success) {
          throw new Error(
            profileResult.message || "Could not load your account information."
          );
        }

        const tuitions: Tuition[] = Array.isArray(tuitionResult.data)
          ? tuitionResult.data
          : [];

        const activeTuitions = tuitions.filter(
          (tuition) =>
            tuition.approvalStatus === "approved" && tuition.isActive
        ).length;

        const totalTuitions =
          tuitionResult.pagination?.total ?? tuitions.length;

        const applicantData = Array.isArray(applicantResult.data)
          ? applicantResult.data
          : [];

        const totalApplicants = applicantResponse.ok && applicantResult.success
          ? applicantResult.pagination?.total ?? applicantData.length
          : null;

        const profile = profileResult.data;

        setDashboard({
          totalTuitions,
          activeTuitions,
          totalApplicants,
          plan: profile.plan || "free",
          tuitions: tuitions.slice(0, 5),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, [isPending, session]);

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[#267653]" />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const stats = [
    {
      title: "Total Tuitions Posted",
      value: dashboard.totalTuitions,
      description: "All your tuition posts",
      icon: <BookOpen size={23} />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active / Approved Tuitions",
      value: dashboard.activeTuitions,
      description: "Approved and currently active",
      icon: <CheckCircle2 size={23} />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Applicants Received",
      value: dashboard.totalApplicants ?? "—",
      description:
        dashboard.totalApplicants === null
          ? "Could not load applicant count"
          : "Students who applied to your tuitions",
      icon: <Users size={23} />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Current Plan",
      value: dashboard.plan,
      description: "Your subscription plan",
      icon: <Crown size={23} />,
      color: "bg-amber-50 text-amber-600",
      capitalize: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8 flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-[#1d6042] to-[#348b65] p-6 text-white sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-sm font-medium text-green-100">
            TUTOR DASHBOARD
          </p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
            Welcome back, {session.user.name || "Tutor"}!
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-green-50">
            Manage your tuition posts, track student applications, and grow
            your teaching opportunities.
          </p>
        </div>

        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#267653] transition hover:bg-green-50"
        >
          <Plus size={18} />
          Post a Tuition
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900">
          Your Overview
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>

              <p className="mt-5 text-sm font-medium text-gray-500">
                {stat.title}
              </p>

              <p
                className={`mt-2 text-3xl font-bold text-gray-900 ${
                  stat.capitalize ? "capitalize" : ""
                }`}
              >
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-5 md:grid-cols-2">
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#b9d9c7] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e8f3ed] text-[#267653]">
              <BookOpen size={23} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Manage My Tuitions</h3>
              <p className="mt-1 text-sm text-gray-500">
                View and manage your tuition posts.
              </p>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#267653]"
          />
        </Link>

        <Link
          href="/dashboard/tutor/applicants"
          className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:border-[#b9d9c7] hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Users size={23} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">View Applicants</h3>
              <p className="mt-1 text-sm text-gray-500">
                Review students applying to your tuitions.
              </p>
            </div>
          </div>
          <ArrowRight
            size={20}
            className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-purple-600"
          />
        </Link>
      </div>

      {/* Recent Tuitions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Your Recent Tuitions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick look at your latest tuition posts.
            </p>
          </div>

          <Link
            href="/dashboard/tutor/my-tuitions"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#267653] hover:underline"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>

        {dashboard.tuitions.length === 0 ? (
          <div className="rounded-xl bg-[#f7faf8] px-5 py-10 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-700">
              You haven't posted any tuitions yet.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create your first tuition post to get started.
            </p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#267653] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1d6042]"
            >
              <Plus size={17} />
              Post a Tuition
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard.tuitions.map((tuition) => (
              <div
                key={tuition._id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 p-4 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {tuition.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {tuition.subject} · ৳{tuition.monthlyFee}/month
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                      tuition.approvalStatus === "approved"
                        ? "bg-green-50 text-green-700"
                        : tuition.approvalStatus === "rejected"
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <Clock size={13} />
                    {tuition.approvalStatus}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      tuition.isActive
                        ? "bg-blue-50 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tuition.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
