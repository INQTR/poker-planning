import { createLazyFileRoute } from "@tanstack/react-router";

import { PrivacyPage } from "@/pages";

export const Route = createLazyFileRoute("/privacy")({
  component: PrivacyPage,
});
