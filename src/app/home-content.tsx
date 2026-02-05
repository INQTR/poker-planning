import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import {
  HowItWorks,
  FAQ,
  UseCases,
  CallToAction,
  AppPreview,
  FeaturesSection,
} from "@/components/homepage";
import { GradientBlob } from "@/components/homepage/gradient-blob";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface VersionInfo {
  version: string;
  relativeTime: string;
}

interface HomeContentProps {
  versionInfo: VersionInfo | null;
}

export function HomeContent({ versionInfo }: HomeContentProps) {
  return (
    <div className="bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md"
      >
        Skip to main content
      </a>

      <Navbar />

      <main
        id="main-content"
        className="relative isolate overflow-hidden bg-background"
      >
        {/* Background gradient effects */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <svg
            className="absolute inset-0 h-full w-full stroke-border [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
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
            <GradientBlob className="relative left-[calc(50%+10rem)] w-6xl -translate-x-1/2 rotate-30 sm:left-[calc(50%+5rem)] sm:w-360" />
          </div>
          <div
            className="absolute inset-x-0 top-[calc(50%-15rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(50%-25rem)]"
            aria-hidden="true"
          >
            <GradientBlob className="relative left-[calc(50%+25rem)] w-6xl -translate-x-1/2 sm:left-[calc(50%+40rem)] sm:w-360" />
          </div>
        </div>

        <div className="pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 items-center">
            {/* Left side: Content - 50% */}
            <div className="text-center lg:text-left px-6 lg:pl-16 xl:pl-36 lg:pr-8">
              {versionInfo && (
                <Link
                  href="/changelog"
                  className="inline-flex items-center gap-2 mb-4 text-sm transition-opacity hover:opacity-80"
                >
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary font-medium">
                    v{versionInfo.version}
                  </span>
                  <span className="text-muted-foreground">
                    {versionInfo.relativeTime}
                  </span>
                </Link>
              )}
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Free Planning Poker Online
              </h1>

              <p className="mt-6 text-lg leading-8 text-muted-foreground lg:max-w-xl">
                Join thousands of Scrum teams using our intuitive platform for
                sprint planning and story point estimation. Perfect for remote
                teams. No sign-up, no fees.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  href="/room/new"
                  data-testid="hero-start-button"
                  className="group relative inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start New Game
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  {/* Animated glow effect */}
                  <div className="absolute inset-0 -z-10 animate-pulse rounded-full bg-primary/50 blur-xl" />
                </Link>

                <Link
                  href="/demo"
                  data-testid="hero-demo-link"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-muted px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-accent hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Play className="h-5 w-5" />
                  Try Interactive Demo
                </Link>
              </div>
            </div>

            {/* Right side: Live Demo - 50%, extends to screen edge */}
            <div className="relative px-6 lg:pl-0 lg:pr-0 lg:-mr-6 xl:-mr-8">
              <div className="relative rounded-2xl lg:rounded-l-2xl lg:rounded-r-none overflow-hidden shadow-2xl">
                {/* Demo iframe */}
                <iframe
                  src="/demo?embed=true"
                  className="w-full h-[500px] lg:h-[700px] border-0 bg-background"
                  title="Live Planning Poker Demo"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 right-0 -z-10 bg-linear-to-tr from-primary/15 to-purple-600/15 rounded-3xl lg:rounded-r-none blur-2xl" />
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-background to-transparent" />

        <HowItWorks />
        <AppPreview />
        <FeaturesSection />
        <UseCases />
        {/* TODO: we need to get real testimonials from real users */}
        {/* <Testimonials /> */}
        <FAQ />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}
