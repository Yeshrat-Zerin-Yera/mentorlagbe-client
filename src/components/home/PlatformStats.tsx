
type PlatformStatsProps = {
  stats: {
    totalTuitions: number;
    totalSubjects: number;
    totalStudents: number;
    totalTutors: number;
  };
};

const statistics = [
  {
    key: "totalTuitions" as const,
    label: "Approved Tuitions",
    description: "Active learning opportunities",
  },
  {
    key: "totalSubjects" as const,
    label: "Subjects",
    description: "Subjects available to explore",
  },
  {
    key: "totalStudents" as const,
    label: "Registered Students",
    description: "Students in our learning community",
  },
  {
    key: "totalTutors" as const,
    label: "Registered Tutors",
    description: "Tutors sharing their knowledge",
  },
];

export default function PlatformStats({ stats }: PlatformStatsProps) {
  return (
    <section className="bg-[#f0f7f4] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#21866b]">
            MentorLagbe at a glance
          </p>

          <h2 className="text-3xl font-bold tracking-tight text-[#173d35] sm:text-4xl">
            Learning opportunities that make a difference
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            Discover our growing community of students and tutors, along with
            the learning opportunities available on MentorLagbe.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {statistics.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-[#dcece5] bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-8"
            >
              <p className="text-3xl font-bold tracking-tight text-[#21866b] sm:text-5xl">
                {stats[item.key].toLocaleString()}
              </p>

              <h3 className="mt-3 text-base font-semibold text-[#173d35] sm:text-lg">
                {item.label}
              </h3>

              <p className="mt-2 text-xs text-gray-500 sm:text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
