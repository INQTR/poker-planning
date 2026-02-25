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
  { name: "Session history", free: "Unlimited (for now)", pro: "Full history" },
  { name: "Analytics dashboard", free: false, pro: true },
  { name: "Export reports", free: "CSV only", pro: "CSV + JSON + Analytics" },
  { name: "Jira & GitHub integrations", free: false, pro: true },
];

const faqs = [
  {
    question: "Do all team members need a Pro account?",
    answer:
      "No. Only the room owner needs Pro to enable advanced features for that room. Other participants can join and use those features for free.",
  },
  {
    question: "What happens when Pro launches?",
    answer:
      "Right now everything is free with no limits. When Pro launches, free rooms will keep a rolling 5-day history. If your Pro subscription ends, you get a 14-day grace period before the free retention policy kicks in.",
  },
  {
    question: "Can I cancel my Pro subscription anytime?",
    answer:
      "Yes. You can cancel anytime from your dashboard. If you cancel, your rooms enter a 14-day grace period before free retention rules apply.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All major credit cards, PayPal, and local payment methods via Paddle. Paddle handles secure payments in 29 currencies.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "The Free tier has unlimited usage. When Pro launches, existing accounts will receive 6 months of free Pro access to evaluate the new features.",
  },
  {
    question: "How does billing work?",
    answer:
      "Payments are processed by Paddle, our Merchant of Record. They handle all billing, invoices, and tax compliance globally.",
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
                Better planning, forever free
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                AgileKit is 100% free for teams of any size. Upgrade to Pro to
                unlock full history, analytics, integrations, and support the
                project you love.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                <span>No credit card required</span>
                <span className="hidden sm:inline">•</span>
                <span>Cancel anytime</span>
                <span className="hidden sm:inline">•</span>
                <span>Open source</span>
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
                See exactly what you get with each plan
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
                    <div className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                      {feature.name}
                    </div>
                    <div className="px-6 py-4 text-center">
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
                    <div className="px-6 py-4 text-center">
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
                Everything you need to know about pricing
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
                Start using AgileKit for faster, more accurate sprint
                estimation — completely free.
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
