"use client";

import Link from "next/link";
import { Check, ArrowRight, Play } from "lucide-react";
import { PricingSection } from "@/components/homepage";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const comparisonCategories = [
  {
    category: "Core Planning",
    features: [
      { name: "Team members", free: "Unlimited", pro: "Unlimited" },
      { name: "Planning sessions", free: "Unlimited", pro: "Unlimited" },
      { name: "Real-time voting & whiteboard", free: true, pro: true },
      { name: "Spectator mode", free: true, pro: true },
      { name: "Session timer", free: true, pro: true },
    ],
  },
  {
    category: "History & Retention",
    features: [
      { name: "Session history", free: "5-day rolling", pro: "Unlimited" },
      { name: "Issue & vote data retention", free: "5 days", pro: "Unlimited" },
    ],
  },
  {
    category: "Analytics & Insights",
    features: [
      { name: "Basic results summary", free: true, pro: true },
      { name: "Time-to-consensus tracking", free: false, pro: true },
      { name: "Voter alignment matrix", free: false, pro: true },
      { name: "Sprint predictability score", free: false, pro: true },
      { name: "Estimation accuracy trends", free: false, pro: true },
      { name: "Automated session summaries", free: false, pro: true },
    ],
  },
  {
    category: "Exports & Integrations",
    features: [
      { name: "CSV export", free: true, pro: true },
      { name: "JSON & analytics export", free: false, pro: true },
      { name: "Two-way Jira Cloud sync", free: false, pro: true },
      { name: "GitHub integration", free: false, pro: true },
    ],
  },
  {
    category: "Support",
    features: [
      { name: "Community support", free: true, pro: true },
      { name: "Priority email support", free: false, pro: true },
    ],
  },
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
    <div className="bg-white dark:bg-black min-h-screen selection:bg-primary/10 selection:text-primary">
      <Navbar />

      <main className="relative isolate overflow-hidden bg-white dark:bg-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-white dark:bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
                Simple pricing,<br />
                <span className="text-gray-300 dark:text-zinc-700">infinite value.</span>
              </h1>

              <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                AgileKit is completely free for core planning sessions today.
                Pro is in development and is planned to add deeper insights,
                longer retention, and workflow integrations.
              </p>

              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-base font-medium text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-gray-900 dark:text-white" />
                  <span>No credit card required for Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-gray-900 dark:text-white" />
                  <span>Pro checkout not live yet</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-gray-900 dark:text-white" />
                  <span>Open source</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Banner */}
        <section className="border-y border-gray-200/50 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="mx-auto max-w-[90rem] px-6 py-12 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl">
                <p className="text-sm font-bold tracking-widest text-primary uppercase mb-2">
                  Launch status
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                  Paid checkout is not live yet
                </h2>
                <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  We are preparing the site for payment-provider approval
                  before enabling any live checkout. Exact launch pricing,
                  final billing terms, and any Pro-specific retention rules
                  will be published here before checkout goes live.
                </p>
              </div>
              <div className="shrink-0 flex flex-col gap-4 w-full lg:w-auto">
                <div className="rounded-2xl border border-gray-200/50 bg-white p-6 text-center text-base font-medium text-gray-600 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:text-gray-400">
                  Custom or enterprise pricing is not currently offered.
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                  <Link href="/refund-policy" className="hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4">Refund policy</Link>
                  <Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4">Terms</Link>
                  <a href="mailto:support@agilekit.app" className="hover:text-gray-900 dark:hover:text-white transition-colors underline underline-offset-4">Contact billing</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <PricingSection />

        {/* Comparison Table */}
        <section className="py-24 sm:py-32 bg-gray-50/50 dark:bg-zinc-900/10 border-y border-gray-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mb-16 max-w-2xl">
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                Compare Plans
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                Everything you need,<br />
                <span className="text-gray-400 dark:text-zinc-600">nothing you don&apos;t.</span>
              </h2>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-black shadow-sm">
              {/* Header */}
              <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-3 bg-gray-50/80 dark:bg-zinc-900/80 border-b border-gray-200/50 dark:border-zinc-800/50">
                <div className="px-6 sm:px-8 py-6 text-sm font-bold tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                  Feature
                </div>
                <div className="px-4 sm:px-8 py-6 text-center text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white border-l border-gray-200/50 dark:border-zinc-800/50">
                  Free
                </div>
                <div className="px-4 sm:px-8 py-6 text-center text-base sm:text-lg font-bold tracking-tight text-white bg-gray-900 dark:bg-white dark:text-black border-l border-gray-900 dark:border-white">
                  Pro
                </div>
              </div>

              {/* Category groups */}
              {comparisonCategories.map((group, groupIndex) => (
                <div key={group.category}>
                  {/* Category header */}
                  <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-3 border-b border-gray-200/50 dark:border-zinc-800/50 bg-gray-50/60 dark:bg-zinc-900/40">
                    <div className="px-6 sm:px-8 py-4 col-span-3 sm:col-span-1">
                      <span className="text-xs font-bold tracking-widest text-primary uppercase">
                        {group.category}
                      </span>
                    </div>
                    <div className="hidden sm:block border-l border-gray-200/50 dark:border-zinc-800/50" />
                    <div className="hidden sm:block border-l border-gray-200/50 dark:border-zinc-800/50" />
                  </div>

                  {/* Feature rows */}
                  <div className="divide-y divide-gray-200/50 dark:divide-zinc-800/50">
                    {group.features.map((feature) => {
                      const isProExclusive =
                        feature.free === false ||
                        (typeof feature.free === "string" &&
                          typeof feature.pro === "string" &&
                          feature.free !== feature.pro);

                      return (
                        <div
                          key={feature.name}
                          className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-3 transition-colors hover:bg-gray-50/50 dark:hover:bg-zinc-900/30"
                        >
                          <div className="px-6 sm:px-8 py-4 sm:py-5 text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200 flex items-center">
                            {feature.name}
                          </div>
                          <div className="px-4 sm:px-8 py-4 sm:py-5 text-center flex items-center justify-center border-l border-gray-200/50 dark:border-zinc-800/50">
                            {typeof feature.free === "boolean" ? (
                              feature.free ? (
                                <Check className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 dark:text-white" />
                              ) : (
                                <span className="text-gray-300 dark:text-zinc-700 text-lg">
                                  &mdash;
                                </span>
                              )
                            ) : (
                              <span className="text-sm sm:text-base font-light text-gray-600 dark:text-gray-400">
                                {feature.free}
                              </span>
                            )}
                          </div>
                          <div
                            className={`px-4 sm:px-8 py-4 sm:py-5 text-center flex items-center justify-center border-l border-gray-200/50 dark:border-zinc-800/50 ${
                              isProExclusive
                                ? "bg-gray-900/[0.03] dark:bg-white/[0.03]"
                                : ""
                            }`}
                          >
                            {typeof feature.pro === "boolean" ? (
                              feature.pro ? (
                                <div
                                  className={`flex items-center justify-center rounded-full ${
                                    isProExclusive
                                      ? "w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 dark:bg-white"
                                      : ""
                                  }`}
                                >
                                  <Check
                                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                                      isProExclusive
                                        ? "text-white dark:text-black"
                                        : "text-gray-900 dark:text-white"
                                    }`}
                                  />
                                </div>
                              ) : (
                                <span className="text-gray-300 dark:text-zinc-700 text-lg">
                                  &mdash;
                                </span>
                              )
                            ) : (
                              <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                {feature.pro}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Separator between groups */}
                  {groupIndex < comparisonCategories.length - 1 && (
                    <div className="border-b-2 border-gray-200/80 dark:border-zinc-800/80" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 sm:py-32 bg-white dark:bg-black">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-16">
              <div className="lg:col-span-5">
                <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                  FAQ
                </p>
                <h2 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
                  Frequently asked questions.
                </h2>
                <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  Everything you need to know about AgileKit pricing and plans.
                  Can&apos;t find what you&apos;re looking for? Reach out to our team.
                </p>
              </div>

              <div className="lg:col-span-7">
                <Accordion className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`item-${index}`}
                      className="bg-gray-50/50 dark:bg-zinc-900/10 rounded-3xl px-8 border border-gray-200/50 dark:border-zinc-800/50"
                    >
                      <AccordionTrigger className="text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:no-underline py-6">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-base font-light leading-relaxed text-gray-600 dark:text-gray-400 pb-6">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-24 sm:py-32 bg-gray-50/50 dark:bg-zinc-900/10 border-t border-gray-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
                Ready to plan better?
              </h2>
              <p className="mt-8 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Start using AgileKit for faster, more accurate sprint estimation
                — jump right in, completely free.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/room/new"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-black dark:bg-white px-12 text-lg font-bold tracking-tight text-white dark:text-black hover:scale-105 transition-transform duration-200 rounded-2xl w-full sm:w-auto"
                >
                  Start planning for free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/demo"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 px-12 text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors rounded-2xl w-full sm:w-auto"
                >
                  <Play className="h-5 w-5" fill="currentColor" />
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
