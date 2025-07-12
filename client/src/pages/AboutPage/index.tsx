import {
  Github,
  Users,
  Shield,
  Zap,
  Twitter,
  ExternalLink,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useGitHubStats } from "@/hooks";

const timeline = [
  {
    name: "Project Inception",
    description:
      "Started by Bohdan Ivanchenko with Rust backend and React frontend, aiming to create a fast, free alternative to paid planning poker solutions.",
    date: "Aug 2021",
    dateTime: "2021-08",
  },
  {
    name: "Open Source Release",
    description:
      "Released as open source on GitHub, attracting contributors and teams looking for a privacy-focused planning tool.",
    date: "Mar 2022",
    dateTime: "2022-03",
  },
  {
    name: "Major Redesign",
    description:
      "Modernized the UI with a complete redesign, migrating from Material UI to shadcn/ui and Tailwind CSS for better performance and developer experience.",
    date: "Sep 2023",
    dateTime: "2023-09",
  },
  {
    name: "Growing Community",
    description:
      "Used by teams worldwide, with a growing community of contributors helping to shape the future of the project.",
    date: "Present",
    dateTime: "2024-01",
  },
];

export function AboutPage() {
  const { stars, isLoading } = useGitHubStats();

  const stats = [
    {
      label: "Active Teams",
      value: "5k+",
      description: "Teams use our tool daily",
    },
    {
      label: "GitHub Stars",
      value: isLoading ? "..." : stars.toString(),
      description: "Open source contributors",
    },
    { label: "Uptime", value: "99.9%", description: "Reliable infrastructure" },
  ];

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
            <div className="mx-auto max-w-2xl lg:mx-0 lg:grid lg:max-w-none lg:grid-cols-2 lg:gap-x-16 lg:gap-y-8 xl:grid-cols-1 xl:grid-rows-1 xl:gap-x-8">
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl lg:col-span-2 xl:col-auto">
                We&apos;re building the future of planning poker
              </h1>
              <div className="mt-6 max-w-xl lg:mt-0 xl:col-end-1 xl:row-start-1">
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300 sm:text-xl/8">
                  PokerPlanning.org is a free, open-source planning poker tool
                  built for modern Scrum teams. We believe estimation tools
                  should be accessible to everyone, without compromising on
                  quality or privacy.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <Button asChild size="lg">
                    <a
                      href="https://github.com/INQTR/poker-planning"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      <Github className="mr-2 h-5 w-5" />
                      View on GitHub
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href="/" className="inline-flex items-center">
                      Try it now
                      <Sparkles className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
              <img
                alt="Team collaboration"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80"
                className="mt-10 aspect-[6/5] w-full max-w-lg rounded-2xl object-cover sm:mt-16 lg:mt-0 lg:max-w-none xl:row-span-2 xl:row-end-2 xl:mt-36"
              />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Timeline section */}
        <div className="mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 overflow-hidden lg:mx-0 lg:max-w-none lg:grid-cols-4">
            {timeline.map((item) => (
              <div key={item.name}>
                <time
                  dateTime={item.dateTime}
                  className="flex items-center text-sm/6 font-semibold text-indigo-600 dark:text-indigo-400"
                >
                  <svg
                    viewBox="0 0 4 4"
                    aria-hidden="true"
                    className="mr-4 h-1 w-1 flex-none"
                  >
                    <circle r={2} cx={2} cy={2} fill="currentColor" />
                  </svg>
                  {item.date}
                  <div
                    aria-hidden="true"
                    className="absolute -ml-2 h-px w-screen -translate-x-full bg-gray-900/10 dark:bg-gray-100/10 sm:-ml-4 lg:static lg:-mr-6 lg:ml-8 lg:w-auto lg:flex-auto lg:translate-x-0"
                  />
                </time>
                <p className="mt-6 text-lg/8 font-semibold tracking-tight text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="mt-1 text-base/7 text-gray-600 dark:text-gray-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Built for teams, trusted by developers
            </h2>
            <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
              Our commitment to open source and privacy-first development has
              earned the trust of teams worldwide.
            </p>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl p-8 sm:w-3/4 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start ${
                  index === 0
                    ? "bg-gray-50 dark:bg-gray-800"
                    : index === 1
                    ? "bg-gray-900 dark:bg-gray-950"
                    : "bg-indigo-600 dark:bg-indigo-700"
                }`}
              >
                <p
                  className={`flex-none text-3xl font-bold tracking-tight ${
                    index === 0 ? "text-gray-900 dark:text-white" : "text-white"
                  }`}
                >
                  {stat.value}
                </p>
                <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                  <p
                    className={`text-lg font-semibold tracking-tight ${
                      index === 0
                        ? "text-gray-900 dark:text-white"
                        : "text-white"
                    }`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`mt-2 text-base/7 ${
                      index === 0
                        ? "text-gray-600 dark:text-gray-400"
                        : index === 1
                        ? "text-gray-400"
                        : "text-indigo-200"
                    }`}
                  >
                    {stat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values section */}
        <div className="mx-auto mt-32 max-w-7xl sm:mt-40 sm:px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 dark:bg-gray-950 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Our core values guide everything we do
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg/8 text-gray-300">
              We&apos;re committed to building tools that respect your privacy,
              deliver exceptional performance, and foster community
              collaboration.
            </p>
            <div className="mx-auto mt-20 grid max-w-4xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center">
                <Shield className="h-12 w-12 text-green-400" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Privacy First
                </h3>
                <p className="mt-2 text-gray-400">
                  No tracking, no analytics, no cookies. Your data stays yours.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="h-12 w-12 text-yellow-400" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Lightning Fast
                </h3>
                <p className="mt-2 text-gray-400">
                  Built with Rust and React for instant real-time collaboration.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-blue-400" />
                <h3 className="mt-6 text-xl font-semibold text-white">
                  Community Driven
                </h3>
                <p className="mt-2 text-gray-400">
                  Open source development with contributions from teams
                  worldwide.
                </p>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl"
            >
              <div
                style={{
                  clipPath:
                    "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
                }}
                className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-[#80caff] to-[#4f46e5] opacity-25"
              />
            </div>
          </div>
        </div>

        {/* Technology section */}
        <div className="mt-32 overflow-hidden sm:mt-40">
          <div className="mx-auto max-w-7xl px-6 lg:flex lg:px-8">
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-12 gap-y-16 lg:mx-0 lg:min-w-full lg:max-w-none lg:flex-none lg:gap-y-8">
              <div className="lg:col-end-1 lg:w-full lg:max-w-lg lg:pb-8">
                <h2 className="text-4xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                  Built with modern technology
                </h2>
                <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-400">
                  We use cutting-edge technologies to deliver a fast, reliable,
                  and scalable planning poker experience.
                </p>
                <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
                  Our tech stack is carefully chosen to provide the best
                  developer experience while ensuring top-notch performance for
                  end users. Every decision is made with scalability and
                  maintainability in mind.
                </p>
                <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Frontend
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        React 19 with TypeScript
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        TanStack Router
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Apollo GraphQL
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Tailwind CSS
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                      Backend
                    </h3>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Rust with Actix Web
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        GraphQL API
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        WebSocket support
                      </li>
                      <li className="flex items-start">
                        <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Domain-driven design
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-start justify-end gap-6 sm:gap-8 lg:contents">
                <div className="w-0 flex-auto lg:ml-auto lg:w-auto lg:flex-none lg:self-end">
                  <img
                    alt="Dashboard screenshot"
                    src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&q=80"
                    className="aspect-[7/5] w-[37rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                  />
                </div>
                <div className="contents lg:col-span-2 lg:col-end-2 lg:ml-auto lg:flex lg:w-[37rem] lg:items-start lg:justify-end lg:gap-x-8">
                  <div className="order-first flex w-64 flex-none justify-end self-end lg:w-auto">
                    <img
                      alt="Mobile app screenshot"
                      src="https://images.unsplash.com/photo-1605656816944-971cd5c1407f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                      className="aspect-[4/3] w-[24rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="flex w-96 flex-auto justify-end lg:w-auto lg:flex-none">
                    <img
                      alt="Team collaboration"
                      src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1152&h=842&q=80"
                      className="aspect-[7/5] w-[37rem] max-w-none flex-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                  <div className="hidden sm:block sm:w-0 sm:flex-auto lg:w-auto lg:flex-none">
                    <img
                      alt="Code editor"
                      src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=768&h=604&q=80"
                      className="aspect-[4/3] w-[24rem] max-w-none rounded-2xl bg-gray-50 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Creator section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
            <div className="w-full lg:max-w-lg lg:flex-auto">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Meet the creator
              </h2>
              <p className="mt-6 text-xl/8 text-gray-600 dark:text-gray-400">
                PokerPlanning.org was created by a developer who believes in the
                power of open source and the importance of accessible tools for
                every team.
              </p>
              <img
                alt="Bohdan working"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1344&h=1104&q=80"
                className="mt-16 aspect-[6/5] w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-[34.5rem]"
              />
            </div>
            <div className="w-full lg:max-w-xl lg:flex-auto">
              <h3 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                Bohdan Ivanchenko
              </h3>
              <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
                Full-stack developer passionate about creating tools that make
                teams more productive. Started PokerPlanning.org in 2021 to
                solve his own team&apos;s need for a simple, fast, and free
                planning poker tool.
              </p>
              <p className="mt-6 text-base/7 text-gray-600 dark:text-gray-400">
                &ldquo;I believe that good tools should be accessible to
                everyone. That&apos;s why PokerPlanning.org will always be free
                and open source. The community&apos;s contributions and feedback
                have been invaluable in shaping what it is today.&rdquo;
              </p>
              <div className="mt-8 flex gap-x-6">
                <a
                  href="https://github.com/INQTR"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <span className="sr-only">GitHub</span>
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://x.com/pokerplanning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
              <div className="mt-10 border-t border-gray-200 dark:border-gray-800 pt-10">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Join the community
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Whether you&apos;re a developer, designer, or just a user with
                  great ideas, we&apos;d love to have you as part of the
                  PokerPlanning.org community.
                </p>
                <div className="mt-6 flex gap-x-3">
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="https://github.com/INQTR/poker-planning/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Report Issues
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="https://github.com/INQTR/poker-planning/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Discussions
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8 mb-16">
          <div className="relative isolate overflow-hidden bg-indigo-600 dark:bg-indigo-700 px-6 py-24 shadow-2xl sm:rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start planning with your team today
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-lg/8 text-indigo-200">
              Join thousands of teams already using PokerPlanning.org for their
              estimation sessions.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button
                asChild
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-100"
              >
                <a href="/">Get started for free</a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="link"
                className="text-white hover:text-indigo-200"
              >
                <a
                  href="https://github.com/INQTR/poker-planning"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  Learn more
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle
                cx={512}
                cy={512}
                r={512}
                fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
                fillOpacity="0.7"
              />
              <defs>
                <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#4F46E5" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
