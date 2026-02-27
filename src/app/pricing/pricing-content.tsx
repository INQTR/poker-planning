"use client";

import Link from "next/link";
import { Check, X, ArrowRight, Play } from "lucide-react";
import { PricingSection } from "@/components/homepage";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const comparisonFeatures = [
  { name: "Team members", free: "Unlimited", pro: "Unlimited" },
  { name: "Planning sessions", free: "Unlimited", pro: "Unlimited" },
  { name: "Real-time collaboration", free: true, pro: true },
  { name: "Session history", free: "5-day rolling", pro: "Unlimited history" },
  { name: "Basic analytics", free: true, pro: true },
  { name: "Advanced actionable insights", free: false, pro: true },
  { name: "Export reports", free: "CSV only", pro: "CSV + JSON + Analytics" },
  { name: "Jira & GitHub integrations", free: false, pro: true },
  { name: "Automated session summaries", free: false, pro: true },
];

const faqs = [
  {
    question: "Do all team members need a Pro account?",
    answer:
      "No! Only the room owner will need Pro to enable advanced features for that room. Other participants will still be able to join and use those features for free.",
  },
  {
    question: "What happens to my past sessions on the Free tier?",
    answer:
      "Until paid plans launch, current retention rules stay as they are today. If we introduce a shorter free-tier history window in the future, we will publish that change on this page before it takes effect.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Paid checkout is not live yet. Before Pro launches, we will publish the final cancellation flow, billing cadence, and any downgrade rules on this page and at checkout.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "The Free tier has unlimited usage for core features. When Pro fully launches, existing active accounts will receive early access to evaluate the new features.",
  },
];

export function PricingContent() {
  return (
    <div className="bg-white dark:bg-black min-h-screen">
      <Navbar />

      <main className="relative isolate overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="pricing-pattern"
                width={40}
                height={40}
                x="50%"
                y={-1}
                patternUnits="userSpaceOnUse"
              >
                <path d="M.5 40V.5H40" fill="none" />
              </pattern>
            </defs>
            <rect
              width="100%"
              height="100%"
              strokeWidth={0}
              fill="url(#pricing-pattern)"
            />
          </svg>
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-32 pb-8 sm:pt-40 sm:pb-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
                Simple pricing for teams of all sizes
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                AgileKit is completely free for core planning sessions today.
                Pro is in development and is planned to add deeper insights,
                longer retention, and workflow integrations.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span>No credit card required for Free</span>
                <span className="hidden sm:inline">•</span>
                <span>Pro checkout not live yet</span>
                <span className="hidden sm:inline">•</span>
                <span>Open source</span>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8 pt-4 sm:pb-12">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="rounded-3xl border border-gray-200/70 bg-gray-50/80 p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="max-w-2xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400">
                    Launch status
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Paid checkout is not live yet
                  </h2>
                  <p className="mt-3 text-base leading-7 text-gray-600 dark:text-gray-400">
                    We are preparing the site for payment-provider approval
                    before enabling any live checkout. Exact launch pricing,
                    final billing terms, and any Pro-specific retention rules
                    will be published here before checkout goes live.
                  </p>
                </div>
                <div className="shrink-0 rounded-2xl border border-gray-200/70 bg-white px-5 py-4 text-sm text-gray-600 dark:border-zinc-800 dark:bg-black dark:text-gray-400">
                  <p>Custom or enterprise pricing is not currently offered.</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 text-sm text-gray-600 dark:text-gray-400 sm:flex-row sm:items-center sm:gap-6">
                <Link
                  href="/refund-policy"
                  className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
                >
                  Review refund policy
                </Link>
                <Link
                  href="/terms"
                  className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
                >
                  Review terms
                </Link>
                <a
                  href="mailto:ivanchenko.b@gmail.com"
                  className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
                >
                  Contact billing owner
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <PricingSection />

        {/* Comparison Table */}
        <section className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Compare plans
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                See what is available now and what is planned for Pro
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200 dark:ring-zinc-800">
                {/* Header */}
                <div className="grid grid-cols-3 bg-gray-100 dark:bg-zinc-900">
                  <div className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">
                    Feature
                  </div>
                  <div className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                    Free
                  </div>
                  <div className="px-6 py-4 text-center text-sm font-semibold text-primary">
                    Pro
                  </div>
                </div>

                {/* Rows */}
                {comparisonFeatures.map((feature, index) => (
                  <div
                    key={feature.name}
                    className={`grid grid-cols-3 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-surface-1"
                        : "bg-gray-50 dark:bg-zinc-950/50"
                    }`}
                  >
                    <div className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 flex items-center">
                      {feature.name}
                    </div>
                    <div className="px-6 py-4 text-center flex items-center justify-center">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-400 dark:text-gray-600" />
                        )
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {feature.free}
                        </span>
                      )}
                    </div>
                    <div className="px-6 py-4 text-center flex items-center justify-center">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="mx-auto h-5 w-5 text-green-600 dark:text-green-500" />
                        ) : (
                          <X className="mx-auto h-5 w-5 text-gray-400 dark:text-gray-600" />
                        )
                      ) : (
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {feature.pro}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Frequently asked questions
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Everything you need to know about AgileKit pricing and plans.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <Accordion className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`item-${index}`}
                    className="bg-white dark:bg-surface-1 rounded-xl px-6 border-0 ring-1 ring-gray-200 dark:ring-zinc-800"
                  >
                    <AccordionTrigger className="text-base font-semibold text-gray-900 dark:text-white hover:no-underline py-5">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-gray-600 dark:text-gray-300 pb-5">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 sm:py-32 bg-gray-900 dark:bg-black overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <svg
              className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-white/10 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="cta-pattern"
                  width={200}
                  height={200}
                  x="50%"
                  y={-1}
                  patternUnits="userSpaceOnUse"
                >
                  <path d="M100 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                strokeWidth={0}
                fill="url(#cta-pattern)"
              />
            </svg>
            <div className="absolute inset-x-0 top-10 -z-10 transform-gpu overflow-hidden blur-3xl">
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                Ready to plan better?
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                Start using AgileKit for faster, more accurate sprint estimation
                — jump right in, completely free.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/room/new"
                  className="group inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:scale-105"
                >
                  Start planning for free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-105"
                >
                  <Play className="h-5 w-5" />
                  View demo
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
