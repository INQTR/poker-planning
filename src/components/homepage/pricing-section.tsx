"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Check } from "lucide-react";

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    period: "forever",
    description: "For ad-hoc teams and quick estimating sessions.",
    features: [
      "Unlimited participants",
      "Real-time voting & whiteboard",
      "5-day session history",
      "Basic results analytics",
      "CSV exports",
    ],
    cta: "Start planning for free",
    href: "/room/new",
  },
  {
    name: "Pro",
    id: "pro",
    price: "Coming Soon",
    period: "",
    description:
      "For engineering teams that need deep insights and workflow automation.",
    features: [
      "Everything in Free, plus:",
      "Time-to-consensus tracking",
      "Voter alignment matrix",
      "Sprint predictability score",
      "Two-way Jira & GitHub sync",
      "Unlimited session history",
    ],
    cta: "Join Waitlist",
    href: "#",
    disabled: true,
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
          <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
            Transparent pricing.
          </h3>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light max-w-xl">
            Start using AgileKit completely free today. Our Pro tier brings
            powerful integrations and team insights, currently in development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className={cn(
                "flex flex-col p-10 rounded-3xl border relative overflow-hidden",
                index === 1
                  ? "border-gray-900 dark:border-white bg-gray-900 dark:bg-white text-white dark:text-black"
                  : "border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-black",
              )}
            >
              {tier.disabled && (
                <div className="absolute top-6 right-6 px-3 py-1 bg-white/20 dark:bg-black/10 rounded-full text-xs font-bold tracking-wider uppercase">
                  In Development
                </div>
              )}

              <div className="mb-8">
                <h4
                  className={cn(
                    "text-xl font-bold mb-2",
                    index === 1
                      ? "text-white dark:text-black"
                      : "text-gray-900 dark:text-white",
                  )}
                >
                  {tier.name}
                </h4>
                <div className="flex items-baseline gap-2 mb-4 h-12">
                  <span
                    className={cn(
                      "text-4xl sm:text-5xl font-bold tracking-tighter",
                      index === 1
                        ? "text-white dark:text-black"
                        : "text-gray-900 dark:text-white",
                    )}
                  >
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span
                      className={cn(
                        "text-base",
                        index === 1
                          ? "text-gray-300 dark:text-gray-600"
                          : "text-gray-500",
                      )}
                    >
                      {tier.period}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    "text-base font-light",
                    index === 1
                      ? "text-gray-300 dark:text-gray-700"
                      : "text-gray-600 dark:text-gray-400",
                  )}
                >
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {tier.features.map((feature, fIndex) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex items-start gap-3 text-base",
                      index === 1
                        ? "text-gray-200 dark:text-gray-800"
                        : "text-gray-900 dark:text-gray-300",
                    )}
                  >
                    {fIndex === 0 && index === 1 ? (
                      <span
                        className={cn(
                          "font-semibold",
                          index === 1
                            ? "text-white dark:text-black"
                            : "text-gray-900 dark:text-white",
                        )}
                      >
                        {feature}
                      </span>
                    ) : (
                      <>
                        <Check
                          className={cn(
                            "h-5 w-5 shrink-0",
                            index === 1
                              ? "text-gray-400 dark:text-gray-500"
                              : "text-gray-400",
                          )}
                        />
                        <span>{feature}</span>
                      </>
                    )}
                  </li>
                ))}
              </ul>

              {tier.disabled ? (
                <div
                  className={cn(
                    "inline-flex h-14 items-center justify-center px-8 text-base font-bold tracking-tight rounded-2xl cursor-not-allowed opacity-70",
                    index === 1
                      ? "bg-white/20 dark:bg-black/10 text-white dark:text-black"
                      : "bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white",
                  )}
                >
                  {tier.cta}
                </div>
              ) : (
                <Link
                  href={tier.href}
                  className={cn(
                    "inline-flex h-14 items-center justify-center px-8 text-base font-bold tracking-tight transition-all rounded-2xl group",
                    index === 1
                      ? "bg-white dark:bg-black text-black dark:text-white hover:scale-105"
                      : "bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-zinc-800",
                  )}
                >
                  {tier.cta}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
