import { Metadata } from "next";
import { HomeContent } from "./home-content";
import {
  WebApplicationSchema,
  OrganizationSchema,
  FAQSchema,
  HowToSchema,
} from "@/components/seo/structured-data";
import { getLatestRelease, formatRelativeTime } from "@/lib/changelog";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://agilekit.app",
  },
};

export default function HomePage() {
  const latestRelease = getLatestRelease();
  const versionInfo = latestRelease
    ? {
        version: latestRelease.version,
        relativeTime: formatRelativeTime(latestRelease.date),
      }
    : null;

  return (
    <>
      <WebApplicationSchema />
      <OrganizationSchema />
      <FAQSchema />
      <HowToSchema />
      <HomeContent versionInfo={versionInfo} />
    </>
  );
}
