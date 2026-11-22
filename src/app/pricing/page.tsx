
"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Check,
    GraduationCap,
    Loader2,
    Sparkles,
    BookOpen,
    Users,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { API_ORIGIN as API_URL } from "@/lib/api";

export default function PricingPage() {
    const { data: session, isPending } = authClient.useSession();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const user = session?.user;
    const role =
        (user as typeof user & { role?: string } | null)?.role || "";

    const isStudent = role === "student";
    const isTutor = role === "tutor";
    const isLoggedIn = !!user;

    const handleUpgrade = async () => {
        setError("");

        if (!user) {
            window.location.href = "/sign-in";
            return;
        }

        if (role !== "student" && role !== "tutor") {
            const message = "Only student and tutor accounts can purchase Pro plans.";
            setError(message);
            toast.error(message);
            return;
        }

        setLoading(true);
        toast.loading("Preparing your secure checkout...", {
            id: "stripe-checkout",
        });

        try {

            const { data: tokenData, error: tokenError } = await authClient.token();

            const token = tokenData?.token;

            if (tokenError || !token) {
                const message = "Your session has expired. Please sign in again.";
                setError(message);
                toast.error(message);
                return;
            }


            const response = await fetch(
                `${API_URL}/api/payments/create-checkout-session`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success || !result.url) {
                throw new Error(
                    result.message || "Unable to create checkout session."
                );
            }
            toast.dismiss("stripe-checkout");
            window.location.href = result.url;
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            setError(message);
            toast.dismiss("stripe-checkout");
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#f8faf9] px-5 py-16">
            <div className="mx-auto max-w-7xl">
                {/* Heading */}
                <div className="mx-auto mb-14 max-w-2xl text-center">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#e8f4f1] px-4 py-2 text-sm font-bold text-[#087f78]">
                        <Sparkles size={16} />
                        Simple and transparent pricing
                    </span>

                    <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-[#142b35] sm:text-5xl">
                        Choose the right plan for you
                    </h1>

                    <p className="mt-5 text-base leading-7 text-[#64777d]">
                        Start for free and upgrade when you're ready for more
                        opportunities with MentorLagbe.
                    </p>
                </div>

                {/* Current Account */}
                {!isPending && user && (
                    <div className="mx-auto mb-8 max-w-3xl rounded-xl border border-[#cce5dc] bg-white px-5 py-4 text-center">
                        <p className="text-sm text-[#64777d]">
                            Signed in as{" "}
                            <span className="font-bold text-[#142b35]">
                                {user.name}
                            </span>
                            {" "}·{" "}
                            <span className="font-semibold capitalize text-[#087f78]">
                                {role}
                            </span>
                        </p>
                    </div>
                )}

                {/* Pricing Cards */}
                <div className="mx-auto grid max-w-5xl gap-7 md:grid-cols-2">
                    {/* Student Plan */}
                    <section className="flex flex-col rounded-3xl border border-[#e3ece9] bg-white p-7 shadow-sm sm:p-9">
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f4f1] text-[#087f78]">
                            <GraduationCap size={30} />
                        </div>

                        <p className="text-sm font-bold uppercase tracking-wider text-[#087f78]">
                            Student Pro
                        </p>

                        <h2 className="mt-2 text-3xl font-extrabold text-[#142b35]">
                            $10
                            <span className="text-base font-medium text-[#64777d]">
                                {" "}/ month
                            </span>
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#64777d]">
                            Get more opportunities to connect with tutors and
                            prioritize your learning journey.
                        </p>

                        <div className="my-7 h-px bg-[#e3ece9]" />

                        <ul className="flex-1 space-y-4 text-sm text-[#536970]">
                            {[
                                "Apply for available tuition opportunities",
                                "Priority booking",
                                "Manage your applications",
                                "Track application status",
                            ].map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <Check
                                        size={18}
                                        className="mt-0.5 shrink-0 text-[#087f78]"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={handleUpgrade}
                            disabled={loading || isPending || (isLoggedIn && !isStudent)}
                            className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#06645f] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && isStudent ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : null}

                            {isPending
                                ? "Loading..."
                                : !isLoggedIn
                                    ? "Sign In to Upgrade"
                                    : isStudent
                                        ? "Upgrade to Student Pro"
                                        : "Student Plan"}
                        </button>
                    </section>

                    {/* Tutor Plan */}
                    <section className="relative flex flex-col rounded-3xl border-2 border-[#087f78] bg-white p-7 shadow-lg sm:p-9">
                        <span className="absolute -top-3 right-7 rounded-full bg-[#087f78] px-4 py-1.5 text-xs font-bold text-white">
                            BEST FOR TUTORS
                        </span>

                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f4f1] text-[#087f78]">
                            <BookOpen size={28} />
                        </div>

                        <p className="text-sm font-bold uppercase tracking-wider text-[#087f78]">
                            Tutor Pro
                        </p>

                        <h2 className="mt-2 text-3xl font-extrabold text-[#142b35]">
                            $15
                            <span className="text-base font-medium text-[#64777d]">
                                {" "}/ month
                            </span>
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-[#64777d]">
                            Grow your tutoring opportunities and manage more
                            tuition posts with a Pro account.
                        </p>

                        <div className="my-7 h-px bg-[#e3ece9]" />

                        <ul className="flex-1 space-y-4 text-sm text-[#536970]">
                            {[
                                "Unlimited tuition posts",
                                "Verified tutor badge",
                                "Manage student applications",
                                "Grow your tutoring profile",
                            ].map((feature) => (
                                <li key={feature} className="flex items-start gap-3">
                                    <Check
                                        size={18}
                                        className="mt-0.5 shrink-0 text-[#087f78]"
                                    />
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            onClick={handleUpgrade}
                            disabled={loading || isPending || (isLoggedIn && !isTutor)}
                            className="mt-9 flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#06645f] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading && isTutor ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : null}

                            {isPending
                                ? "Loading..."
                                : !isLoggedIn
                                    ? "Sign In to Upgrade"
                                    : isTutor
                                        ? "Upgrade to Tutor Pro"
                                        : "Tutor Plan"}
                        </button>
                    </section>
                </div>

                {/* Free Plan */}
                <div className="mx-auto mt-10 max-w-5xl rounded-2xl border border-[#e3ece9] bg-white p-7 sm:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <div className="flex items-center gap-2">
                                <Users size={21} className="text-[#087f78]" />
                                <h2 className="text-xl font-bold text-[#142b35]">
                                    Free Plan
                                </h2>
                            </div>

                            <p className="mt-2 text-sm text-[#64777d]">
                                Get started with the essential MentorLagbe features.
                            </p>

                            <p className="mt-3 text-2xl font-extrabold text-[#142b35]">
                                $0
                                <span className="text-sm font-medium text-[#64777d]">
                                    {" "}/ forever
                                </span>
                            </p>
                        </div>

                        <div className="text-sm leading-7 text-[#536970]">
                            <p>✓ Browse and explore tuition opportunities</p>
                            <p>✓ Manage your account and profile</p>
                            <p>✓ Tutors can create up to 2 tuition posts</p>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div
                        role="alert"
                        className="mx-auto mt-8 max-w-3xl rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
                    >
                        {error}
                    </div>
                )}

                {/* Footer Note */}
                <p className="mt-10 text-center text-sm text-[#819096]">
                    Secure payments powered by Stripe. Your Pro plan will be
                    activated after successful payment verification.
                </p>
            </div>
        </main>
    );
}
