
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, UserRound, BookOpen, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type UserRole = "student" | "tutor";

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("student");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (name.trim().length < 2) {
            setError("Name must contain at least 2 characters.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const signUpOptions = {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
            };

            const { error: signUpError } = await authClient.signUp.email(
                signUpOptions as Parameters<typeof authClient.signUp.email>[0]
            );
            if (signUpError) {
                const message = signUpError.message || "Registration failed. Please try again.";
                setError(message);
                toast.error(message);
                return;
            }

            toast.success("Account created successfully!");
            router.push("/sign-in?registered=true");
        } catch {
            const message = "Something went wrong. Please try again.";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-[80vh] items-center justify-center px-5 py-16">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#087f78] text-white">
                        <GraduationCap size={30} />
                    </div>

                    <h1 className="text-3xl font-extrabold text-[#142b35]">
                        Create your account
                    </h1>

                    <p className="mt-2 text-sm text-[#64777d]">
                        Join MentorLagbe and start your learning journey.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-[#e3ece9] bg-white p-6 shadow-sm sm:p-8"
                >
                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-semibold text-[#142b35]"
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Enter your full name"
                            required
                            minLength={2}
                            autoComplete="name"
                            className="w-full rounded-xl border border-[#dce7e3] px-4 py-3 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-semibold text-[#142b35]"
                        >
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className="w-full rounded-xl border border-[#dce7e3] px-4 py-3 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-semibold text-[#142b35]"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="At least 8 characters"
                            required
                            minLength={8}
                            autoComplete="new-password"
                            className="w-full rounded-xl border border-[#dce7e3] px-4 py-3 text-sm outline-none transition focus:border-[#087f78] focus:ring-2 focus:ring-[#087f78]/10"
                        />

                        <p className="mt-1.5 text-xs text-[#819096]">
                            Use at least 8 characters.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-3 block text-sm font-semibold text-[#142b35]">
                            I want to join as
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("student")}
                                className={`rounded-xl border p-4 text-left transition ${role === "student"
                                    ? "border-[#087f78] bg-[#e8f4f1] ring-1 ring-[#087f78]"
                                    : "border-[#dce7e3] hover:border-[#087f78]"
                                    }`}
                            >
                                <UserRound
                                    size={22}
                                    className={
                                        role === "student" ? "text-[#087f78]" : "text-[#64777d]"
                                    }
                                />
                                <span className="mt-2 block text-sm font-bold text-[#142b35]">
                                    Student
                                </span>
                                <span className="mt-1 block text-xs text-[#64777d]">
                                    Find a tutor
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setRole("tutor")}
                                className={`rounded-xl border p-4 text-left transition ${role === "tutor"
                                    ? "border-[#087f78] bg-[#e8f4f1] ring-1 ring-[#087f78]"
                                    : "border-[#dce7e3] hover:border-[#087f78]"
                                    }`}
                            >
                                <BookOpen
                                    size={22}
                                    className={
                                        role === "tutor" ? "text-[#087f78]" : "text-[#64777d]"
                                    }
                                />
                                <span className="mt-2 block text-sm font-bold text-[#142b35]">
                                    Tutor
                                </span>
                                <span className="mt-1 block text-xs text-[#64777d]">
                                    Teach students
                                </span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#06645f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="mt-6 text-center text-sm text-[#64777d]">
                        Already have an account?{" "}
                        <Link
                            href="/sign-in"
                            className="font-bold text-[#087f78] hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </form>
            </div>
        </main>
    );
}
