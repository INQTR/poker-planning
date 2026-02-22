import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="bg-white dark:bg-black py-24 sm:py-32 overflow-hidden relative">
      <div className="mx-auto max-w-[90rem] px-6 lg:px-8 relative z-10">
        <div className="relative rounded-[3rem] overflow-hidden bg-black dark:bg-white py-24 px-6 sm:px-12 text-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#00000015_1px,transparent_1px),linear-gradient(to_bottom,#00000015_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-white dark:text-black mb-8 leading-[1.05]">
              Ready to estimate?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-400 dark:text-gray-600 mb-12 font-light">
              Start your first planning session in seconds. Zero configuration, zero friction.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/room/new"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center gap-2 bg-white dark:bg-black px-12 text-lg font-bold tracking-tight text-black dark:text-white hover:scale-105 transition-transform duration-200 rounded-2xl"
              >
                Create Free Room
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="https://github.com/INQTR/poker-planning"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-16 w-full sm:w-auto items-center justify-center bg-transparent border-2 border-white/20 dark:border-black/20 px-12 text-lg font-bold tracking-tight text-white dark:text-black hover:bg-white/10 dark:hover:bg-black/10 transition-colors rounded-2xl"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
