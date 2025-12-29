import { Metadata } from "next";
import { DemoContent } from "./demo-content";

export const metadata: Metadata = {
  title: "Demo",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return <DemoContent />;
}
