import { ApolloProvider } from "@apollo/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { client } from "@/api";
import { ConfirmationDialogProvider, ThemeProvider } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts";
import { NotFoundPage } from "@/pages";

import "./index.css";

import { TooltipProvider } from "./components/ui/tooltip";
import { routeTree } from "./routeTree.gen";

const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFoundPage,
});
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const container = document.getElementById("root") as HTMLElement;
container.classList.add("h-full");
const root = createRoot(container);

root.render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark">
      <Toaster
        position="top-center"
        visibleToasts={9}
        toastOptions={{ duration: 5000 }}
      />
      <ApolloProvider client={client}>
        <TooltipProvider>
          <AuthProvider>
            <ConfirmationDialogProvider>
              <RouterProvider router={router} />
            </ConfirmationDialogProvider>
          </AuthProvider>
        </TooltipProvider>
      </ApolloProvider>
    </ThemeProvider>
  </StrictMode>,
);
