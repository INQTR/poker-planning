import { useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Layout,
  Users,
  Shield,
  Zap,
  Github,
  CheckCircle2,
  ArrowRight,
  Sun,
  Smartphone,
  Globe,
  Link2,
  Eye,
  RefreshCw,
  Timer,
  FileDown,
  BarChart3,
  History,
  Settings,
  Palette,
  // Renamed to avoid shadowing the global 'Infinity'
  Infinity as InfinityIcon,
  MousePointer,
  Maximize,
  Navigation,
  Code,
  Gauge,
  Lock,
  Database,
} from "lucide-react";
import { useState } from "react";

import { useCreateRoomMutation } from "@/api";
import { RoomTypeSelector } from "@/components";
import { Footer } from "@/components/footer";
import { Header } from "@/components/Header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCopyRoomUrlToClipboard } from "@/hooks";
import { toast } from "@/lib/toast";

const coreFeatures = [
  {
    name: "Real-time Collaboration",
    description: "See votes update instantly as team members participate",
    icon: Users,
    available: true,
  },
  {
    name: "No Sign-up Required",
    description: "Start planning immediately without creating an account",
    icon: Zap,
    available: true,
  },
  {
    name: "Mobile Responsive",
    description: "Works seamlessly on all devices and screen sizes",
    icon: Smartphone,
    available: true,
  },
  {
    name: "Dark/Light Mode",
    description: "Choose your preferred theme for comfortable viewing",
    icon: Sun,
    available: true,
  },
  {
    name: "Instant Room Creation",
    description: "Create a new planning session with one click",
    icon: Sparkles,
    available: true,
  },
  {
    name: "Shareable Links",
    description: "Invite team members with a simple URL",
    icon: Link2,
    available: true,
  },
  {
    name: "Vote Hiding",
    description: "Keep votes hidden until everyone has voted",
    icon: Eye,
    available: true,
  },
  {
    name: "Clear Voting Rounds",
    description: "Reset votes for the next story estimation",
    icon: RefreshCw,
    available: true,
  },
];

const comingSoonFeatures = [
  {
    name: "Custom Voting Scales",
    description: "Create your own estimation scales beyond Fibonacci",
    icon: Settings,
  },
  {
    name: "Export Capabilities",
    description: "Export session results to CSV or PDF",
    icon: FileDown,
  },
  {
    name: "Timer Functionality",
    description: "Set time limits for estimation rounds",
    icon: Timer,
  },
  {
    name: "Session History",
    description: "View and analyze past planning sessions",
    icon: History,
  },
  {
    name: "Advanced Analytics",
    description: "Gain insights into team estimation patterns",
    icon: BarChart3,
  },
  {
    name: "Custom Themes",
    description: "Personalize the interface with custom colors",
    icon: Palette,
  },
];

const technicalFeatures = [
  {
    name: "Rust Backend",
    icon: Gauge,
    description: "Lightning-fast performance with Rust and Actix Web",
  },
  {
    name: "React 19",
    icon: Code,
    description: "Modern UI built with the latest React features",
  },
  {
    name: "GraphQL Subscriptions",
    icon: Zap,
    description: "Real-time updates via WebSocket connections",
  },
  {
    name: "Privacy First",
    icon: Lock,
    description: "No tracking, analytics, or data collection",
  },
  {
    name: "Open Source",
    icon: Github,
    description: "Fully transparent and community-driven development",
  },
  {
    name: "Domain-Driven Design",
    icon: Database,
    description: "Clean architecture for maintainability",
  },
];

export function FeaturesPage() {
  const navigate = useNavigate();
  const { copyRoomUrlToClipboard } = useCopyRoomUrlToClipboard();
  const [showRoomTypeSelector, setShowRoomTypeSelector] = useState(false);

  const [createRoomMutation, { loading }] = useCreateRoomMutation({
    onError: (error) => {
      toast.error(`Create room: ${error.message}`);
    },
  });

  function onCreateRoom() {
    setShowRoomTypeSelector(true);
  }

  const handleSelectClassic = () => {
    createRoomMutation({
      onCompleted: (data) => {
        navigate({
          to: "/classic-room/$roomId",
          params: { roomId: data.createRoom.id },
        });
        copyRoomUrlToClipboard(data.createRoom.id);
        setShowRoomTypeSelector(false);
      },
    });
  };

  const handleSelectCanvas = () => {
    createRoomMutation({
      onCompleted: (data) => {
        navigate({
          to: "/room/$roomId",
          params: { roomId: data.createRoom.id },
        });
        copyRoomUrlToClipboard(data.createRoom.id);
        setShowRoomTypeSelector(false);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <Header />

      <main className="isolate">
        {/* Hero section */}
        <div className="relative isolate overflow-hidden bg-linear-to-b from-indigo-100/20 dark:from-indigo-900/20 pt-14">
          <div
            aria-hidden="true"
            className="absolute inset-y-0 right-1/2 -z-10 -mr-96 w-[200%] origin-top-right skew-x-[-30deg] bg-white dark:bg-gray-900 shadow-xl shadow-indigo-600/10 ring-1 ring-indigo-50 dark:ring-indigo-950 sm:-mr-80 lg:-mr-96"
          />
          <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="mb-8 flex justify-center">
                <div className="relative rounded-full px-4 py-2 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200">
                  <Sparkles className="inline h-4 w-4 mr-1 text-primary animate-pulse" />
                  Everything You Need for Effective Sprint Planning
                </div>
              </div>
              <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                Features that
                <span className="block mt-2 bg-linear-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  Empower Your Team
                </span>
              </h1>
              <p className="mt-8 text-xl leading-8 text-gray-600 dark:text-gray-300">
                Discover all the powerful features that make PokerPlanning.org
                the go-to choice for agile teams worldwide. Free forever, no
                strings attached.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  onClick={onCreateRoom}
                  disabled={loading}
                  size="lg"
                  className="group"
                >
                  Start Planning Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button asChild size="lg" variant="outline">
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
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 -z-10 h-24 bg-linear-to-t from-white dark:from-gray-900 sm:h-32" />
        </div>

        {/* Room Types Comparison */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Choose Your Planning Experience
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Two powerful room types designed for different team needs and
                preferences
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-5xl">
              <div className="grid gap-8 lg:grid-cols-2">
                {/* Classic Room */}
                <div className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                        <Layout className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          Classic Room
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Traditional planning poker
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Recommended</Badge>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Our time-tested interface that thousands of teams love.
                    Perfect for quick estimation sessions with a focus on
                    simplicity and efficiency.
                  </p>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Key Features:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Clean, distraction-free interface
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Optimized for mobile devices
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Circular table layout for team visibility
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Fast loading and lightweight
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
                    Best for: Quick sessions, mobile users, traditional teams
                  </p>
                </div>

                {/* Canvas Room */}
                <div className="relative rounded-2xl border-2 border-purple-200 dark:border-purple-700 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                        <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                          Canvas Room
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Modern whiteboard experience
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-purple-600 text-white hover:bg-purple-700">
                        New
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-700 dark:text-amber-400"
                      >
                        Beta
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    A revolutionary approach to planning poker with an infinite
                    canvas, advanced navigation, and modern collaboration
                    features.
                  </p>

                  <div className="space-y-4 mb-8">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      Key Features:
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <InfinityIcon className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Endless canvas with smooth pan & zoom
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Navigation className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Floating navigation toolbar
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Maximize className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Full-screen immersive mode
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <MousePointer className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-gray-600 dark:text-gray-300">
                          Drag & position players anywhere
                        </span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-6">
                    Best for: Visual teams, workshops, advanced users
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Features Grid */}
        <div className="bg-gray-50 dark:bg-gray-900/50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Core Features Available Today
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Everything you need for effective planning poker sessions,
                available right now
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {coreFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Coming Soon
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Exciting features on our roadmap based on community feedback
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoonFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-6 shadow-sm opacity-75"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                        <feature.icon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Coming Soon
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Technical Features */}
        <div className="bg-gray-900 dark:bg-black py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Built with Modern Technology
              </h2>
              <p className="mt-4 text-lg text-gray-300">
                Powered by cutting-edge tech for performance and reliability
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {technicalFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="relative rounded-2xl border border-gray-700 bg-gray-800 p-6 shadow-sm hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-2 bg-gray-700 rounded-lg">
                        <feature.icon className="h-6 w-6 text-gray-300" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="relative overflow-hidden bg-primary py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Why Teams Choose PokerPlanning.org
              </h2>
              <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-white">$0</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    100% Free Forever
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    No premium tiers, no hidden costs
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Zero Tracking
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Your privacy is our priority
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    No Account Required
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Start planning in seconds
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    Unlimited Everything
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Teams, sessions, no limits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Ready to Transform Your Sprint Planning?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join thousands of teams already using PokerPlanning.org
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button
                  onClick={onCreateRoom}
                  disabled={loading}
                  size="lg"
                  className="group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button asChild size="lg" variant="link">
                  <a
                    href="https://github.com/INQTR/poker-planning"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    Contribute on GitHub
                    <Github className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <RoomTypeSelector
        open={showRoomTypeSelector}
        onOpenChange={setShowRoomTypeSelector}
        onSelectClassic={handleSelectClassic}
        onSelectCanvas={handleSelectCanvas}
      />
    </div>
  );
}
