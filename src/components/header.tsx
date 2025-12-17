import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/mode-toggle";

export function Header() {
  return (
    <header className="relative z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-800/50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center">
            <Image
              src="/logo.svg"
              alt="AgileKit Logo"
              width={32}
              height={32}
              className="h-8 w-8 mr-2"
            />
            <span className="sr-only">Planning poker / Scrum Poker</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Planning poker
            </span>
          </Link>
        </div>
        <div className="flex lg:flex-1 justify-end">
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}