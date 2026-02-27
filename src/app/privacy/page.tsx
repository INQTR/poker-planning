import { Metadata } from "next";
import { PrivacyContent } from "./privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how AgileKit handles account data, session data, cookies, and optional analytics.",
  openGraph: {
    title: "Privacy Policy | AgileKit",
    description:
      "Read how AgileKit handles account data, session data, cookies, and optional analytics.",
    url: "https://agilekit.app/privacy",
  },
  alternates: {
    canonical: "https://agilekit.app/privacy",
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
