
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PricingPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold tracking-widest text-[#087f78] uppercase">
          Plans for everyone
        </p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-4xl">
          Grow Further with Pro
        </h2>
        <p className="mt-4 text-[#64777d]">
          Start free and upgrade whenever you are ready for more.
        </p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[#e3ece9] bg-white p-8">
          <p className="font-bold text-[#64777d]">Free Plan</p>
          <h3 className="mt-3 text-4xl font-extrabold text-[#142b35]">
            $0 <span className="text-sm font-medium text-[#64777d]">/ month</span>
          </h3>
          <p className="mt-3 text-sm text-[#64777d]">
            A great way to get started.
          </p>

          <ul className="mt-7 space-y-4 text-sm text-[#536970]">
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Browse and apply to tuitions
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Basic platform features
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Tutors can create up to 2 posts
            </li>
          </ul>
        </div>

        <div className="relative rounded-2xl border-2 border-[#087f78] bg-[#f0f7f4] p-8">
          <span className="absolute -top-3 right-7 rounded-full bg-[#087f78] px-4 py-1 text-xs font-bold text-white">
            Recommended
          </span>

          <p className="font-bold text-[#087f78]">Pro Plan</p>

          <div className="mt-3 space-y-1">
            <p className="text-3xl font-extrabold text-[#142b35]">
              $15 <span className="text-sm font-medium text-[#64777d]">/ month · Tutor</span>
            </p>
            <p className="text-3xl font-extrabold text-[#142b35]">
              $10 <span className="text-sm font-medium text-[#64777d]">/ month · Student</span>
            </p>
          </div>

          <p className="mt-3 text-sm text-[#64777d]">
            More opportunities and benefits.
          </p>

          <ul className="mt-6 space-y-4 text-sm text-[#536970]">
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Unlimited tutor tuition posts
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Tutor verified badge
            </li>
            <li className="flex gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Student priority booking
            </li>
          </ul>

          <Link
            href="/pricing"
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-4 font-bold !text-white transition hover:bg-[#06645f]"
          >
            Explore Pro Plans <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
