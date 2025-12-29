"use client";

import {
  Calendar,
  Scale,
  AlertCircle,
  Shield,
  Users,
  Ban,
  FileText,
  Globe,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using AgileKit, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service. These terms apply to all users of the site, including without limitation users who are contributors of content.",
  },
  {
    id: "description",
    title: "2. Description of Service",
    content:
      "AgileKit provides a free, web-based planning poker tool for Agile teams to estimate work items. The service includes real-time collaboration features, voting mechanisms, and session management. We reserve the right to modify, suspend, or discontinue the service at any time without notice.",
  },
  {
    id: "use-license",
    title: "3. Use License",
    content:
      "AgileKit is open source software distributed under the MIT License. You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, subject to the conditions of the MIT License. The software is provided 'as is', without warranty of any kind.",
  },
  {
    id: "user-conduct",
    title: "4. User Conduct",
    content:
      "You agree not to use the service to: (a) upload or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable; (b) impersonate any person or entity; (c) interfere with or disrupt the service or servers; (d) attempt to gain unauthorized access to any portion of the service; (e) use the service for any illegal or unauthorized purpose.",
  },
  {
    id: "privacy",
    title: "5. Privacy",
    content:
      "Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy, which also governs the site and informs users of our data collection practices. We do not sell, trade, or rent your personal identification information to others.",
  },
  {
    id: "content-ownership",
    title: "6. Content Ownership",
    content:
      "You retain ownership of any content you create or share through the service. By using the service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content solely for the purpose of providing and improving the service. Session data is temporary and automatically deleted after use.",
  },
  {
    id: "disclaimers",
    title: "7. Disclaimers and Limitations",
    content:
      "The service is provided on an 'as is' and 'as available' basis. We make no warranties, expressed or implied, and hereby disclaim all warranties including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement. We do not warrant that the service will be uninterrupted, secure, or error-free.",
  },
  {
    id: "liability",
    title: "8. Limitation of Liability",
    content:
      "In no event shall AgileKit, its creators, contributors, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use or inability to use the service.",
  },
  {
    id: "indemnification",
    title: "9. Indemnification",
    content:
      "You agree to defend, indemnify, and hold harmless AgileKit and its contributors from and against any claims, damages, obligations, losses, liabilities, costs, or expenses arising from: (a) your use of and access to the service; (b) your violation of any term of these Terms of Service; (c) your violation of any third party right.",
  },
  {
    id: "termination",
    title: "10. Termination",
    content:
      "We may terminate or suspend your access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms of Service. Upon termination, your right to use the service will cease immediately.",
  },
  {
    id: "governing-law",
    title: "11. Governing Law",
    content:
      "These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of the jurisdiction in which the service operator is located, without regard to its conflict of law provisions. Any disputes shall be resolved through good faith negotiations.",
  },
  {
    id: "changes",
    title: "12. Changes to Terms",
    content:
      "We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will provide notice prior to any new terms taking effect by posting the new Terms of Service on this page and updating the 'Last updated' date.",
  },
  {
    id: "contact",
    title: "13. Contact Information",
    content:
      "If you have any questions about these Terms of Service, please contact us through our GitHub repository at https://github.com/INQTR/poker-planning/issues or join the discussion at https://github.com/INQTR/poker-planning/discussions.",
  },
];

export function TermsContent() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10 overflow-hidden bg-gradient-to-b from-indigo-100/20 dark:from-indigo-900/20 pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white dark:bg-gray-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:ring-indigo-950 sm:-mr-80 lg:-mr-96"
          />
          <div className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
              <div className="flex items-center gap-x-4 text-xs">
                <time dateTime="2024-01-01" className="text-gray-500">
                  <Calendar className="mr-1 inline h-3 w-3" />
                  Last updated: January 1, 2024
                </time>
              </div>
              <h1 className="mt-2 text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                Terms of Service
              </h1>
              <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-300">
                Please read these terms carefully before using
                AgileKit.
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Notice section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-md bg-blue-50 dark:bg-blue-900/20 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle
                    className="h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Free and Open Source
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>
                      AgileKit is a free, open-source tool licensed
                      under MIT. These terms ensure fair use and protect both
                      users and contributors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Terms sections */}
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="space-y-16">
              {sections.map((section) => (
                <div key={section.id} id={section.id}>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-base/7 text-gray-600 dark:text-gray-400">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key features section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Shield className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  MIT Licensed
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Free to use, modify, and distribute
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Users className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Community Driven
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Built by and for Agile teams
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Ban className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  No Warranties
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Provided &apos;as is&apos; under open source terms
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Globe className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Global Access
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Available worldwide, forever free
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 px-6 py-10 sm:px-10 sm:py-16 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <Scale className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Questions about our terms?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                  We believe in transparency and fairness. If you have any
                  questions about these terms, please reach out through GitHub.
                </p>
                <div className="mt-8 flex items-center justify-center gap-x-4">
                  <a
                    href="https://github.com/INQTR/poker-planning/issues"
                    className="inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Contact via GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8 mb-24">
          <div className="mx-auto max-w-4xl border-t border-gray-200 dark:border-gray-800 pt-16 sm:pt-20">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Open Source License
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  AgileKit is licensed under the MIT License. You can
                  find the full license text in our GitHub repository.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Effective Date
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  These terms of service are effective as of January 1, 2024 and
                  apply to all users of the service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
