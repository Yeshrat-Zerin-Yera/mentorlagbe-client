
import Link from "next/link";
import { Search } from "lucide-react";

export default function TuitionSearch() {
  return (
    <section className="relative z-10 mx-auto -mt-8 max-w-5xl px-5">
      <form
        action="/tuitions"
        className="grid gap-3 rounded-2xl border border-[#e3ece9] bg-white p-4 shadow-xl shadow-[#142b35]/5 sm:grid-cols-[1fr_auto] sm:p-5"
      >
        <div className="flex items-center gap-3 px-2">
          <Search className="shrink-0 text-[#087f78]" size={22} />
          <input
            name="search"
            type="search"
            placeholder="Search by subject, class, or tuition title..."
            className="w-full bg-transparent py-3 text-sm text-[#142b35] outline-none placeholder:text-[#91a1a5]"
          />
        </div>

        <button
          type="submit"
          className="rounded-xl bg-[#087f78] px-8 py-3 font-bold text-white transition hover:bg-[#06645f]"
        >
          Find a Tutor
        </button>
      </form>
    </section>
  );
}
