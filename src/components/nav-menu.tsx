"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NAVIGATION_ITEMS } from "@/lib/navigation";

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <NavigationMenu {...props}>
      <NavigationMenuList className="space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
        {NAVIGATION_ITEMS.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink
              className={cn(
                "px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                isActive(item.href) && "text-foreground"
              )}
              render={<Link href={item.href} />}
            >
              {item.name}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
