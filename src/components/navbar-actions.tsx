"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/user-menu/user-menu";
import { Button } from "@/components/ui/button";

export function NavbarActions() {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();

  // Show nothing while loading to prevent flash
  if (isLoading) {
    return <div className="w-24 h-8" />;
  }

  // Show UserMenu if authenticated
  if (isAuthenticated) {
    return <UserMenu />;
  }

  // Show Sign in button if not authenticated
  return (
    <Button
      className="hidden rounded-full sm:inline-flex"
      render={<Link href={`/auth/signin?from=${encodeURIComponent(pathname)}`} />}
      nativeButton={false}
    >
      Sign in
    </Button>
  );
}
