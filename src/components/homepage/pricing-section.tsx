"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    period: "forever",
    description: "For ad-hoc teams and quick sessions.",
    features: [
      "No account required",
      "Unlimited participants",
      "Core voting tools",
      "Session auto-deletes in 5 days",
    ],
    cta: "Start Planning",
    href: "/room/new",
  },
  {
    name: "Pro",
    id: "pro",
    price: "$8",
    period: "/month per facilitator",
    description: "For teams needing history and insights.",
    features: [
      "Permanent account",
      "Full session archive",
      "Analytics & velocity insights",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/dashboard",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="bg-white dark:bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
            Pricing
          </h2>
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
            Transparent pricing.
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {tiers.map((tier, index) => (
            <div 
              key={tier.id}
              className={cn(
                "flex flex-col p-10 rounded-3xl border",
                index === 1 
                  ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-black" 
                  : "border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-black"
              )}
            >
              <div className="mb-8">
                <h4 className={cn("text-xl font-bold mb-2", index === 1 ? "text-white dark:text-black" : "text-gray-900 dark:text-white")}>{tier.name}</h4>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className={cn("text-5xl font-bold tracking-tighter", index === 1 ? "text-white dark:text-black" : "text-gray-900 dark:text-white")}>{tier.price}</span>
                  <span className={cn("text-base", index === 1 ? "text-gray-300 dark:text-gray-600" : "text-gray-500")}>{tier.period}</span>
                </div>
                <p className={cn("text-base font-light", index === 1 ? "text-gray-300 dark:text-gray-700" : "text-gray-600 dark:text-gray-400")}>{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className={cn("flex items-start gap-3 text-base", index === 1 ? "text-gray-200 dark:text-gray-800" : "text-gray-900 dark:text-gray-300")}>
                    <span className={cn(index === 1 ? "text-gray-400 dark:text-gray-600" : "text-gray-400")}>—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={cn(
                  "inline-flex h-14 items-center justify-center px-8 text-base font-bold tracking-tight transition-all rounded-2xl",
                  index === 1
                    ? "bg-white dark:bg-black text-black dark:text-white hover:scale-105"
                    : "bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800"
                )}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
