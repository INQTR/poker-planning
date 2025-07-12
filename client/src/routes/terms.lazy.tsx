import { createLazyFileRoute } from "@tanstack/react-router";

import { TermsPage } from "@/pages";

export const Route = createLazyFileRoute("/terms")({
  component: TermsPage,
});
