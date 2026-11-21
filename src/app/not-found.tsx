
import Link from "next/link";
import { BookOpen, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#f5faf7] px-5 py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl bg-[#e2f1e9]">
          <BookOpen className="h-12 w-12 text-[#267653]" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-[#267653]">
          Error 404
        </p>

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Page not found
        </h1>

        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
          It may have been moved or the link may be incorrect.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[#267653] px-6 py-3 font-semibold text-white transition hover:bg-[#1d6042]"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-xl border border-[#267653] bg-white px-6 py-3 font-semibold text-[#267653] transition hover:bg-[#eaf4ee]"
          >
            <Search className="h-4 w-4" />
            Browse Tuitions
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-400">
          MentorLagbe — Find your perfect tutor.
        </p>
      </div>
    </main>
  );
}
