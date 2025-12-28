"use client";

import Link from "next/link";
import {
  Sparkles,
  Users,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sun,
  Smartphone,
  Globe,
  Link2,
  Eye,
  RefreshCw,
  Timer,
  FileDown,
  BarChart3,
  History,
  Settings,
  Palette,
  Code,
  Gauge,
  Lock,
  Database,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";

const coreFeatures = [
  {
    name: "Real-time Collaboration",
    description: "See votes update instantly as team members participate",
    icon: Users,
    available: true,
  },
  {
    name: "No Sign-up Required",
    description: "Start planning immediately without creating an account",
    icon: Zap,
    available: true,
  },
  {
    name: "Mobile Responsive",
    description: "Works seamlessly on all devices and screen sizes",
    icon: Smartphone,
    available: true,
  },
  {
    name: "Dark/Light Mode",
    description: "Choose your preferred theme for comfortable viewing",
    icon: Sun,
    available: true,
  },
  {
    name: "Instant Room Creation",
    description: "Create a new planning session with one click",
    icon: Sparkles,
    available: true,
  },
  {
    name: "Shareable Links",
    description: "Invite team members with a simple URL",
    icon: Link2,
    available: true,
  },
  {
    name: "Vote Hiding",
    description: "Keep votes hidden until everyone has voted",
    icon: Eye,
    available: true,
  },
  {
    name: "Clear Voting Rounds",
    description: "Reset votes for the next story estimation",
    icon: RefreshCw,
    available: true,
  },
];

const comingSoonFeatures = [
  {
    name: "Custom Voting Scales",
    description: "Create your own estimation scales beyond Fibonacci",
    icon: Settings,
  },
  {
    name: "Export Capabilities",
    description: "Export session results to CSV or PDF",
    icon: FileDown,
  },
  {
    name: "Timer Functionality",
    description: "Set time limits for estimation rounds",
    icon: Timer,
  },
  {
    name: "Session History",
    description: "View and analyze past planning sessions",
    icon: History,
  },
  {
    name: "Advanced Analytics",
    description: "Gain insights into team estimation patterns",
    icon: BarChart3,
  },
  {
    name: "Custom Themes",
    description: "Personalize the interface with custom colors",
    icon: Palette,
  },
];

const technicalFeatures = [
  {
    name: "Rust Backend",
    icon: Gauge,
    description: "Lightning-fast performance with Rust and Actix Web",
  },
  {
    name: "React 19",
    icon: Code,
    description: "Modern UI built with the latest React features",
  },
  {
    name: "GraphQL Subscriptions",
    icon: Zap,
    description: "Real-time updates via WebSocket connections",
  },
  {
    name: "Privacy First",
    icon: Lock,
    description: "No tracking, analytics, or data collection",
  },
  {
    name: "Open Source",
    icon: GithubIcon,
    description: "Fully transparent and community-driven development",
  },
  {
    name: "Domain-Driven Design",
    icon: Database,
    description: "Clean architecture for maintainability",
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 dark:from-indigo-900/20 pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white dark:bg-gray-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:ring-indigo-950 sm:-mr-80 lg:-mr-96"
          />
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200">
                  <Sparkles className="inline h-4 w-4 mr-1 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                  Everything You Need for Effective Sprint Planning
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                Features that
                <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Empower Your Team
                </span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-gray-600 dark:text-gray-300">
                Discover all the powerful features that make AgileKit
                the go-to choice for agile teams worldwide. Free forever, no
                strings attached.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  render={<Link href="/" className="inline-flex items-center" />}
                  size="lg"
                  className="group"
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
                  size="lg"
                  variant="outline"
                >
                  <GithubIcon className="mr-2 h-5 w-5" />
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Core Features Grid */}
        <div className="bg-gray-50 dark:bg-gray-900/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Core Features Available Today
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Everything you need for effective planning poker sessions,
                available right now
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {coreFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Coming Soon
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Exciting features on our roadmap based on community feedback
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoonFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 shadow-sm opacity-75"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <feature.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-gray-900 dark:bg-black py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built with Modern Technology
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Powered by cutting-edge tech for performance and reliability
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {technicalFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <feature.icon className="h-6 w-6 text-gray-300" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative overflow-hidden bg-indigo-600 dark:bg-indigo-700 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why Teams Choose AgileKit
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">$0</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    100% Free Forever
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    No premium tiers, no hidden costs
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Zero Tracking
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Your privacy is our priority
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    No Account Required
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Start planning in seconds
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Unlimited Everything
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Teams, sessions, no limits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Ready to Transform Your Sprint Planning?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join thousands of teams already using AgileKit
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  render={<Link href="/" className="inline-flex items-center" />}
                  size="lg"
                  className="group"
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
                  size="lg"
                  variant="link"
                >
                  Contribute on GitHub
                  <GithubIcon className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
