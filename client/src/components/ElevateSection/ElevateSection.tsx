import {
  UsersIcon,
  ClockIcon,
  ChartBarIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import pokerPlanningScreenshot from "@/assets/poker-planning-screenshot.png";
import { cn } from "@/lib/utils";

const features = [
  {
    name: "Real-time Collaboration",
    description:
      "Collaborate with your team in real-time, no matter where they are. Seamless communication during planning sessions.",
    icon: UsersIcon,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    name: "Time-saving Efficiency",
    description:
      "Streamline your planning process and save valuable time. Quick setup and easy estimation rounds.",
    icon: ClockIcon,
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-900/30",
  },
  {
    name: "Improved Accuracy",
    description:
      "Enhance estimate accuracy with our structured approach. Visualize and analyze data to refine your process.",
    icon: ChartBarIcon,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
  },
];

export function ElevateSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-96 left-[20%] w-[800px] h-[800px] rounded-full bg-linear-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-96 right-[10%] w-[800px] h-[800px] rounded-full bg-linear-to-tl from-secondary/10 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {/* Content Section */}
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <p className="text-sm font-medium text-primary uppercase tracking-wider">
                  Plan Smarter
                </p>
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Elevate Your
                <span className="block mt-2 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Scrum Planning
                </span>
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Experience a more efficient and accurate planning process.
                Designed to enhance team collaboration and improve estimation
                accuracy.
              </p>

              {/* Features List */}
              <div className="mt-10 space-y-6">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="group relative flex gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110",
                        feature.bgColor,
                      )}
                    >
                      <feature.icon
                        className={cn("h-6 w-6", feature.color)}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-300">
                        {feature.name}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 self-center" />
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="mt-10">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-primary/80 transition-colors duration-300"
                >
                  See how it works
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          {/* Screenshot Section */}
          <div className="relative flex items-center justify-center">
            <div className="relative">
              {/* Glow effect behind screenshot */}
              <div className="absolute -inset-4 bg-linear-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl opacity-70" />

              {/* Screenshot container with enhanced styling */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-gray-900/10 dark:ring-gray-100/10">
                <div className="absolute inset-0 bg-linear-to-tr from-gray-900/5 via-transparent to-transparent dark:from-white/5" />
                <img
                  alt="Planning Poker platform screenshot"
                  src={pokerPlanningScreenshot}
                  width={2432}
                  height={1442}
                  className="w-full h-auto"
                />
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-lg ring-1 ring-gray-900/10 dark:ring-gray-100/10">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Live Demo
                </span>
              </div>

              <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full bg-white dark:bg-gray-800 px-4 py-2 shadow-lg ring-1 ring-gray-900/10 dark:ring-gray-100/10">
                <UsersIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  5k+ Teams
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
