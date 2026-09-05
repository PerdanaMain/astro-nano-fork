import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://astro-nano-demo.vercel.app",
  integrations: [mdx(), sitemap(), tailwind()],
  vite: {
    plugins: [
      {
        // Dev-only: the dev server doesn't resolve directory URLs to
        // public files, so /admin/ needs an explicit rewrite to serve
        // the CMS. In production Cloudflare Pages handles /admin/ as-is.
        name: "serve-admin-index",
        configureServer(server) {
          server.middlewares.use((req, _res, next) => {
            if (req.url === "/admin" || req.url === "/admin/") {
              req.url = "/admin/index.html";
            }
            next();
          });
        },
      },
    ],
  },
});
