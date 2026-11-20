
import Link from "next/link";
// import Navbar from "@/components/layout/Navbar";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Search,
  Users,
  Video,
  MapPin,
  CheckCircle2,
  Star,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  tutorName: string;
};

const steps = [
  {
    number: "01",
    title: "Explore Tuitions",
    description:
      "Browse verified tuition opportunities and find a learning option that matches your goals.",
    icon: Search,
  },
  {
    number: "02",
    title: "Connect with Tutors",
    description:
      "Review tutor details, submit your application, and communicate your learning preferences.",
    icon: Users,
  },
  {
    number: "03",
    title: "Start Learning",
    description:
      "Get accepted, arrange your schedule, and take the next step in your academic journey.",
    icon: GraduationCap,
  },
];

export default async function Home() {

  let featuredTuitions: Tuition[] = [];

  try {
    const response = await fetch("http://localhost:5000/api/tuitions", {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      featuredTuitions = Array.isArray(result.data)
        ? result.data.slice(0, 6)
        : [];
    }
  } catch (error) {
    console.error("Failed to load featured tuitions:", error);
  }

  return (
    <main className="overflow-hidden">
      {/* Navbar
      <Navbar /> */}

      {/* Hero */}
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
                    <p className="text-xs text-[#64777d]">Guidance that matters</p>
                  </div>
                  <Star size={19} className="fill-[#e8ae49] text-[#e8ae49]" />
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-[#e3ece9] p-4">
                  <span className="rounded-lg bg-[#fff4e5] p-3 text-[#c58b34]">
                    <Video size={22} />
                  </span>
                  <div className="flex-1">
                    <p className="font-bold text-[#142b35]">Flexible Learning</p>
                    <p className="text-xs text-[#64777d]">Online or in person</p>
                  </div>
                  <CheckCircle2 size={19} className="text-[#087f78]" />
                </div>
              </div>

              <div className="absolute -right-4 top-1/2 hidden rounded-xl bg-white px-4 py-3 shadow-xl sm:block">
                <p className="text-xs font-semibold text-[#64777d]">Your future</p>
                <p className="text-sm font-extrabold text-[#087f78]">Starts today ✨</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="relative z-10 mx-auto -mt-8 max-w-5xl px-5">
        <form action="/tuitions" className="grid gap-3 rounded-2xl border border-[#e3ece9] bg-white p-4 shadow-xl shadow-[#142b35]/5 sm:grid-cols-[1fr_auto] sm:p-5">
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

      {/* Featured Tuitions */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold tracking-widest text-[#087f78] uppercase">
              Explore opportunities
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-4xl">
              Featured Tuitions
            </h2>
            <p className="mt-3 max-w-xl text-[#64777d]">
              Discover learning opportunities selected to help you reach your goals.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 font-bold text-[#087f78] hover:gap-3"
          >
            View all tuitions <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredTuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3ece9] bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#142b35]/5"
            >
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#dff1eb] to-[#f0f7f4]">
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-4xl font-extrabold text-[#087f78] shadow-lg">
                  {tuition.subject.charAt(0)}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#e8f4f1] px-3 py-1 text-xs font-bold text-[#087f78]">
                    {tuition.subject}
                  </span>
                  <span className="text-xs font-semibold text-[#64777d]">
                    {tuition.mode}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-[#142b35]">
                  {tuition.title}
                </h3>

                <p className="mt-2 text-sm text-[#64777d]">
                  {tuition.classLevel}
                </p>

                <div className="mt-5 space-y-3 border-t border-[#e3ece9] pt-5 text-sm text-[#64777d]">
                  <p className="flex items-center gap-2">
                    <Users size={16} className="text-[#087f78]" />
                    {tuition.tutorName}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} className="text-[#087f78]" />
                    {tuition.location}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-[#e3ece9] pt-5">
                  <div>
                    <p className="text-xs text-[#64777d]">Monthly fee</p>
                    <p className="mt-1 text-xl font-extrabold text-[#087f78]">
                      ৳{tuition.monthlyFee.toLocaleString("en-BD")}
                    </p>
                  </div>
                  <Link
                    href={`/tuitions/${tuition._id}`}
                    className="rounded-xl bg-[#e8f4f1] px-4 py-3 text-sm font-bold text-[#087f78] transition hover:bg-[#087f78] hover:text-white"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        {featuredTuitions.length === 0 && (
          <p className="col-span-full py-10 text-center text-[#64777d]">
            No featured tuitions available right now.
          </p>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#eef6f3] py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-widest text-[#087f78] uppercase">
              Simple process
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-4xl">
              How MentorLagbe Works
            </h2>
            <p className="mt-4 leading-7 text-[#64777d]">
              Getting started with the right tutor is simple. Follow three easy steps.
            </p>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="rounded-2xl bg-white p-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-extrabold text-[#d5ebe3]">
                      {step.number}
                    </span>
                    <span className="rounded-2xl bg-[#e8f4f1] p-4 text-[#087f78]">
                      <Icon size={26} />
                    </span>
                  </div>
                  <h3 className="mt-7 text-xl font-extrabold text-[#142b35]">
                    {step.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#64777d]">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
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
            <p className="mt-3 text-sm text-[#64777d]">A great way to get started.</p>
            <ul className="mt-7 space-y-4 text-sm text-[#536970]">
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Browse and apply to tuitions</li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Basic platform features</li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Tutors can create up to 2 posts</li>
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
            <p className="mt-3 text-sm text-[#64777d]">More opportunities and benefits.</p>
            <ul className="mt-6 space-y-4 text-sm text-[#536970]">
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Unlimited tutor tuition posts</li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Tutor verified badge</li>
              <li className="flex gap-2"><CheckCircle2 size={18} className="text-[#087f78]" /> Student priority booking</li>
            </ul>
            <Link
              href="/pricing"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#087f78] px-5 py-4 font-bold text-white transition hover:bg-[#06645f]"
            >
              Explore Pro Plans <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#142b35] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#087f78]">
                <GraduationCap size={25} />
              </span>
              <span className="text-xl font-extrabold">
                Mentor<span className="text-[#61c8b4]">Lagbe</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm leading-7 text-[#b7c7c8]">
              Connecting students with the right tutors. Better guidance,
              stronger confidence, and a brighter learning journey.
            </p>
          </div>

          <div>
            <h3 className="font-bold">Quick Links</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#b7c7c8]">
              <Link href="/" className="hover:text-white">Home</Link>
              <Link href="/tuitions" className="hover:text-white">Browse Tuitions</Link>
              <Link href="/pricing" className="hover:text-white">Pricing</Link>
              <a href="#how-it-works" className="hover:text-white">How It Works</a>
            </div>
          </div>

          <div>
            <h3 className="font-bold">Get Started</h3>
            <div className="mt-5 flex flex-col gap-3 text-sm text-[#b7c7c8]">
              <Link href="/sign-in" className="hover:text-white">Sign In</Link>
              <Link href="/sign-up" className="hover:text-white">Create Account</Link>
              <Link href="/tuitions" className="hover:text-white">Find a Tutor</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-5 py-6 text-sm text-[#b7c7c8] sm:flex-row lg:px-8">
            <p>© {new Date().getFullYear()} MentorLagbe. All rights reserved.</p>
            <p>Built to make learning better.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
