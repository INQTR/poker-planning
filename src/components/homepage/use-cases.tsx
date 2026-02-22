import { Globe, Zap, BarChart3, Users } from "lucide-react";

const useCases = [
  {
    title: "Remote-first",
    description: "Real-time collaboration that works seamlessly across continents.",
    icon: Globe,
  },
  {
    title: "Instant execution",
    description: "No lag, no waiting. Built on a high-performance reactive backend.",
    icon: Zap,
  },
  {
    title: "Data-driven",
    description: "Visualize voting patterns to identify disagreement and align quickly.",
    icon: BarChart3,
  },
  {
    title: "Universal access",
    description: "Designed for all teams. No accounts required to participate.",
    icon: Users,
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="bg-white dark:bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
              Architecture
            </h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
              Built for modern teams.
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light">
              Under the hood, a real-time sync engine ensures every vote, reveal, and state change happens instantaneously across all clients.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {useCases.map((useCase) => (
              <div key={useCase.title} className="flex flex-col p-8 bg-gray-50 dark:bg-zinc-900/50 rounded-3xl border border-gray-200/50 dark:border-zinc-800/50">
                <div className="p-3 bg-white dark:bg-black rounded-2xl w-fit mb-6 border border-gray-200/50 dark:border-zinc-800/50">
                  <useCase.icon className="w-6 h-6 text-gray-900 dark:text-white" strokeWidth={2} />
                </div>
                <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-3">
                  {useCase.title}
                </h4>
                <p className="text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
