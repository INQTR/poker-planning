import { Zap, Shield, Globe, Users, DollarSign, Code } from "lucide-react";

const benefits = [
  {
    name: "100% Free Forever",
    description:
      "No hidden costs, no premium tiers, no limits on team size or sessions. Completely free and open-source.",
    icon: DollarSign,
  },
  {
    name: "No Sign-up Required",
    description:
      "Start your planning session instantly. No registration, no email verification, no barriers to entry.",
    icon: Zap,
  },
  {
    name: "Real-time Collaboration",
    description:
      "See team members join, vote, and participate in real-time with instant synchronization across all devices.",
    icon: Users,
  },
  {
    name: "Privacy First",
    description:
      "Your data stays in your browser. No tracking, no storing of sensitive project information on our servers.",
    icon: Shield,
  },
  {
    name: "Works Everywhere",
    description:
      "Responsive design works perfectly on desktop, tablet, and mobile. No app downloads required.",
    icon: Globe,
  },
  {
    name: "Open Source",
    description:
      "Fully transparent codebase on GitHub. Contribute features, report bugs, or host your own instance.",
    icon: Code,
  },
];

export function WhyChooseUs() {
  return (
    <div className="bg-white dark:bg-gray-900 py-32 sm:py-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
            The Smart Choice
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Why Teams Choose PokerPlanning.org
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Unlike other planning poker tools that charge monthly fees or limit
            features, we believe great Agile tools should be accessible to
            everyone.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:mt-32 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-10 gap-y-12 lg:max-w-none lg:grid-cols-3 lg:gap-y-20">
            {benefits.map((benefit) => (
              <div key={benefit.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-primary dark:bg-primary/90">
                    <benefit.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {benefit.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
