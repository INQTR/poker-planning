import { Metadata } from "next";
import { FeaturesContent } from "./features-content";

export const metadata: Metadata = {
  title: "Planning Poker Features",
  description:
    "Explore AgileKit's features: real-time voting, analytics, timer sync, and whiteboard canvas. Everything your Scrum team needs for accurate sprint estimation.",
  openGraph: {
    title: "Planning Poker Features | AgileKit",
    description:
      "Explore AgileKit's features: real-time voting, analytics, timer sync, and whiteboard canvas. Everything for accurate estimation.",
    url: "https://agilekit.app/features",
  },
  alternates: {
    canonical: "https://agilekit.app/features",
  },
};

export default function FeaturesPage() {
  return <FeaturesContent />;
}
