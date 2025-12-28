"use client";

import { Users, Vote, ChartBar, Zap, MoveRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Create a Room",
    description:
      "Start a new planning session with one click. No registration required.",
    icon: Zap,
  },
  {
    id: 2,
    title: "Invite Your Team",
    description:
      "Share the room URL. Team members join instantly from any device.",
    icon: Users,
  },
  {
    id: 3,
    title: "Vote on Stories",
    description:
      "Everyone votes simultaneously. Cards stay hidden until revealed.",
    icon: Vote,
  },
  {
    id: 4,
    title: "Reach Consensus",
    description:
      "Reveal votes, discuss differences, and align on story points.",
    icon: ChartBar,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-white dark:bg-black py-24 sm:py-32"
    >
      {/* Subtle radial gradient backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-primary/[0.07] via-transparent to-primary/[0.07] blur-3xl rounded-full" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-primary mb-4">
            How It Works
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Four simple steps
          </h2>
          <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Transform your sprint planning in minutes
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Horizontal connector line - desktop only */}
          <div className="hidden lg:block absolute top-[3.25rem] left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-zinc-700 to-transparent" />
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-[shimmer_3s_ease-in-out_infinite] opacity-0 group-hover:opacity-100" />
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="group relative"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Step Card */}
                <div className="relative flex flex-col items-center text-center">
                  {/* Step Number + Icon Container */}
                  <div className="relative mb-6">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary/30 dark:to-primary/10 scale-[1.4] opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm" />

                    {/* Main circle */}
                    <div
                      className={cn(
                        "relative w-[6.5rem] h-[6.5rem] rounded-full",
                        "bg-gray-50 dark:bg-zinc-900/80",
                        "border border-gray-200 dark:border-zinc-800",
                        "flex items-center justify-center",
                        "transition-all duration-500",
                        "group-hover:border-primary/50 group-hover:bg-primary/5 dark:group-hover:bg-primary/10"
                      )}
                    >
                      {/* Step number - positioned top-right */}
                      <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400 group-hover:border-primary/50 group-hover:text-primary transition-all duration-300">
                        {step.id}
                      </span>

                      {/* Icon */}
                      <step.icon
                        className="w-8 h-8 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  {/* Arrow connector for mobile/tablet - between cards */}
                  {index < steps.length - 1 && (
                    <div className="lg:hidden absolute -bottom-4 left-1/2 -translate-x-1/2 text-gray-300 dark:text-zinc-700">
                      <MoveRight className="w-5 h-5 rotate-90 md:rotate-0" />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-500 leading-relaxed max-w-[220px]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
