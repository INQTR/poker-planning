"use client";

import Link from "next/link";
import { Check, Sparkles, Zap, Crown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    description: "Everything you need for effective sprint planning",
    features: [
      "Unlimited team members",
      "Unlimited planning sessions",
      "Real-time collaboration",
      "Multiple voting scales",
      "Issues management",
      "CSV export",
      "Auto-complete voting",
      "Session timer",
      "Spectator mode",
    ],
    cta: "Start Free",
    href: "/room/new",
    highlighted: false,
  },
  {
    name: "Pro",
    id: "pro",
    price: "$8",
    period: "/month",
    description: "Advanced analytics and insights for Scrum Masters",
    features: [
      "Everything in Free",
      "Analytics Dashboard",
      "Agreement trend charts",
      "Velocity tracking",
      "Vote distribution insights",
      "Session history",
      "Date range filtering",
      "Export analytics reports",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    href: "/dashboard",
    highlighted: true,
  },
];

function ShinyButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex w-full items-center justify-center overflow-hidden rounded-xl px-8 py-4 text-base font-semibold transition-all duration-300",
        className
      )}
    >
      {/* Animated gradient background */}
      <span className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_100%] animate-[shimmer_2s_linear_infinite]" />

      {/* Shine effect overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      {/* Glow effect */}
      <span className="absolute inset-0 -z-10 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-50 blur-xl group-hover:opacity-75 transition-opacity" />

      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2 text-white">
        {children}
      </span>
    </Link>
  );
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white dark:from-zinc-950 dark:via-black dark:to-zinc-950 py-24 sm:py-32"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/10 via-purple-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-primary/10 via-purple-500/10 to-transparent blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              Pricing
            </p>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Start free, upgrade when you need advanced analytics. No hidden
            fees, cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cn(
                "relative flex flex-col rounded-3xl p-8 ring-1 transition-all duration-300",
                tier.highlighted
                  ? "bg-gradient-to-b from-primary/5 via-transparent to-purple-500/5 ring-primary/50 dark:ring-primary/30 scale-[1.02] shadow-xl shadow-primary/10"
                  : "bg-white dark:bg-zinc-950 ring-gray-200 dark:ring-zinc-800 hover:ring-gray-300 dark:hover:ring-zinc-700"
              )}
            >
              {/* Popular badge */}
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-purple-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg">
                    <Crown className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl",
                      tier.highlighted
                        ? "bg-gradient-to-br from-primary to-purple-500 text-white"
                        : "bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400"
                    )}
                  >
                    {tier.highlighted ? (
                      <BarChart3 className="h-5 w-5" />
                    ) : (
                      <Zap className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {tier.name}
                  </h3>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-base text-gray-500 dark:text-gray-400">
                      {tier.period}
                    </span>
                  )}
                </div>

                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-1 space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        tier.highlighted
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-100 dark:bg-zinc-900 text-gray-500 dark:text-gray-400"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        feature === "Everything in Free"
                          ? "font-semibold text-gray-900 dark:text-white"
                          : "text-gray-600 dark:text-gray-400"
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              {tier.highlighted ? (
                <ShinyButton href={tier.href}>
                  <Crown className="h-5 w-5" />
                  {tier.cta}
                </ShinyButton>
              ) : (
                <Link
                  href={tier.href}
                  className="inline-flex w-full items-center justify-center rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-8 py-4 text-base font-semibold text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-50 dark:hover:bg-zinc-900 hover:border-gray-400 dark:hover:border-zinc-600"
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
          All prices in USD. Pro plan billed monthly.{" "}
          <Link
            href="/terms"
            className="text-primary hover:underline"
          >
            Terms apply
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
