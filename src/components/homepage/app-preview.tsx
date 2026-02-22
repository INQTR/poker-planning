import Image from "next/image";
import { Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    name: "Zero friction.",
    description: "Create and join rooms instantly. No account creation slowing down your sprint planning.",
    icon: Zap,
  },
  {
    name: "Unbiased voting.",
    description: "Cards remain hidden until everyone has voted, ensuring independent estimation.",
    icon: Shield,
  },
  {
    name: "Clear insights.",
    description: "Visualize team agreement and identify outliers immediately upon revealing votes.",
    icon: TrendingUp,
  },
];

export function AppPreview() {
  return (
    <section className="bg-white dark:bg-black py-24 sm:py-32">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          <div className="lg:col-span-5 flex flex-col">
            <h2 className="text-sm font-bold tracking-widest text-primary uppercase mb-4">
              Interface
            </h2>
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-gray-900 dark:text-white leading-[1.1] mb-6">
              Designed for focus.
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 font-light mb-12">
              A distraction-free environment that keeps your team focused on the conversation, not the tool.
            </p>

            <div className="space-y-8">
              {features.map((feature) => (
                <div key={feature.name} className="flex gap-4">
                  <div className="mt-1 flex-shrink-0 p-3 bg-gray-50 dark:bg-zinc-900 rounded-2xl h-fit">
                    <feature.icon className="w-5 h-5 text-gray-900 dark:text-white" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h4>
                    <p className="text-base text-gray-600 dark:text-gray-400 font-light leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 bg-white dark:bg-black">
              <Image
                alt="Planning Poker app interface showing real-time collaboration"
                src="/agilekit-screenshot.png"
                fill
                className="object-cover object-left-top"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
