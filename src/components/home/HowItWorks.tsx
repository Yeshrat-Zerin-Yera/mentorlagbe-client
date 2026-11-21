
import type { LucideIcon } from "lucide-react";

type Step = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type HowItWorksProps = {
  steps: Step[];
};

export default function HowItWorks({ steps }: HowItWorksProps) {
  return (
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
              <div
                key={step.number}
                className="rounded-2xl bg-white p-8 shadow-sm"
              >
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
  );
}
