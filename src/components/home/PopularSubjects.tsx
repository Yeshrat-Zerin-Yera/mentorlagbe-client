
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  Atom,
  Languages,
  Monitor,
  FlaskConical,
} from "lucide-react";

type Subject = {
  name: string;
  count: number;
};

const subjectIcons = [
  BookOpen,
  Calculator,
  Atom,
  Languages,
  Monitor,
  FlaskConical,
];

export default function PopularSubjects({
  subjects,
}: {
  subjects: Subject[];
}) {
  return (
    <section className="bg-white px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-[#087f78] uppercase">
            Explore by subject
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#142b35] sm:text-4xl">
            Find Tuitions by Subject
          </h2>

          <p className="mt-4 leading-7 text-[#64777d]">
            Explore learning opportunities across different subjects
            and find the right tutor for your academic goals.
          </p>
        </div>

        {subjects.length > 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject, index) => {
              const Icon = subjectIcons[index % subjectIcons.length];

              return (
                <Link
                  key={subject.name}
                  href={`/tuitions?subject=${encodeURIComponent(subject.name)}`}
                  className="group flex items-center gap-5 rounded-2xl border border-[#e3ece9] bg-[#f8faf9] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#b7d9cf] hover:bg-white hover:shadow-lg"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f1] text-[#087f78] transition group-hover:bg-[#087f78] group-hover:text-white">
                    <Icon size={27} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-[#142b35]">
                      {subject.name}
                    </h3>

                    <p className="mt-1 text-sm text-[#64777d]">
                      {subject.count}{" "}
                      {subject.count === 1 ? "tuition" : "tuitions"} available
                    </p>
                  </div>

                  <span className="text-xl font-bold text-[#087f78] transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="mt-12 text-center text-sm text-[#64777d]">
            Subject listings will appear here as tutors publish tuitions.
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/tuitions"
            className="inline-flex items-center justify-center rounded-xl bg-[#087f78] px-6 py-3.5 text-sm font-bold !text-white transition hover:bg-[#06645f]"
          >
            Browse All Tuitions
          </Link>
        </div>
      </div>
    </section>
  );
}
