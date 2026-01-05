"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ArrowRight } from "lucide-react";
import { toast } from "@/lib/toast";
import { useCopyRoomUrlToClipboard } from "@/hooks/use-copy-room-url-to-clipboard";
import {
  HowItWorks,
  FAQ,
  UseCases,
  CallToAction,
  AppPreview,
  FeaturesSection,
} from "@/components/homepage";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GithubIcon } from "@/components/icons";

export function HomeContent() {
  const router = useRouter();
  const createRoom = useMutation(api.rooms.create);
  const { copyRoomUrlToClipboard } = useCopyRoomUrlToClipboard();
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateRoom = async () => {
    setIsCreating(true);

    let roomId: string | undefined = undefined;

    try {
      roomId = await createRoom({
        name: `Game ${new Date().toLocaleTimeString()}`,
        roomType: "canvas",
      });
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      toast.error("Failed to create room. Please try again.");
    } finally {
      setIsCreating(false);
    }

    if (roomId) {
      try {
        await copyRoomUrlToClipboard(roomId);
      } catch (error) {
        console.error("Failed to copy room URL to clipboard:", error);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-black">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>

      <Header />

      <main
        id="main-content"
        className="relative isolate overflow-hidden bg-white dark:bg-black"
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="hero-pattern"
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
              fill="url(#hero-pattern)"
            />
          </svg>
          <div
            className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+10rem)] aspect-1155/678 w-6xl -translate-x-1/2 rotate-30 bg-linear-to-tr from-primary to-purple-600 opacity-25 sm:left-[calc(50%+5rem)] sm:w-360"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div
            className="absolute inset-x-0 top-[calc(50%-15rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(50%-25rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+25rem)] aspect-1155/678 w-6xl -translate-x-1/2 bg-linear-to-tr from-primary to-purple-600 opacity-25 sm:left-[calc(50%+40rem)] sm:w-360"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>

        <div className="py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
            {/* Left side: Content - 50% */}
            <div className="text-center lg:text-left px-6 lg:pl-16 xl:pl-36 lg:pr-8">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                Free Planning Poker Online
              </h1>

              <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 lg:max-w-xl">
                Join thousands of Scrum teams using our intuitive platform for
                sprint planning and story point estimation. Perfect for remote
                teams. No sign-up, no fees.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={handleCreateRoom}
                  disabled={isCreating}
                  data-testid="hero-start-button"
                  className="group relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start New Game
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/50 blur-xl" />
                </button>

                <a
                  href="https://github.com/INQTR/poker-planning"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-github-link"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 dark:bg-zinc-950 px-8 py-4 text-base font-semibold text-gray-900 dark:text-white backdrop-blur-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-zinc-900 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                >
                  <GithubIcon className="h-5 w-5" />
                  View on GitHub
                </a>
              </div>
            </div>

            {/* Right side: Live Demo - 50%, extends to screen edge */}
            <div className="relative px-6 lg:pl-0 lg:pr-0 lg:-mr-6 xl:-mr-8">
              <div className="relative rounded-2xl lg:rounded-l-2xl lg:rounded-r-none overflow-hidden shadow-2xl">
                {/* Demo iframe */}
                <iframe
                  src="/demo"
                  className="w-full h-[500px] lg:h-[700px] border-0 bg-white dark:bg-black"
                  title="Live Planning Poker Demo"
                  sandbox="allow-scripts allow-same-origin"
                />
                {/* Live indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/70 dark:bg-white/10 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  Live Demo
                </div>
              </div>
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 right-0 -z-10 bg-linear-to-tr from-primary/15 to-purple-600/15 rounded-3xl lg:rounded-r-none blur-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white dark:from-black to-transparent" />

        <HowItWorks />
        <AppPreview />
        <FeaturesSection />
        <UseCases />
        {/* TODO: we need to get real testimonials from real users */}
        {/* <Testimonials /> */}
        <FAQ />
        <CallToAction onStartGame={handleCreateRoom} loading={isCreating} />
      </main>

      <Footer />
    </div>
  );
}
