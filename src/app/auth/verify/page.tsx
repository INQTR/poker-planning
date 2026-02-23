"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShaderRipple } from "@/components/shader-ripple";
import Image from "next/image";

function VerifyContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="absolute inset-0 z-0 bg-background overflow-hidden">
        <ShaderRipple
          speed={0.05}
          lineWidth={0.002}
          rippleCount={8}
          colorLayers={3}
          backgroundColor="transparent"
          rotation={135}
          timeScale={0.5}
          opacity={1.0}
          waveIntensity={0.01}
          animationSpeed={1.0}
          loopDuration={0.7}
          scale={1}
          color1="#e81cff"
          color2="#9d00ff"
          color3="#ff00a0"
          mod={0.2}
          className="h-full w-full opacity-60 dark:opacity-40"
        />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium">
          <Image src="/logo.svg" alt="AgileKit Logo" width={24} height={24} className="size-6" />
          AgileKit
        </Link>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              {error ? "Verification Failed" : "Verifying..."}
            </CardTitle>
            <CardDescription>
              {error
                ? "There was an issue verifying your sign-in link."
                : "Please wait while we securely sign you in."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 text-center">
            {error ? (
              <>
                <div className="rounded-full bg-destructive/10 p-3 mb-2">
                  <AlertCircle className="size-8 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  This link has expired or is invalid. Please request a new one.
                </p>
                <Link href="/auth/signin" className="w-full">
                  <Button className="w-full">Return to Sign In</Button>
                </Link>
              </>
            ) : token ? (
              <div className="py-6">
                <Loader2 className="size-8 animate-spin text-primary mx-auto" />
                {/* Fallback auto-redirect in case BetterAuth didn't handle it server-side */}
                <meta httpEquiv="refresh" content={`0;url=/api/auth/magic-link/verify?${searchParams.toString()}`} />
              </div>
            ) : (
              <>
                <div className="rounded-full bg-destructive/10 p-3 mb-2">
                  <AlertCircle className="size-8 text-destructive" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  No verification token was provided.
                </p>
                <Link href="/auth/signin" className="w-full">
                  <Button className="w-full">Return to Sign In</Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" />}>
      <VerifyContent />
    </Suspense>
  );
}
