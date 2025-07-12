import {
  FileText,
  Calendar,
  Mail,
  Shield,
  Cookie,
  Database,
  Lock,
  Eye,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";

const sections = [
  {
    id: "introduction",
    title: "1. Introduction",
    content:
      "This Privacy Policy explains how PokerPlanning.org collects, uses, and protects your information when you use our service. We are committed to ensuring that your privacy is protected and that we handle your data responsibly.",
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    content:
      "We collect information to provide better services to our users. This includes: (a) Information you provide directly, such as your username when joining a planning session; (b) Information collected automatically, including IP addresses, browser type, and usage data through Google Analytics; (c) Session data, such as votes and participation in planning poker sessions.",
  },
  {
    id: "cookies",
    title: "3. Cookies and Tracking",
    content:
      "We use cookies and similar tracking technologies to improve your experience. This includes: essential cookies for site functionality, Google Analytics cookies for understanding usage patterns, and session cookies to maintain your login state. You can control cookie settings through your browser preferences.",
  },
  {
    id: "data-usage",
    title: "4. How We Use Your Information",
    content:
      "We use the collected information to: provide and maintain our planning poker service, improve user experience and site functionality, analyze usage patterns to enhance our features, and ensure the security and integrity of our service. We do not sell or rent your personal information to third parties.",
  },
  {
    id: "data-storage",
    title: "5. Data Storage and Security",
    content:
      "Your data is stored securely using industry-standard practices. Session data is temporary and automatically deleted after sessions end. We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction.",
  },
  {
    id: "third-party",
    title: "6. Third-Party Services",
    content:
      "We use Google Analytics to analyze website usage and improve our service. Google Analytics may collect and process data according to their own privacy policies. We do not share your personal information with any other third-party services except as required by law.",
  },
  {
    id: "user-rights",
    title: "7. Your Rights",
    content:
      "You have the right to: access the information we hold about you, request correction of any inaccurate information, request deletion of your data, opt-out of analytics tracking, and withdraw consent for data processing. To exercise these rights, please contact us through our GitHub repository.",
  },
  {
    id: "data-retention",
    title: "8. Data Retention",
    content:
      "We retain your information only for as long as necessary to provide our services. Session data is automatically deleted after the planning session ends. Analytics data is retained according to Google Analytics' data retention policies. You can request deletion of your data at any time.",
  },
  {
    id: "children",
    title: "9. Children's Privacy",
    content:
      "PokerPlanning.org is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.",
  },
  {
    id: "changes",
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date. Your continued use of the service after changes constitutes acceptance of the updated policy.",
  },
  {
    id: "contact",
    title: "11. Contact Information",
    content:
      "If you have any questions or concerns about this Privacy Policy or our data practices, please contact us through our GitHub repository at https://github.com/INQTR/poker-planning/issues or contribute to the discussion at https://github.com/INQTR/poker-planning/discussions.",
  },
];

export function PrivacyPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate -z-10 overflow-hidden bg-linear-to-b from-indigo-100/20 dark:from-indigo-900/20 pt-14">
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
                Privacy Policy
              </h1>
              <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-300">
                Learn how we collect, use, and protect your information at
                PokerPlanning.org.
              </p>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Notice section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-md bg-green-50 dark:bg-green-900/20 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <Shield
                    className="h-5 w-5 text-green-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                    Your Privacy Matters
                  </h3>
                  <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                    <p>
                      We take your privacy seriously. This policy explains our
                      commitment to protecting your data and your rights as a
                      user of our open-source planning poker tool.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy sections */}
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

        {/* Key features section */}
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Cookie className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Cookie Control
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Manage your cookie preferences through your browser
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Database className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Minimal Data
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  We only collect what&apos;s necessary for the service
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Lock className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Secure Storage
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Industry-standard security measures protect your data
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 text-center">
                <Eye className="mx-auto h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                  Transparency
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Open source code means full transparency
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-gray-50 dark:bg-gray-800 px-6 py-10 sm:px-10 sm:py-16 lg:px-12">
              <div className="mx-auto max-w-2xl text-center">
                <Lock className="mx-auto h-12 w-12 text-indigo-600 dark:text-indigo-400" />
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                  Questions about privacy?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-300">
                  We&apos;re committed to transparency. If you have any
                  questions about how we handle your data, please reach out
                  through GitHub.
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
                  This privacy policy is effective as of January 1, 2024 and
                  will remain in effect except with respect to any changes in
                  its provisions in the future.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Open Source Commitment
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  As an open-source project, our code is publicly available for
                  review on GitHub, ensuring complete transparency in how we
                  handle data.
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
