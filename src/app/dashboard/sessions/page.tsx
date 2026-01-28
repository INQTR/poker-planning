import { Metadata } from "next";
import { SessionsContent } from "./sessions-content";

export const metadata: Metadata = {
  title: "Sessions | AgileKit Analytics",
  description: "View your planning poker session history and details",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SessionsPage() {
  return <SessionsContent />;
}
