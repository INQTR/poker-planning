import { ArrowRight, Users, Vote, ChartBar, Zap, Sparkles } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Create a Room",
    description:
      "Start a new planning session with one click. No registration required - just share the link with your team.",
    icon: Zap,
    gradient: "from-blue-500 to-cyan-500",
    shadowColor: "shadow-blue-500/25",
  },
  {
    id: 2,
    title: "Invite Your Team",
    description:
      "Share the room URL with your team members. They can join instantly from any device, anywhere in the world.",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
    shadowColor: "shadow-green-500/25",
  },
  {
    id: 3,
    title: "Vote on Stories",
    description:
      "Present user stories and have everyone vote simultaneously. Cards remain hidden until everyone has voted.",
    icon: Vote,
    gradient: "from-purple-500 to-pink-500",
    shadowColor: "shadow-purple-500/25",
  },
  {
    id: 4,
    title: "Reach Consensus",
    description:
      "Reveal all votes at once, discuss differences, and quickly reach team consensus on story point estimates.",
    icon: ChartBar,
    gradient: "from-orange-500 to-red-500",
    shadowColor: "shadow-orange-500/25",
  },
];

export function HowItWorks() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 dark:stroke-gray-800 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="how-it-works-pattern"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <svg
            x="50%"
            y={-1}
            className="overflow-visible fill-gray-100/20 dark:fill-gray-800/20"
          >
            <path
              d="M-100.5 0h201v201h-201Z M699.5 0h201v201h-201Z M499.5 400h201v201h-201Z M-300.5 600h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#how-it-works-pattern)"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl text-center">
          {/* Animated badge */}
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200">
              <Sparkles className="inline h-4 w-4 mr-1 text-primary animate-pulse" />
              Get started in under 30 seconds
            </div>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            How
            <span className="relative">
              <span className="relative bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {" "}
                Planning Poker{" "}
              </span>
            </span>
            Works
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our streamlined process makes sprint planning efficient and
            enjoyable. Follow these simple steps to transform your estimation
            sessions.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.id} className="group relative">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-20 left-full w-full">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-700" />
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-gray-900" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-5 dark:opacity-10`}
                  />

                  {/* Step number */}
                  <div className="absolute top-3 right-3">
                    <div className="relative">
                      <div className="text-5xl font-bold bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 bg-clip-text text-transparent select-none">
                        {step.id}
                      </div>
                      <div className="absolute inset-0 text-5xl font-bold text-gray-300/30 dark:text-gray-600/30 blur-sm select-none">
                        {step.id}
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="relative mb-4">
                    <div
                      className={`inline-flex rounded-2xl bg-gradient-to-br ${step.gradient} p-3 shadow-lg ${step.shadowColor}`}
                    >
                      <step.icon
                        className="h-8 w-8 text-white"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="relative text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="relative text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Hover effect indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`h-2 w-2 rounded-full bg-gradient-to-r ${step.gradient} animate-pulse`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
