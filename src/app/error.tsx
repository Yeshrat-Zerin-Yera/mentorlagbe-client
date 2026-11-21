
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("MentorLagbe application error:", error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f5faf7] px-5 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-red-50">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-red-500">
          Something went wrong
        </p>

        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          We encountered an error
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-600">
          An unexpected error occurred. Please try again.
          If the problem continues, return to the homepage.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white transition hover:bg-[#1d6042]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#267653] bg-white px-6 py-3 font-semibold text-[#267653] transition hover:bg-[#eaf4ee]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400">
            Error reference: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
