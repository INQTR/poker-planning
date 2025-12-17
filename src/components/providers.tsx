"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { AuthProvider } from "./auth/auth-provider";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

// This will be undefined until you run `npx convex dev` and set up your project
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export function Providers({ children }: { children: ReactNode }) {
  if (!convex) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Setup Required</h1>
          <p className="mb-4">Please run the following command to set up Convex:</p>
          <code className="bg-gray-100 p-2 rounded">npx convex dev</code>
          <p className="mt-4">Then add the NEXT_PUBLIC_CONVEX_URL to your .env.local file</p>
        </div>
      </div>
    );
  }

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider 
        defaultTheme="system" 
        storageKey="agilekit-theme" 
        attribute="class"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ConvexProvider>
  );
}