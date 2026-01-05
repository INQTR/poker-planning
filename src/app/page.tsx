import { Metadata } from "next";
import { HomeContent } from "./home-content";
import {
  WebApplicationSchema,
  OrganizationSchema,
  FAQSchema,
  HowToSchema,
} from "@/components/seo/structured-data";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://agilekit.app",
  },
};

export default function HomePage() {
  return (
    <>
      <WebApplicationSchema />
      <OrganizationSchema />
      <FAQSchema />
      <HowToSchema />
      <HomeContent />
    </>
  );
}
