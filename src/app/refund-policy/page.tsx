import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, Mail, Receipt } from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Review AgileKit's current refund policy and the prelaunch status of paid plans.",
  openGraph: {
    title: "Refund Policy | AgileKit",
    description:
      "Review AgileKit's current refund policy and the prelaunch status of paid plans.",
    url: "https://agilekit.app/refund-policy",
  },
  alternates: {
    canonical: "https://agilekit.app/refund-policy",
  },
};

const sections = [
  {
    id: "status",
    title: "1. Current Status",
    content: (
      <p>
        AgileKit does not currently process live paid subscriptions or one-time
        purchases through the website. The core product is available without
        charge today. Because no live checkout is currently enabled, there are
        no active charges to refund at this time.
      </p>
    ),
  },
  {
    id: "future-purchases",
    title: "2. Future Paid Plans",
    content: (
      <p>
        Before any paid plan goes live, we will publish the applicable pricing,
        billing terms, renewal terms, taxes, and refund eligibility on our{" "}
        <Link
          href="/pricing"
          className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
        >
          Pricing
        </Link>{" "}
        page, in our{" "}
        <Link
          href="/terms"
          className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
        >
          Terms of Service
        </Link>
        , and at checkout. If a purchase is handled by a merchant of record or
        payment provider such as Paddle, that provider&apos;s checkout flow and
        order
        confirmation will identify the billing entity for the transaction.
      </p>
    ),
  },
  {
    id: "separate-agreements",
    title: "3. Separate Written Agreements",
    content: (
      <p>
        If we offer a pilot, enterprise engagement, or another paid arrangement
        under a separate written agreement before public launch, the refund and
        cancellation terms in that written agreement or order form will control
        for that purchase.
      </p>
    ),
  },
  {
    id: "questions",
    title: "4. Billing Questions",
    content: (
      <p>
        If you have billing or refund questions, contact Bohdan Ivanchenko at{" "}
        <a
          href="mailto:ivanchenko.b@gmail.com"
          className="font-medium text-gray-900 underline underline-offset-4 dark:text-white"
        >
          ivanchenko.b@gmail.com
        </a>
        . We will update this page before enabling live paid checkout on the
        site.
      </p>
    ),
  },
  {
    id: "consumer-rights",
    title: "5. Mandatory Consumer Rights",
    content: (
      <p>
        Nothing in this policy limits any mandatory refund, cancellation, or
        consumer-protection rights that apply under applicable law. Where local
        law gives you non-waivable rights, those rights continue to apply.
      </p>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Navbar />

      <main className="relative isolate overflow-hidden bg-white dark:bg-black">
        <section className="relative overflow-hidden border-b border-gray-200/50 bg-white pb-24 pt-32 dark:border-zinc-800/50 dark:bg-black sm:pb-32 sm:pt-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)]" />

          <div className="relative z-10 mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200/50 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600 dark:border-zinc-800/50 dark:bg-zinc-900 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Last updated: February 27, 2026</span>
              </div>

              <h1 className="text-6xl font-bold tracking-tighter text-gray-900 dark:text-white sm:text-7xl lg:text-8xl">
                Refund <span className="text-gray-300 dark:text-zinc-700">Policy</span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-xl font-light leading-relaxed text-gray-600 dark:text-gray-400 sm:text-2xl">
                Clear billing and refund expectations for the current prelaunch
                state of AgileKit.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-24 dark:bg-black sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="space-y-16">
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-32">
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200/50 bg-gray-50/50 py-24 dark:border-zinc-800/50 dark:bg-zinc-900/10 sm:py-32">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
              <div className="rounded-3xl border border-gray-200/50 bg-white p-8 sm:p-10 dark:border-zinc-800/50 dark:bg-black">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200/50 bg-gray-50 dark:border-zinc-800/50 dark:bg-zinc-900">
                  <Receipt className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Launch pricing updates
                </h3>
                <p className="mb-6 text-base font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  Pro checkout is not live yet. Exact pricing and live billing
                  rules will be published here before checkout is enabled.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center text-sm font-bold tracking-wide text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Review pricing page <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-3xl border border-gray-200/50 bg-white p-8 sm:p-10 dark:border-zinc-800/50 dark:bg-black">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-200/50 bg-gray-50 dark:border-zinc-800/50 dark:bg-zinc-900">
                  <Mail className="h-5 w-5 text-gray-900 dark:text-white" />
                </div>
                <h3 className="mb-3 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Need a written quote?
                </h3>
                <p className="mb-6 text-base font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  We do not currently offer a public enterprise or custom pricing
                  sheet. If that changes, we will provide written commercial
                  terms directly before sale.
                </p>
                <a
                  href="mailto:ivanchenko.b@gmail.com"
                  className="inline-flex items-center text-sm font-bold tracking-wide text-gray-900 transition-colors hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                >
                  Email billing contact <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
