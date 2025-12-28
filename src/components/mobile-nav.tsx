"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Features", href: "/features" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About", href: "/about" },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) {
      return pathname === "/";
    }
    return pathname === href;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative overflow-hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu
              className={`h-5 w-5 transition-all duration-300 ${
                isOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute h-5 w-5 transition-all duration-300 ${
                isOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        sideOffset={12}
        className="w-48 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-gray-200/50 dark:border-zinc-800/50"
      >
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <DropdownMenuItem
              key={item.name}
              className={`cursor-pointer py-2.5 px-3 transition-colors ${
                active
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10"
                  : "text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.href.startsWith("/#") ? (
                <a href={item.href} className="w-full">
                  {item.name}
                </a>
              ) : (
                <Link href={item.href} className="w-full">
                  {item.name}
                </Link>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
