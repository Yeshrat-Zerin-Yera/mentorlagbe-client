
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  GraduationCap,
  Star,
  Video,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[#f0f7f4]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#cce5dc] bg-white px-4 py-2 text-sm font-semibold text-[#087f78]">
            <Sparkles size={16} />
            Your learning journey starts here
          </div>

          <h1 className="max-w-2xl text-4xl leading-tight font-extrabold tracking-tight text-[#142b35] sm:text-5xl lg:text-6xl">
            Find the Right Tutor.
            <span className="mt-2 block text-[#087f78]">
              Unlock Your Potential.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#64777d] sm:text-lg">
            Discover qualified tutors, explore tuition opportunities, and
            connect with the right mentor to achieve your academic goals.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/tuitions"
              className="inline-flex items-center gap-2 rounded-xl bg-[#087f78] px-6 py-4 font-bold text-white shadow-lg shadow-[#087f78]/20 transition hover:-translate-y-1 hover:bg-[#06645f]"
            >
              Browse Tuitions <ArrowRight size={19} />
            </Link>

            <Link
              href="/sign-up"
              className="rounded-xl border border-[#cbded8] bg-white px-6 py-4 font-bold text-[#142b35] transition hover:border-[#087f78] hover:text-[#087f78]"
            >
              Become a Tutor
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-[#536970]">
            <span className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#087f78]" />
              Trusted Platform
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-[#087f78]" />
              Verified Listings
            </span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute -right-6 -top-8 h-48 w-48 rounded-full bg-[#d5ebe3] blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-[#c6e6df] blur-2xl" />

          <div className="relative rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-[#164d43]/10 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#64777d]">
                  Your learning dashboard
                </p>
                <h3 className="mt-1 text-xl font-extrabold text-[#142b35]">
                  Learn without limits
                </h3>
              </div>
              <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                <BookOpen size={25} />
              </span>
            </div>

            <div className="mt-8 rounded-2xl bg-[#f0f7f4] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-[#64777d] uppercase">
                    Learning progress
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-[#142b35]">
                    85%
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#087f78] border-r-[#d5ebe3] text-sm font-bold text-[#087f78]">
                  85
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#dcebe5]">
                <div className="h-full w-[85%] rounded-full bg-[#087f78]" />
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-[#e3ece9] p-4">
                <span className="rounded-lg bg-[#e8f4f1] p-3 text-[#087f78]">
                  <GraduationCap size={22} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-[#142b35]">Expert Tutors</p>
                  <p className="text-xs text-[#64777d]">
                    Guidance that matters
                  </p>
                </div>
                <Star size={19} className="fill-[#e8ae49] text-[#e8ae49]" />
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-[#e3ece9] p-4">
                <span className="rounded-lg bg-[#fff4e5] p-3 text-[#c58b34]">
                  <Video size={22} />
                </span>
                <div className="flex-1">
                  <p className="font-bold text-[#142b35]">Flexible Learning</p>
                  <p className="text-xs text-[#64777d]">
                    Online or in person
                  </p>
                </div>
                <CheckCircle2 size={19} className="text-[#087f78]" />
              </div>
            </div>

            <div className="absolute -right-4 top-1/2 hidden rounded-xl bg-white px-4 py-3 shadow-xl sm:block">
              <p className="text-xs font-semibold text-[#64777d]">
                Your future
              </p>
              <p className="text-sm font-extrabold text-[#087f78]">
                Starts today ✨
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
