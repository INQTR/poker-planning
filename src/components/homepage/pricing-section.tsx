"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ShinyButton } from "@/components/ui/shiny-button";

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    period: "forever",
    description: "Jump straight in. No email, no password, no friction.",
    features: [
      "Guest account, no signup needed",
      "Unlimited team members",
      "Unlimited planning sessions",
      "Real-time collaboration",
      "Multiple voting scales",
      "Issues management & CSV export",
      "Auto-reveal & session timer",
      "Spectator mode",
    ],
    footnote: "Session history retained for 5 days",
    cta: "Start Planning",
    href: "/room/new",
    highlighted: false,
  },
  {
    name: "Pro",
    id: "pro",
    price: "$8",
    period: "/month per facilitator",
    badge: "Support the Project",
    description:
      "One Pro account unlocks premium features for all your sessions. Team members join free, only the facilitator needs Pro.",
    features: [
      "Everything in Free",
      "Permanent account",
      "Voting history preserved forever",
      "Full session archive",
      "Personal analytics dashboard",
      "Agreement & velocity insights",
      "Export analytics reports",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/dashboard",
    highlighted: true,
  },
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative bg-white dark:bg-black py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
            Pricing
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Free forever. Pro if you love it.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Start free with zero friction, no signup required. Upgrade to Pro to
            keep your data forever and support ongoing development.
          </p>
        </div>

        {/* Pricing cards - asymmetric layout */}
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Free tier - smaller, secondary */}
            <div className="lg:col-span-5 flex">
              <div className="flex flex-col bg-gray-50 dark:bg-surface-1 rounded-2xl p-8 pb-6 w-full">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {tiers[0].name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {tiers[0].price}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {tiers[0].period}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {tiers[0].description}
                  </p>
                </div>

                <ul className="space-y-3 mb-6">
                  {tiers[0].features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-400"
                    >
                      <span className="text-gray-400 dark:text-gray-500 select-none">
                        •
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                  {tiers[0].footnote}
                </p>

                <div className="mt-auto">
                  <Link
                    href={tiers[0].href}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-white dark:bg-surface-2 h-12 px-4 text-base font-medium text-gray-900 dark:text-white transition-colors hover:bg-gray-100 dark:hover:bg-surface-3"
                  >
                    {tiers[0].cta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Pro tier - larger, primary, elevated */}
            <div className="lg:col-span-7 flex">
              <div className="relative bg-gray-50 dark:bg-surface-1 rounded-3xl p-10 lg:p-12 pb-6 lg:pb-6 w-full">
                {/* Layered background for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-surface-2 dark:to-surface-1 rounded-3xl" />

                <div className="relative flex flex-col h-full">
                  {/* Badge */}
                  <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-6">
                    {tiers[1].badge}
                  </span>

                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {tiers[1].name}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {tiers[1].price}
                      </span>
                      <span className="text-base text-gray-500 dark:text-gray-400">
                        {tiers[1].period}
                      </span>
                    </div>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
                      {tiers[1].description}
                    </p>
                  </div>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-8">
                    {tiers[1].features.map((feature) => (
                      <li
                        key={feature}
                        className={cn(
                          "flex items-start gap-3 text-sm",
                          feature === "Everything in Free"
                            ? "font-semibold text-gray-900 dark:text-white sm:col-span-2"
                            : "text-gray-600 dark:text-gray-400",
                        )}
                      >
                        <span className="text-primary select-none">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    <Link href={tiers[1].href} className="block">
                      <ShinyButton className="w-full h-12 text-base">
                        {tiers[1].cta}
                      </ShinyButton>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          All prices in USD. Cancel anytime, no questions asked.{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms apply
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
