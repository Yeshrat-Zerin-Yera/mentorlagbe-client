
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function Footer() {
  return (
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
            <Link href="/#how-it-works" className="hover:text-white">How It Works</Link>
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
  );
}
