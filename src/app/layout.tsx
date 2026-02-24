import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Geist, Geist_Mono, Outfit } from "next/font/google";
import { Providers } from "@/components/providers";
import { Toaster } from "sonner";
import { getToken } from "@/lib/auth-server";

import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = "https://agilekit.app";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Free Planning Poker Online | AgileKit - Scrum Estimation Tool",
    template: "%s | AgileKit",
  },
  description:
    "Run free online planning poker sessions with your Scrum team. No signup required. Estimate user stories in real-time with AgileKit's open-source tool.",
  keywords: [
    "planning poker",
    "scrum poker",
    "agile estimation",
    "story points",
    "sprint planning",
    "free planning poker",
    "planning poker online",
    "scrum poker online",
    "agile poker",
    "estimation poker",
  ],
  authors: [{ name: "AgileKit Team" }],
  creator: "AgileKit",
  publisher: "AgileKit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "AgileKit",
    title: "Free Planning Poker Online | AgileKit",
    description:
      "Run free online planning poker sessions with your Scrum team. No signup required. Estimate user stories in real-time.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AgileKit - Free Planning Poker Tool for Scrum Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Planning Poker Online | AgileKit",
    description:
      "Run free online planning poker sessions with your Scrum team. No signup required.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialToken = await getToken();

  return (
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers initialToken={initialToken}>
          {children}
          <SpeedInsights />
          <Toaster />
        </Providers>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
