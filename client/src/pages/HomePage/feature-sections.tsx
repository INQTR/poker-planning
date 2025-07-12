import { UsersIcon, ClockIcon, ChartBarIcon } from "lucide-react";

import pokerPlanningScreenshot from "@/assets/poker-planning-screenshot.png";

const features = [
  {
    name: "Real-time Collaboration",
    description:
      "Collaborate with your team in real-time, no matter where they are. Our tool ensures seamless communication during planning sessions.",
    icon: UsersIcon,
  },
  {
    name: "Time-saving Efficiency",
    description:
      "Streamline your planning process and save valuable time. Our intuitive interface allows for quick setup and easy estimation rounds.",
    icon: ClockIcon,
  },
  {
    name: "Improved Accuracy",
    description:
      "Enhance the accuracy of your estimates with our structured approach. Visualize and analyze estimation data to refine your planning process.",
    icon: ChartBarIcon,
  },
];

export function FeatureSections() {
  return (
    <div className="overflow-hidden bg-white dark:bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pr-8 lg:pt-4">
            <div className="lg:max-w-lg">
              <p className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                Plan Smarter
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Elevate Your Scrum Planning
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                Experience a more efficient and accurate planning process with
                our Scrum Poker tool. Designed to enhance team collaboration and
                improve estimation accuracy.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 dark:text-gray-300 lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900 dark:text-white">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute left-1 top-1 h-5 w-5 text-primary-700 dark:text-primary-400"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <img
            alt="scrum poker screenshot"
            src={pokerPlanningScreenshot}
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
