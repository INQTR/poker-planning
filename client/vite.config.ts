import path from "path";

import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv, Plugin } from "vite";

// Custom plugin to inject Google Analytics script in production
const injectGoogleAnalytics = ({
  mode,
  GOOGLE_ANALYTICS_ID,
}: {
  mode: string;
  GOOGLE_ANALYTICS_ID: string;
}): Plugin => ({
  name: "inject-google-analytics",
  transformIndexHtml: {
    order: "pre",
    handler(html) {
      if (mode === "production") {
        if (GOOGLE_ANALYTICS_ID) {
          const googleAnalyticsScript = `
            <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}"></script>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${GOOGLE_ANALYTICS_ID}');
            </script>
          `;
          return html.replace("</head>", `${googleAnalyticsScript}</head>`);
        }
      }
      return html;
    },
  },
});

const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const GRAPHQL_ENDPOINT = env.VITE_GRAPHQL_ENDPOINT;
  const GOOGLE_ANALYTICS_ID = env.VITE_GOOGLE_ANALYTICS_ID;

  console.log("GRAPHQL_ENDPOINT", GRAPHQL_ENDPOINT);

  return {
    plugins: [
      tanstackRouter(),
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
        },
      }),
      tailwindcss(),
      injectGoogleAnalytics({ mode, GOOGLE_ANALYTICS_ID }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: GRAPHQL_ENDPOINT,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      include: ["**/*.test.tsx", "**/*.test.ts"],
    },
  };
});
