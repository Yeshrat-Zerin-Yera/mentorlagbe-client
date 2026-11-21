
import Hero from "@/components/home/Hero";
import TuitionSearch from "@/components/home/TuitionSearch";
import FeaturedTuitions, {
  type Tuition,
} from "@/components/home/FeaturedTuitions";
import PopularSubjects from "@/components/home/PopularSubjects";
import PlatformStats from "@/components/home/PlatformStats";
import HowItWorks from "@/components/home/HowItWorks";
import PricingPreview from "@/components/home/PricingPreview";
import { Search, Users, GraduationCap } from "lucide-react";
import { connection } from "next/server";
import { API_URL } from "@/lib/api";

type PlatformStatsData = {
  totalTuitions: number;
  totalSubjects: number;
  totalStudents: number;
  totalTutors: number;
  popularSubjects: {
    name: string;
    count: number;
  }[];
};

const emptyStats: PlatformStatsData = {
  totalTuitions: 0,
  totalSubjects: 0,
  totalStudents: 0,
  totalTutors: 0,
  popularSubjects: [],
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
  await connection();
  let allTuitions: Tuition[] = [];
  let platformStats: PlatformStatsData = emptyStats;

  try {
    const response = await fetch(`${API_URL}/tuitions`, {
      cache: "no-store",
    });

    if (response.ok) {
      const result = await response.json();
      allTuitions = Array.isArray(result.data) ? result.data : [];
    }
  } catch (error) {
    console.error("Failed to load homepage tuitions:", error);
  }

  try {
    const response = await fetch(
      `${API_URL}/tuitions/stats`,
      {
        cache: "no-store",
      }
    );

    if (response.ok) {
      const result = await response.json();

      if (result.success && result.data) {
        platformStats = {
          totalTuitions: Number(result.data.totalTuitions) || 0,
          totalSubjects: Number(result.data.totalSubjects) || 0,
          totalStudents: Number(result.data.totalStudents) || 0,
          totalTutors: Number(result.data.totalTutors) || 0,
          popularSubjects: Array.isArray(result.data.popularSubjects)
            ? result.data.popularSubjects
            : [],
        };
      }
    }
  } catch (error) {
    console.error("Failed to load homepage statistics:", error);
  }

  const featuredTuitions = allTuitions.slice(0, 6);

  return (
    <main className="overflow-hidden">
      <Hero />
      <TuitionSearch />
      <FeaturedTuitions featuredTuitions={featuredTuitions} />
      <PopularSubjects subjects={platformStats.popularSubjects} />
      <PlatformStats stats={platformStats} />
      <HowItWorks steps={steps} />
      <PricingPreview />
    </main>
  );
}
