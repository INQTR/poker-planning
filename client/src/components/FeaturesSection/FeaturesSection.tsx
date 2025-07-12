import { Check, Sparkles, Zap, Shield } from "lucide-react";

import { cn } from "@/lib/utils";

const features = [
  {
    name: "Unlimited team members",
    available: true,
    highlight: true,
  },
  {
    name: "Unlimited planning sessions",
    available: true,
    highlight: true,
  },
  {
    name: "Real-time updates",
    available: true,
  },
  {
    name: "Mobile responsive",
    available: true,
  },
  {
    name: "No ads or tracking",
    available: true,
  },
  {
    name: "Custom voting scales",
    available: false,
    comingSoon: true,
  },
  {
    name: "Export capabilities",
    available: false,
    comingSoon: true,
  },
  {
    name: "Timer functionality",
    available: false,
    comingSoon: true,
  },
];

export function FeaturesSection() {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-24 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 left-[50%] w-[600px] h-[600px] -translate-x-1/2 rounded-full bg-linear-to-tr from-primary/20 via-primary/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-56 right-[20%] w-[600px] h-[600px] rounded-full bg-linear-to-tl from-secondary/20 via-secondary/5 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                Features
              </p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Everything You Need,
              <span className="block mt-2 bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Nothing You Don&apos;t
              </span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              While others charge for basics, we believe great tools should be
              accessible to everyone. Simple, powerful, and completely free.
            </p>
          </div>

          {/* Features Grid */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-200 to-gray-200 dark:from-gray-700 dark:via-gray-700 dark:to-gray-700 rounded-3xl blur-[1px]" />
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12">
              <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-8 lg:gap-x-12">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className={cn(
                      "relative flex items-start gap-4 group",
                      !feature.available && "opacity-60",
                    )}
                  >
                    <div
                      className={cn(
                        "shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300",
                        feature.available
                          ? "bg-primary/10 group-hover:bg-primary/20"
                          : "bg-gray-100 dark:bg-gray-700",
                      )}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 transition-all duration-300",
                          feature.available
                            ? "text-primary group-hover:scale-110"
                            : "text-gray-400 dark:text-gray-500",
                        )}
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className={cn(
                          "text-base font-medium transition-colors duration-300",
                          feature.available
                            ? "text-gray-900 dark:text-white group-hover:text-primary"
                            : "text-gray-500 dark:text-gray-400",
                        )}
                      >
                        {feature.name}
                        {feature.highlight && (
                          <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Zap className="mr-1 h-3 w-3" />
                            Core
                          </span>
                        )}
                        {feature.comingSoon && (
                          <span className="ml-2 text-xs font-normal text-gray-500 dark:text-gray-400 italic">
                            Coming soon
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-linear-to-br from-primary/20 to-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        100% Free Forever
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No credit card. No trial. Just free.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      $0
                    </span>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      /forever
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
