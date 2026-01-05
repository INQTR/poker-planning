"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { MobileNav } from "@/components/mobile-nav";

const navigation = [
  { name: "How It Works", href: "/#how-it-works" },
  { name: "Features", href: "/features" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/";
    }
    return pathname === href;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-zinc-900/50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex items-center group">
            <Image
              src="/logo.svg"
              alt="AgileKit - Free Planning Poker Tool"
              width={32}
              height={32}
              className="h-8 w-8 mr-2 transition-transform duration-300 group-hover:scale-105"
            />
            <span className="sr-only">
              Planning poker / Scrum Poker / AgileKit
            </span>
            <span className="text-2xl font-bold bg-linear-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              AgileKit
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:gap-x-2">
          {navigation.map((item) => {
            const active = isActive(item.href);
            const className = `px-4 py-2 rounded-full text-base font-medium transition-all duration-200 ${
              active
                ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
            }`;

            return item.href.startsWith("/#") ? (
              <a key={item.name} href={item.href} className={className}>
                {item.name}
              </a>
            ) : (
              <Link key={item.name} href={item.href} className={className}>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right section: Mobile Nav + Theme Toggle */}
        <div className="flex lg:flex-1 justify-end items-center gap-2">
          <div className="lg:hidden">
            <MobileNav />
          </div>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
