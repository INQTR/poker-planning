import { Metadata } from "next";
import { TermsContent } from "./terms-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review AgileKit's terms of service, acceptable use rules, and billing terms for any future paid features.",
  openGraph: {
    title: "Terms of Service | AgileKit",
    description:
      "Review AgileKit's terms of service, acceptable use rules, and billing terms for any future paid features.",
    url: "https://agilekit.app/terms",
  },
  alternates: {
    canonical: "https://agilekit.app/terms",
  },
};

export default function TermsPage() {
  return <TermsContent />;
}
