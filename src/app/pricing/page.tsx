import { Metadata } from "next";
import { PricingContent } from "./pricing-content";

export const metadata: Metadata = {
  title: "Pricing - Support the Project with Pro",
  description:
    "AgileKit is free forever. Subscribe to Pro to unlock extra features and support ongoing development. No credit card required, cancel anytime.",
  openGraph: {
    title: "Support the Project with Pro | AgileKit",
    description:
      "AgileKit is free forever. Subscribe to Pro to unlock extra features and support ongoing development.",
    url: "https://agilekit.app/pricing",
  },
  alternates: {
    canonical: "https://agilekit.app/pricing",
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
