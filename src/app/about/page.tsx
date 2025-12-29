import { Metadata } from "next";
import { AboutContent } from "./about-content";

export const metadata: Metadata = {
  title: "About AgileKit - Free Open Source Planning Poker",
  description:
    "Learn about AgileKit, the free and open-source planning poker tool for Scrum teams. Built with privacy, simplicity, and real-time collaboration in mind.",
  openGraph: {
    title: "About AgileKit - Free Open Source Planning Poker",
    description:
      "Learn about AgileKit, the free open-source planning poker tool. Built with privacy, simplicity, and real-time collaboration.",
    url: "https://agilekit.app/about",
  },
  alternates: {
    canonical: "https://agilekit.app/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
