import { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read AgileKit's privacy policy. We prioritize your data security with minimal collection, no tracking, and transparent open-source practices.",
  openGraph: {
    title: "Privacy Policy | AgileKit",
    description:
      "Read AgileKit's privacy policy. Minimal data collection, no tracking, transparent practices.",
    url: "https://agilekit.app/privacy",
  },
  alternates: {
    canonical: "https://agilekit.app/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
