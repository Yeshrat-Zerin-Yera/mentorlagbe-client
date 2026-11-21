
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  MapPin,
  Users,
  CalendarDays,
  GraduationCap,
  Monitor,
  Banknote,
} from "lucide-react";
import ApplicationForm from "@/components/tuitions/ApplicationForm";

type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: "Online" | "Offline";
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  bannerImage: string;
  description: string;
  tutorName: string;
  tutorEmail: string;
};

async function getTuition(id: string): Promise<Tuition | null> {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return null;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/tuitions/${id}`,
      { cache: "no-store" }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch tuition details");
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Failed to load tuition details:", error);
    return null;
  }
}

export default async function TuitionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tuition = await getTuition(id);

  if (!tuition) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <section className="bg-[#eef6f3] px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#087f78] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Tuitions
          </Link>

          <div className="mt-8">
            <span className="rounded-full bg-[#d8eee6] px-4 py-2 text-xs font-bold text-[#087f78]">
              {tuition.subject}
            </span>

            <h1 className="mt-5 max-w-3xl text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-5xl">
              {tuition.title}
            </h1>

            <p className="mt-4 text-[#64777d]">
              {tuition.classLevel} · {tuition.mode} Tuition
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-[#e3ece9] bg-white">
            {tuition.bannerImage ? (
              <img
                src={tuition.bannerImage}
                alt={tuition.title}
                className="h-64 w-full object-cover sm:h-96"
              />
            ) : (
              <div className="flex h-64 items-center justify-center bg-[#e8f4f1]">
                <BookOpen size={64} className="text-[#087f78]" />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#e3ece9] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-[#142b35]">
              About This Tuition
            </h2>

            <p className="mt-5 whitespace-pre-line leading-8 text-[#64777d]">
              {tuition.description}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e3ece9] bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-[#142b35]">
              Tuition Information
            </h2>

            <div className="mt-7 grid gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <BookOpen size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Subject</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.subject}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <GraduationCap size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Class Level</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.classLevel}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <Monitor size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Learning Mode</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.mode}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <MapPin size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Location</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <CalendarDays size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Days Per Week</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.daysPerWeek} days
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="rounded-xl bg-[#e8f4f1] p-3 text-[#087f78]">
                  <Users size={22} />
                </span>
                <div>
                  <p className="text-xs text-[#64777d]">Tutor</p>
                  <p className="mt-1 font-bold text-[#142b35]">
                    {tuition.tutorName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-[#e3ece9] bg-white p-6 shadow-sm lg:sticky lg:top-28">
          <p className="text-sm font-semibold text-[#64777d]">
            Monthly Tuition Fee
          </p>

          <h2 className="mt-2 text-4xl font-extrabold text-[#087f78]">
            ৳{tuition.monthlyFee.toLocaleString("en-BD")}
          </h2>

          <p className="mt-1 text-sm text-[#64777d]">
            Per month
          </p>

          <div className="my-7 border-t border-[#e3ece9]" />

          <h3 className="font-bold text-[#142b35]">Tutor Information</h3>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8f4f1] text-[#087f78]">
              <GraduationCap size={25} />
            </span>
            <div>
              <p className="font-bold text-[#142b35]">
                {tuition.tutorName}
              </p>
              <p className="text-xs text-[#64777d]">Tuition Tutor</p>
            </div>
          </div>

          <div className="my-7 border-t border-[#e3ece9]" />

          <ApplicationForm tuitionId={tuition._id} />

        </aside>
      </section>
    </main>
  );
}
