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
  FileDown,
  TrendingUp,
  Target,
  Layers,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { GithubIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { 
  RealtimeVotingAnimation,
  AnalyticsAnimation,
  TimerAnimation,
  CanvasAnimation,
  ScalesAnimation,
  PlayerManagementAnimation,
  IssuesAnimation,
  AutoCompleteAnimation
} from "./feature-animations";

// Features that are available now
const coreFeatures = [
  {
    name: "Real-time Voting",
    description:
      "Simultaneous card selection with instant sync across all participants",
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    visual: RealtimeVotingAnimation,
  },
  {
    name: "Multiple Voting Scales",
    description:
      "Fibonacci, Standard, T-Shirt sizes, or create your own custom scale",
    icon: Layers,
    gradient: "from-amber-500 to-orange-600",
    visual: ScalesAnimation,
  },
  {
    name: "Results Analytics",
    description:
      "Average, median, mode, consensus strength, and outlier detection",
    icon: BarChart3,
    gradient: "from-emerald-500 to-teal-600",
    visual: AnalyticsAnimation,
  },
  {
    name: "Whiteboard Canvas",
    description: "Drag-and-drop React Flow canvas with multiple node types",
    icon: Layout,
    gradient: "from-blue-500 to-cyan-600",
    visual: CanvasAnimation,
  },
  {
    name: "Issues Management",
    description:
      "Create, edit, and track issues with CSV export and vote statistics",
    icon: FileText,
    gradient: "from-sky-500 to-blue-600",
    visual: IssuesAnimation,
  },
  {
    name: "Auto-Complete Voting",
    description: "3-second countdown auto-reveal when all participants vote",
    icon: PlayCircle,
    gradient: "from-rose-500 to-pink-600",
    visual: AutoCompleteAnimation,
  },
  {
    name: "Player Management",
    description: "Join and leave rooms freely, with spectator mode support",
    icon: UserPlus,
    gradient: "from-indigo-500 to-violet-600",
    visual: PlayerManagementAnimation,
  },
  {
    name: "Synchronized Timer",
    description:
      "Server-synced countdown with start, pause, and reset controls",
    icon: Timer,
    gradient: "from-fuchsia-500 to-purple-600",
    visual: TimerAnimation,
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

const recentlyShipped = [
  {
    name: "Jira Cloud Integration",
    description:
      "Two-way sync — import sprints, push estimates back automatically",
    icon: Link2,
  },
  {
    name: "Time-to-Consensus Tracking",
    description:
      "Measure how long your team takes to reach agreement on each story",
    icon: Timer,
  },
  {
    name: "Voter Alignment Matrix",
    description:
      "Visualize voting patterns and spot persistent disagreements",
    icon: Target,
  },
  {
    name: "Sprint Predictability Score",
    description:
      "Track estimation accuracy over time with predictability health metrics",
    icon: TrendingUp,
  },
  {
    name: "Enhanced Data Exports",
    description: "Export full session data as CSV or JSON with analytics included",
    icon: FileDown,
  },
];

const upNextFeatures = [
  {
    name: "GitHub Integration",
    description:
      "Import issues from repositories and push estimates to GitHub Projects",
    icon: Code2,
  },
  {
    name: "Automated Session Summaries",
    description:
      "Auto-generated session reports delivered to participants via email",
    icon: FileText,
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
    <div className="bg-white dark:bg-black min-h-screen selection:bg-primary/10 selection:text-primary">
      <Navbar />

      <main className="relative isolate overflow-hidden bg-white dark:bg-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden bg-white dark:bg-black">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
                Powerful features,<br />
                <span className="text-gray-300 dark:text-zinc-700">zero complexity.</span>
              </h1>

              <p className="mt-8 text-xl sm:text-2xl leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-light">
                From real-time collaboration to advanced analytics, AgileKit has
                everything your team needs. Core features free, no sign-up
                required.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-black dark:bg-white px-12 text-lg font-bold tracking-tight text-white dark:text-black hover:scale-105 transition-transform duration-200 rounded-2xl w-full sm:w-auto"
                >
                  Start Planning Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://github.com/INQTR/poker-planning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 px-12 text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors rounded-2xl w-full sm:w-auto"
                >
                  <GithubIcon className="h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Features Strip */}
        <section className="border-y border-gray-200/50 dark:border-zinc-800/50 bg-gray-50/50 dark:bg-zinc-900/10">
          <div className="mx-auto max-w-[90rem] px-6 py-8 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {quickFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-400"
                >
                  <feature.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                  <span>{feature.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Features Bento Grid */}
        <section className="py-24 sm:py-32 bg-white dark:bg-black">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                Core Features
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                Built for modern teams.<br />
                <span className="text-gray-400 dark:text-zinc-600">Faster, more accurate.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 grid-flow-dense">
              {coreFeatures.map((feature, index) => (
                <div
                  key={feature.name}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl bg-gray-50/50 dark:bg-zinc-900/10 border border-gray-200/50 dark:border-zinc-800/50 flex flex-col",
                    index === 0 && "sm:col-span-2 sm:row-span-2",
                    index === 2 && "lg:col-span-2 min-h-[300px]",
                    index !== 0 && index !== 2 && "min-h-[320px]"
                  )}
                >
                  {/* Content Top */}
                  <div className="relative z-10 p-6 sm:p-8 flex-shrink-0 pointer-events-none">
                    <div
                      className={cn(
                        "inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 mb-6 pointer-events-auto shadow-sm",
                      )}
                    >
                      <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900 dark:text-white" />
                    </div>

                    <h3
                      className={cn(
                        "font-bold tracking-tight text-gray-900 dark:text-white mb-2 pointer-events-auto",
                        index === 0 ? "text-2xl sm:text-3xl" : "text-xl",
                      )}
                    >
                      {feature.name}
                    </h3>
                    <p
                      className={cn(
                        "text-gray-600 dark:text-gray-400 font-light leading-relaxed pointer-events-auto",
                        index === 0 ? "text-base sm:text-lg max-w-md" : "text-sm sm:text-base",
                      )}
                    >
                      {feature.description}
                    </p>
                    
                    {index === 0 && (
                      <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-zinc-700/50 flex items-center gap-4 pointer-events-auto">
                        <div className="flex -space-x-3">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
                            >
                              {i}
                            </div>
                          ))}
                        </div>
                        <span className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">
                          Unlimited team members
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Background animation Bottom */}
                  <div className="relative flex-1 w-full min-h-[140px] pointer-events-none">
                    {feature.visual && <feature.visual />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Analytics Showcase */}
        <section className="py-24 sm:py-32 bg-gray-50/50 dark:bg-zinc-900/10 border-y border-gray-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              <div>
                <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                  Smart Analytics
                </p>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                  Understand your team&apos;s<br />
                  <span className="text-gray-400 dark:text-zinc-600">estimation patterns.</span>
                </h2>
                <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  Get instant insights into voting distribution, consensus
                  levels, and identify outliers. Make better decisions with
                  data-driven estimation.
                </p>

                <div className="mt-12 grid grid-cols-2 gap-6">
                  {analyticsFeatures.map((feature) => (
                    <div
                      key={feature.name}
                      className="flex items-center gap-4 text-gray-900 dark:text-gray-300"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl">
                        <feature.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-white">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Preview Card */}
              <div className="bg-white dark:bg-black rounded-[2rem] p-8 sm:p-12 border border-gray-200/50 dark:border-zinc-800/50">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Voting Results
                  </h3>
                  <span className="px-4 py-2 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold tracking-wide">
                    High Consensus
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-6 mb-10">
                  {[
                    { label: "Average", value: "5.2" },
                    { label: "Median", value: "5" },
                    { label: "Mode", value: "5" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-200/50 dark:border-zinc-800/50"
                    >
                      <div className="text-3xl font-bold tracking-tighter text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 uppercase tracking-widest">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {[
                    { value: "3", count: 2, width: "20%" },
                    { value: "5", count: 5, width: "50%" },
                    { value: "8", count: 3, width: "30%" },
                  ].map((bar) => (
                    <div key={bar.value} className="flex items-center gap-4">
                      <span className="w-8 text-base font-bold text-gray-900 dark:text-white">
                        {bar.value}
                      </span>
                      <div className="flex-1 h-4 bg-gray-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-900 dark:bg-white rounded-full"
                          style={{ width: bar.width }}
                        />
                      </div>
                      <span className="w-6 text-base font-medium text-gray-500 dark:text-gray-400 text-right">
                        {bar.count}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200/50 dark:border-zinc-800/50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-400">
                    <Users className="h-5 w-5" />
                    <span>10 participants</span>
                  </div>
                  <div className="text-base font-bold text-green-700 dark:text-green-400">
                    89% consensus
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-24 sm:py-32 bg-white dark:bg-black">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                Modern Stack
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                Built with the best.<br />
                <span className="text-gray-400 dark:text-zinc-600">Speed and reliability.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="rounded-3xl bg-gray-50/50 dark:bg-zinc-900/10 p-8 sm:p-10 border border-gray-200/50 dark:border-zinc-800/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl mb-8">
                    <tech.icon className="h-6 w-6 text-gray-900 dark:text-white" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                    {tech.name}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-gray-600 dark:text-gray-400">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why AgileKit */}
        <section className="py-24 sm:py-32 bg-gray-50/50 dark:bg-zinc-900/10 border-y border-gray-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                Why AgileKit
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                Different by design.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="rounded-3xl bg-black dark:bg-white p-10 sm:p-12">
                <div className="text-6xl sm:text-7xl font-bold tracking-tighter text-white dark:text-black mb-6">$0</div>
                <h3 className="text-2xl font-bold tracking-tight text-white dark:text-black mb-4">Free Core</h3>
                <p className="text-lg font-light leading-relaxed text-gray-400 dark:text-gray-600">
                  Core features free. Optional paid features may be available
                  in the future.
                </p>
              </div>

              <div className="rounded-3xl bg-white dark:bg-black p-10 sm:p-12 border border-gray-200/50 dark:border-zinc-800/50">
                <div className="flex h-16 w-16 items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-2xl mb-8">
                  <Shield className="h-8 w-8 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                  Privacy Controls
                </h3>
                <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  Essential cookies keep sign-in and preferences working.
                  Optional analytics stay off unless you opt in.
                </p>
              </div>

              <div className="rounded-3xl bg-white dark:bg-black p-10 sm:p-12 border border-gray-200/50 dark:border-zinc-800/50">
                <div className="flex h-16 w-16 items-center justify-center bg-gray-50 dark:bg-zinc-900 rounded-2xl mb-8">
                  <GithubIcon className="h-8 w-8 text-gray-900 dark:text-white" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                  Open Source
                </h3>
                <p className="text-lg font-light leading-relaxed text-gray-600 dark:text-gray-400">
                  Fully transparent, community-driven. Contribute, fork, or
                  self-host.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-24 sm:py-32 bg-white dark:bg-black">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mb-16">
              <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
                Roadmap
              </p>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
                Shipping fast.<br />
                <span className="text-gray-400 dark:text-zinc-600">Here&apos;s what&apos;s new.</span>
              </h2>
            </div>

            {/* Recently Shipped */}
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
              Recently Shipped
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {recentlyShipped.map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-3xl bg-gray-50/50 dark:bg-zinc-900/10 p-8 border border-gray-200/50 dark:border-zinc-800/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl">
                      <feature.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <span className="px-4 py-2 rounded-full bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold tracking-wide">
                      Shipped
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Up Next */}
            <h3 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
              Up Next
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upNextFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="rounded-3xl bg-gray-50/50 dark:bg-zinc-900/10 p-8 border border-gray-200/50 dark:border-zinc-800/50"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex h-12 w-12 items-center justify-center bg-white dark:bg-zinc-900 border border-gray-200/50 dark:border-zinc-800/50 rounded-2xl">
                      <feature.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                    </div>
                    <span className="px-4 py-2 rounded-full bg-gray-200/50 dark:bg-zinc-800/50 text-gray-900 dark:text-white text-sm font-bold tracking-wide">
                      Planned
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                    {feature.name}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 sm:py-32 bg-gray-50/50 dark:bg-zinc-900/10 border-t border-gray-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[0.95]">
                Ready to improve your<br />
                <span className="text-gray-400 dark:text-zinc-600">sprint planning?</span>
              </h2>
              <p className="mt-8 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                Join teams worldwide using AgileKit. Start your first session in
                seconds.
              </p>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-black dark:bg-white px-12 text-lg font-bold tracking-tight text-white dark:text-black hover:scale-105 transition-transform duration-200 rounded-2xl w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://github.com/INQTR/poker-planning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-16 items-center justify-center gap-2 bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 px-12 text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors rounded-2xl w-full sm:w-auto"
                >
                  <GithubIcon className="h-5 w-5" />
                  Contribute
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
