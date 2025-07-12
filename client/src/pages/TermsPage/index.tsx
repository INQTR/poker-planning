import { FileText, Calendar, Mail, AlertCircle, Shield } from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content:
      "By accessing and using PokerPlanning.org, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.",
  },
  {
    id: "use-license",
    title: "2. Use License",
    content:
      "Permission is granted to temporarily use PokerPlanning.org for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose, or remove any copyright or other proprietary notations from the materials.",
  },
  {
    id: "privacy",
    title: "3. Privacy",
    content:
      "Your use of our website is governed by our Privacy Policy. PokerPlanning.org uses cookies and Google Analytics to improve user experience and understand how our service is used. We are committed to protecting your privacy and handle your data responsibly in accordance with our Privacy Policy.",
  },
  {
    id: "disclaimer",
    title: "4. Disclaimer",
    content:
      "The materials on PokerPlanning.org are provided on an 'as is' basis. PokerPlanning.org makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.",
  },
  {
    id: "limitations",
    title: "5. Limitations",
    content:
      "In no event shall PokerPlanning.org or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on PokerPlanning.org, even if PokerPlanning.org or a PokerPlanning.org authorized representative has been notified orally or in writing of the possibility of such damage.",
  },
  {
    id: "open-source",
    title: "6. Open Source License",
    content:
      "PokerPlanning.org is open source software licensed under the MIT License. You are free to use, modify, and distribute the source code in accordance with the MIT License terms. The source code is available on GitHub.",
  },
  {
    id: "user-conduct",
    title: "7. User Conduct",
    content:
      "You agree not to use the service to: violate any laws or regulations, impersonate any person or entity, interfere with or disrupt the service or servers, or engage in any activity that could harm, disable, overburden, or impair the service.",
  },
  {
    id: "modifications",
    title: "8. Modifications to Terms",
    content:
      "PokerPlanning.org may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.",
  },
  {
    id: "governing-law",
    title: "9. Governing Law",
    content:
      "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which the service operator is located, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.",
  },
];

export function TermsPage() {
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
                Please read these terms of service carefully before using
                PokerPlanning.org.
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
                <div className="flex-shrink-0">
                  <AlertCircle
                    className="h-5 w-5 text-blue-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Open Source Software
                  </h3>
                  <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                    <p>
                      PokerPlanning.org is free and open source software. We
                      believe in transparency and community-driven development.
                      You can review our source code on GitHub.
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

            {/* Table of contents */}
            <div className="mt-16 lg:mt-0 lg:absolute lg:right-8 lg:top-[400px] lg:w-64">
              <div className="sticky top-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 p-6">
                <h3 className="flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                  <FileText className="mr-2 h-4 w-4" />
                  Table of Contents
                </h3>
                <ol className="mt-4 space-y-3 text-sm">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                      >
                        {index + 1}. {section.title.replace(/^\d+\.\s/, "")}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 px-6 py-10 sm:px-10 sm:py-16 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <Shield className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Questions about our terms?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                  If you have any questions about these Terms of Service, please
                  contact us through GitHub or open an issue in our repository.
                </p>
                <div className="mt-8 flex items-center justify-center gap-x-4">
                  <a
                    href="https://github.com/INQTR/poker-planning/issues"
                    className="inline-flex items-center text-base font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact via GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8 mb-16">
          <div className="mx-auto max-w-4xl border-t border-gray-200 dark:border-gray-800 pt-16 sm:pt-20">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Additional Information
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Effective Date
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  These terms are effective as of January 1, 2024 and will
                  remain in effect except with respect to any changes in its
                  provisions in the future.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  License Information
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  PokerPlanning.org is licensed under the MIT License. The full
                  license text is available in our GitHub repository.
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
