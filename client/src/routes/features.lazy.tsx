import { createLazyFileRoute } from "@tanstack/react-router";

import { FeaturesPage } from "@/pages";

export const Route = createLazyFileRoute("/features")({
  component: FeaturesPage,
});
