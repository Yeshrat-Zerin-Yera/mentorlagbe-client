
import Link from "next/link";
import {
  BookOpen,
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
} from "lucide-react";

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
};

async function getTuitions(): Promise<Tuition[]> {
  try {
    const response = await fetch("http://localhost:5000/api/tuitions", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tuitions");
    }

    const result = await response.json();
    return Array.isArray(result.data) ? result.data : [];
  } catch (error) {
    console.error("Failed to load tuitions:", error);
    return [];
  }
}

export default async function TuitionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    subject?: string;
    classLevel?: string;
    mode?: string;
  }>;
}) {
  const params = await searchParams;
  const tuitions = await getTuitions();

  const search = params.search?.toLowerCase().trim() || "";
  const subject = params.subject || "";
  const classLevel = params.classLevel || "";
  const mode = params.mode || "";

  const filteredTuitions = tuitions.filter((tuition) => {
    const matchesSearch =
      !search ||
      tuition.title.toLowerCase().includes(search) ||
      tuition.subject.toLowerCase().includes(search) ||
      tuition.classLevel.toLowerCase().includes(search);

    const matchesSubject = !subject || tuition.subject === subject;
    const matchesClass = !classLevel || tuition.classLevel === classLevel;
    const matchesMode = !mode || tuition.mode === mode;

    return matchesSearch && matchesSubject && matchesClass && matchesMode;
  });

  const subjects = [...new Set(tuitions.map((tuition) => tuition.subject))];
  const classes = [...new Set(tuitions.map((tuition) => tuition.classLevel))];

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <section className="bg-[#eef6f3] px-5 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold tracking-widest text-[#087f78] uppercase">
            Find your perfect match
          </p>

          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-5xl">
            Explore Tuition Opportunities
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-[#64777d]">
            Discover approved tuition listings and connect with tutors who
            match your academic goals.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <form
          action="/tuitions"
          className="grid gap-4 rounded-2xl border border-[#e3ece9] bg-white p-5 shadow-sm lg:grid-cols-4"
        >
          <div className="relative lg:col-span-1">
            <Search
              size={19}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-[#087f78]"
            />
            <input
              type="search"
              name="search"
              defaultValue={params.search}
              placeholder="Search tuitions..."
              className="w-full rounded-xl border border-[#e3ece9] py-3 pr-3 pl-10 text-sm outline-none focus:border-[#087f78]"
            />
          </div>

          <select
            name="subject"
            defaultValue={subject}
            className="rounded-xl border border-[#e3ece9] px-3 py-3 text-sm text-[#536970] outline-none focus:border-[#087f78]"
          >
            <option value="">All Subjects</option>
            {subjects.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="classLevel"
            defaultValue={classLevel}
            className="rounded-xl border border-[#e3ece9] px-3 py-3 text-sm text-[#536970] outline-none focus:border-[#087f78]"
          >
            <option value="">All Classes</option>
            {classes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select
            name="mode"
            defaultValue={mode}
            className="rounded-xl border border-[#e3ece9] px-3 py-3 text-sm text-[#536970] outline-none focus:border-[#087f78]"
          >
            <option value="">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-[#087f78] px-6 py-3 font-bold text-white transition hover:bg-[#06645f] lg:col-span-4"
          >
            Apply Filters
          </button>
        </form>

        <div className="mt-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-extrabold text-[#142b35]">
              Available Tuitions
            </h2>
            <p className="mt-1 text-sm text-[#64777d]">
              {filteredTuitions.length} opportunities found
            </p>
          </div>

          <Link
            href="/tuitions"
            className="text-sm font-bold text-[#087f78] hover:underline"
          >
            Clear all filters
          </Link>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="flex flex-col overflow-hidden rounded-2xl border border-[#e3ece9] bg-white transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-[#dff1eb] to-[#f0f7f4]">
                {tuition.bannerImage ? (
                  <img
                    src={tuition.bannerImage}
                    alt={tuition.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen size={48} className="text-[#087f78]" />
                )}
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

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#64777d]">
                  {tuition.description}
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
                  <p className="text-xs">
                    {tuition.daysPerWeek} days per week
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

        {filteredTuitions.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#cbded8] bg-white px-5 py-16 text-center">
            <SlidersHorizontal
              size={38}
              className="mx-auto text-[#087f78]"
            />
            <h3 className="mt-4 text-xl font-bold text-[#142b35]">
              No tuitions found
            </h3>
            <p className="mt-2 text-sm text-[#64777d]">
              Try changing your search or filters.
            </p>
            <Link
              href="/tuitions"
              className="mt-5 inline-flex rounded-xl bg-[#087f78] px-5 py-3 text-sm font-bold text-white hover:bg-[#06645f]"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
