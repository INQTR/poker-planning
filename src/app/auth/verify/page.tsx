"use client";

import { Suspense, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AuthPageLayout } from "@/components/auth/auth-page-layout";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const token = searchParams.get("token");

  useEffect(() => {
    if (token && !error) {
      router.replace(`/api/auth/magic-link/verify?${searchParams.toString()}`);
    }
  }, [token, error, router, searchParams]);

  return (
    <AuthPageLayout>
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
    </AuthPageLayout>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-background" />}>
      <VerifyContent />
    </Suspense>
  );
}
