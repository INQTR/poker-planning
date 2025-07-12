import { createLazyFileRoute } from "@tanstack/react-router";

import { AboutPage } from "@/pages";

export const Route = createLazyFileRoute("/about")({
  component: AboutPage,
});
