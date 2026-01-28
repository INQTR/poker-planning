"use client";

import Link from "next/link";
import {
  Users,
  Zap,
  Timer,
  BarChart3,
  Layout,
  PlayCircle,
  UserPlus,
  FileText,
  Moon,
  Smartphone,
  Link2,
  ArrowRight,
  Shield,
  Eye,
  Code2,
  Database,
  Palette,
  Sparkles,
  FileDown,
  History,
  Settings,
  TrendingUp,
  Target,
  Layers,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

// Features that are available now
const coreFeatures = [
  {
    name: "Real-time Voting",
    description:
      "Simultaneous card selection with instant sync across all participants",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
  },
  {
    name: "Multiple Voting Scales",
    description:
      "Fibonacci, Standard, T-Shirt sizes, or create your own custom scale",
    icon: Layers,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Results Analytics",
    description:
      "Average, median, mode, consensus strength, and outlier detection",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "Whiteboard Canvas",
    description: "Drag-and-drop React Flow canvas with multiple node types",
    icon: Layout,
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    name: "Issues Management",
    description:
      "Create, edit, and track issues with CSV export and vote statistics",
    icon: FileText,
    gradient: "from-sky-500 to-blue-600",
  },
  {
    name: "Auto-Complete Voting",
    description: "3-second countdown auto-reveal when all participants vote",
    icon: PlayCircle,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "Player Management",
    description: "Join and leave rooms freely, with spectator mode support",
    icon: UserPlus,
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    name: "Synchronized Timer",
    description:
      "Server-synced countdown with start, pause, and reset controls",
    icon: Timer,
    gradient: "from-fuchsia-500 to-purple-600",
  },
];

const quickFeatures = [
  { name: "No Sign-up Required", icon: Zap },
  { name: "Dark/Light Theme", icon: Moon },
  { name: "Mobile Responsive", icon: Smartphone },
  { name: "Shareable Links", icon: Link2 },
  { name: "CSV Export", icon: FileDown },
  { name: "Spectator Mode", icon: Eye },
];

const comingSoonFeatures = [
  {
    name: "Session History",
    description: "View and analyze past planning sessions",
    icon: History,
  },
  {
    name: "Jira Integration",
    description: "Import and sync issues directly from Jira",
    icon: Settings,
  },
];

const techStack = [
  {
    name: "Next.js 15",
    description: "React framework with App Router",
    icon: Code2,
  },
  {
    name: "Convex",
    description: "Real-time serverless backend",
    icon: Database,
  },
  {
    name: "React Flow",
    description: "Interactive whiteboard canvas",
    icon: Layers,
  },
  {
    name: "Tailwind CSS",
    description: "Modern utility-first styling",
    icon: Palette,
  },
];

const analyticsFeatures = [
  { name: "Average Score", icon: TrendingUp },
  { name: "Median Value", icon: Target },
  { name: "Consensus Strength", icon: Users },
  { name: "Outlier Detection", icon: Eye },
];

export function FeaturesContent() {
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
                id="features-pattern"
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
              fill="url(#features-pattern)"
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
        <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl">
                Powerful features,
                <span className="block mt-2 bg-gradient-to-r from-primary via-purple-500 to-violet-600 bg-clip-text text-transparent">
                  zero complexity
                </span>
              </h1>

              <p className="mt-8 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From real-time collaboration to advanced analytics, AgileKit has
                everything your team needs. Core features free, no sign-up
                required.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  render={
                    <Link href="/" className="inline-flex items-center" />
                  }
                  nativeButton={false}
                  size="lg"
                  className="group rounded-full px-8 py-4 text-base"
                >
                  Start Planning Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  render={
                    <a
                      href="https://github.com/INQTR/poker-planning"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    />
                  }
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-4 text-base"
                >
                  <GithubIcon className="mr-2 h-5 w-5" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Features Strip */}
        <section className="border-y border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {quickFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <feature.icon className="h-4 w-4 text-primary" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Bento Grid */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
                Core Features
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Built for modern teams
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Every feature designed to make estimation faster and more
                accurate
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coreFeatures.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 ring-1 ring-gray-200 dark:ring-zinc-800 transition-all duration-300 hover:ring-primary/50",
                    index === 0 && "sm:col-span-2 sm:row-span-2",
                    index === 2 && "lg:col-span-2",
                  )}
                >
                  {/* Gradient background on hover */}
                  <div
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                      feature.gradient,
                    )}
                  />

                  <div className="relative">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br mb-6",
                        feature.gradient,
                      )}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>

                    <h3
                      className={cn(
                        "font-semibold text-gray-900 dark:text-white mb-2",
                        index === 0 ? "text-2xl" : "text-lg",
                      )}
                    >
                      {feature.name}
                    </h3>
                    <p
                      className={cn(
                        "text-gray-600 dark:text-gray-400",
                        index === 0 ? "text-base" : "text-sm",
                      )}
                    >
                      {feature.description}
                    </p>

                    {index === 0 && (
                      <div className="mt-8 flex items-center gap-4">
                        <div className="flex -space-x-2">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 ring-2 ring-white dark:ring-zinc-900 flex items-center justify-center text-xs font-medium text-white"
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Unlimited team members
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section className="relative py-24 sm:py-32 bg-gray-900 dark:bg-black overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/20 via-transparent to-purple-600/20 blur-3xl rounded-full" />
          </div>

          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
                  Smart Analytics
                </p>
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
                  Understand your team&apos;s estimation patterns
                </h2>
                <p className="mt-6 text-lg text-gray-300">
                  Get instant insights into voting distribution, consensus
                  levels, and identify outliers. Make better decisions with
                  data-driven estimation.
                </p>

                <div className="mt-10 grid grid-cols-2 gap-4">
                  {analyticsFeatures.map((feature) => (
                    <div
                      key={feature.name}
                      className="flex items-center gap-3 text-gray-300"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20">
                        <feature.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Preview Card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-3xl blur-2xl" />
                <div className="relative bg-zinc-900 rounded-3xl p-8 ring-1 ring-white/10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                      Voting Results
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      High Consensus
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { label: "Average", value: "5.2" },
                      { label: "Median", value: "5" },
                      { label: "Mode", value: "5" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center p-4 rounded-2xl bg-zinc-800/50"
                      >
                        <div className="text-2xl font-bold text-white">
                          {stat.value}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {[
                      { value: "3", count: 2, width: "20%" },
                      { value: "5", count: 5, width: "50%" },
                      { value: "8", count: 3, width: "30%" },
                    ].map((bar) => (
                      <div key={bar.value} className="flex items-center gap-3">
                        <span className="w-6 text-sm font-medium text-gray-400">
                          {bar.value}
                        </span>
                        <div className="flex-1 h-3 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-purple-600 rounded-full"
                            style={{ width: bar.width }}
                          />
                        </div>
                        <span className="w-4 text-sm text-gray-500">
                          {bar.count}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>10 participants</span>
                    </div>
                    <div className="text-sm text-emerald-400 font-medium">
                      89% consensus
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
                Modern Stack
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Built with the best
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Powered by cutting-edge technology for speed and reliability
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 ring-1 ring-gray-200 dark:ring-zinc-800 hover:ring-primary/50 transition-all"
                >
                  <tech.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {tech.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AgileKit */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
                Why AgileKit
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                Different by design
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-8 text-white">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="text-5xl font-bold mb-2">$0</div>
                  <h3 className="text-xl font-semibold mb-2">Free Core</h3>
                  <p className="text-white/80">
                    Core features free. Optional paid features may be available
                    in the future.
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 ring-1 ring-gray-200 dark:ring-zinc-800">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Zero Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  No analytics, no cookies, no data collection. Your privacy is
                  our priority.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 p-8 ring-1 ring-gray-200 dark:ring-zinc-800">
                <GithubIcon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Open Source
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fully transparent, community-driven. Contribute, fork, or
                  self-host.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Coming Soon */}
        <section className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-950/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center mb-16">
              <p className="text-sm font-medium tracking-widest uppercase text-primary mb-4">
                Roadmap
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Coming Soon
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Features we&apos;re working on based on community feedback
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {comingSoonFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="relative rounded-2xl bg-white/50 dark:bg-zinc-900/50 p-6 ring-1 ring-gray-200 dark:ring-zinc-800"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800">
                      <feature.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium">
                      Soon
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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
                Ready to improve your
                <span className="block mt-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  sprint planning?
                </span>
              </h2>
              <p className="mt-6 text-lg text-gray-300">
                Join teams worldwide using AgileKit. Start your first session in
                seconds.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  render={
                    <Link href="/" className="inline-flex items-center" />
                  }
                  nativeButton={false}
                  size="lg"
                  className="group rounded-full px-8 py-4 text-base"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  render={
                    <a
                      href="https://github.com/INQTR/poker-planning"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    />
                  }
                  nativeButton={false}
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-4 text-base bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <GithubIcon className="mr-2 h-5 w-5" />
                  Contribute
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
