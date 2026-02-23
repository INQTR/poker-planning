"use client";

import { Suspense } from "react";
import Image from "next/image";
import { SigninForm } from "@/components/auth/signin-form";
import { ShaderRipple } from "@/components/shader-ripple";

function SigninPageContent() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      {/* Background Animation */}
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
          color1="#e81cff" // vibrant pink (matching logo/primary)
          color2="#9d00ff" // purple
          color3="#ff00a0" // deep pink
          mod={0.2}
          className="h-full w-full opacity-60 dark:opacity-40"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <Image
            src="/logo.svg"
            alt="AgileKit Logo"
            width={24}
            height={24}
            className="size-6"
          />
          AgileKit
        </a>
        <SigninForm />
      </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" />}>
      <SigninPageContent />
    </Suspense>
  );
}
