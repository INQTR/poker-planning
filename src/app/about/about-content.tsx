"use client";

import Link from "next/link";
import { Heart, Shield, Zap, ArrowRight, Star } from "lucide-react";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { useGitHubStats } from "@/hooks/use-github-stats";
import { GithubIcon } from "@/components/icons";

const values = [
  {
    icon: Heart,
    title: "Open Source",
    description:
      "Core features free. Community-driven development with full transparency.",
    color: "text-rose-500",
    bgColor: "bg-rose-500/10 dark:bg-rose-500/20",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "No accounts required. No tracking. Your estimation data stays private.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 dark:bg-emerald-500/20",
  },
  {
    icon: Zap,
    title: "Real-time",
    description:
      "Instant collaboration with live updates. Built for distributed teams.",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10 dark:bg-amber-500/20",
  },
];

const techStack = [
  { name: "Next.js 15", category: "Framework" },
  { name: "React 19", category: "UI" },
  { name: "Convex", category: "Backend" },
  { name: "React Flow", category: "Canvas" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "TypeScript", category: "Language" },
];

export function AboutContent() {
  const { stars, isLoading } = useGitHubStats();

  return (
    <div className="bg-white dark:bg-black">
      <Navbar />

      <main className="relative isolate">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="about-pattern"
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
              fill="url(#about-pattern)"
            />
          </svg>
        </div>

        {/* Hero Section */}
        <section className="relative py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Planning poker,{" "}
              <span className="bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                simplified
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              AgileKit is an open-source estimation tool with free core features
              for Scrum teams. No sign-up required. Just create a room and start
              estimating.
            </p>

            {/* GitHub stars badge */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="https://github.com/INQTR/poker-planning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 dark:bg-zinc-900 px-5 py-2.5 text-sm font-medium text-gray-900 dark:text-white transition-all duration-200 hover:bg-gray-200 dark:hover:bg-zinc-800"
              >
                <GithubIcon className="h-5 w-5" />
                <span>Star on GitHub</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-semibold text-gray-900 dark:text-white">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {isLoading ? "..." : stars.toLocaleString()}
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 sm:py-32 bg-gray-50 dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Built on principles
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                Everything we build starts with these core values.
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="group relative rounded-2xl bg-white dark:bg-zinc-900 p-8 transition-all duration-300 hover:shadow-lg dark:hover:shadow-zinc-900/50"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${value.bgColor} transition-transform duration-300 group-hover:scale-110`}
                    >
                      <value.icon className={`h-6 w-6 ${value.color}`} />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Modern stack
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Built with the latest technologies for speed and reliability.
            </p>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm transition-all duration-200 hover:border-primary/50 hover:shadow-sm"
                >
                  <span className="font-medium text-gray-900 dark:text-white">
                    {tech.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {tech.category}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-12 text-sm text-gray-500 dark:text-gray-500">
              Interested in contributing?{" "}
              <a
                href="https://github.com/INQTR/poker-planning"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Check out the repo
              </a>
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 dark:bg-zinc-900 px-8 py-16 sm:px-16 sm:py-24 text-center">
              {/* Subtle gradient overlay */}
              <div
                className="absolute inset-0 -z-10 bg-linear-to-br from-primary/20 via-transparent to-purple-600/20"
                aria-hidden="true"
              />

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to estimate?
              </h2>
              <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
                Start a planning session in seconds. No account needed.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all duration-200 hover:bg-gray-100 hover:scale-105"
                >
                  Start Planning
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="https://github.com/INQTR/poker-planning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  <GithubIcon className="h-5 w-5" />
                  View Source
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
