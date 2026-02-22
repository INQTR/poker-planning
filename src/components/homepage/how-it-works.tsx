import { Users, Vote, ChartBar, Zap } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Create Room",
    description: "Start a session with zero configuration. No sign-up required.",
    icon: Zap,
  },
  {
    id: "02",
    title: "Invite Team",
    description: "Share the secure link. Members join instantly from any browser.",
    icon: Users,
  },
  {
    id: "03",
    title: "Estimate",
    description: "Independent, simultaneous voting to eliminate anchoring bias.",
    icon: Vote,
  },
  {
    id: "04",
    title: "Align",
    description: "Reveal votes, discuss discrepancies, and establish consensus.",
    icon: ChartBar,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-gray-50/50 dark:bg-zinc-900/10 py-24 sm:py-32 overflow-hidden"
    >
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8 relative z-10">
        <div className="mb-16 max-w-3xl">
          <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
            Workflow
          </h2>
          <p className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1]">
            From setup to consensus in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="relative group flex flex-col bg-white dark:bg-black p-8 rounded-3xl border border-gray-200/50 dark:border-zinc-800/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-sm font-bold text-gray-300 dark:text-zinc-700">
                  {step.id}
                </span>
                <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl">
                  <step.icon
                    className="w-6 h-6 text-gray-900 dark:text-white"
                    strokeWidth={1.5}
                  />
                </div>
              </div>

              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed font-light">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
