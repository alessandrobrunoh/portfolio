import analog from "@analogjs/platform";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// Every URL in the sitemap is prerendered to static HTML, so crawlers, link previews and
// AI screening tools read the content without running JavaScript.
const routes = [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>https?:\/\/[^/]+(\/[^<]*)<\/loc>/g)].map((m) => m[1]);

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
    // Delta workspaces live in .delta/ inside the repo; don't watch their copies.
    watch: { ignored: ["**/.delta/**"] },
  },
  // Bundle Angular into the prerender build so the router and the app share one @angular/core.
  ssr: { noExternal: [/^@angular\//] },
  preview: { host: "127.0.0.1", port: 8081, strictPort: true },
  plugins: [analog({ ssr: true, static: true, prerender: { routes } }), tailwindcss()],
});
