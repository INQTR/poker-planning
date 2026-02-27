import { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing and Launch Status",
  description:
    "AgileKit core features are free today. Pro is in development, and launch pricing will be published here before checkout goes live.",
  openGraph: {
    title: "Pricing and Launch Status | AgileKit",
    description:
      "AgileKit core features are free today. Pro is in development, and launch pricing will be published here before checkout goes live.",
    url: "https://agilekit.app/pricing",
  },
  alternates: {
    canonical: "https://agilekit.app/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
