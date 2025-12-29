import { Metadata } from "next";
import { TermsContent } from "./terms-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review AgileKit's terms of service. MIT licensed, free forever, with clear guidelines for fair use of our planning poker tool.",
  openGraph: {
    title: "Terms of Service | AgileKit",
    description:
      "Review AgileKit's terms of service. MIT licensed, free forever, clear guidelines for fair use.",
    url: "https://agilekit.app/terms",
  },
  alternates: {
    canonical: "https://agilekit.app/terms",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
