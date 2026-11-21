
import Link from "next/link";
import { ArrowRight, Users, MapPin } from "lucide-react";

export type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  tutorName: string;
};

type FeaturedTuitionsProps = {
  featuredTuitions: Tuition[];
};

export default function FeaturedTuitions({
  featuredTuitions,
}: FeaturedTuitionsProps) {
  return (
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
  );
}
