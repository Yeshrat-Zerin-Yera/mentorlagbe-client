
import Hero from "@/components/home/Hero";
import TuitionSearch from "@/components/home/TuitionSearch";
import FeaturedTuitions, {
  type Tuition,
} from "@/components/home/FeaturedTuitions";
import PopularSubjects from "@/components/home/PopularSubjects";
import HowItWorks from "@/components/home/HowItWorks";
import PricingPreview from "@/components/home/PricingPreview";
import { Search, Users, GraduationCap } from "lucide-react";

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
  let allTuitions: Tuition[] = [];

  try {
    const response = await fetch("http://localhost:5000/api/tuitions", {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();

      allTuitions = Array.isArray(result.data) ? result.data : [];
    }
  } catch (error) {
    console.error("Failed to load homepage tuitions:", error);
  }

  const featuredTuitions = allTuitions.slice(0, 6);

  const subjectCounts = allTuitions.reduce(
    (counts, tuition) => {
      const subject = tuition.subject?.trim();

      if (subject) {
        counts[subject] = (counts[subject] || 0) + 1;
      }

      return counts;
    },
    {} as Record<string, number>
  );

  const popularSubjects = Object.entries(subjectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return (
    <main className="overflow-hidden">
      <Hero />

      <TuitionSearch />

      <FeaturedTuitions featuredTuitions={featuredTuitions} />

      <PopularSubjects subjects={popularSubjects} />

      <HowItWorks steps={steps} />

      <PricingPreview />
    </main>
  );
}
