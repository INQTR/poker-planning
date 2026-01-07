import { Metadata } from "next";
import { CreateContent } from "./create-content";

export const metadata: Metadata = {
  title: "New Planning Poker Game",
  description:
    "Create a new planning poker session. Choose your voting scale and start estimating with your team.",
  openGraph: {
    title: "New Planning Poker Game - AgileKit",
    description: "Create a new planning poker session with your team.",
    url: "https://agilekit.app/room/new",
  },
  alternates: {
    canonical: "https://agilekit.app/room/new",
  },
};

export default function CreatePage() {
  return <CreateContent />;
}
