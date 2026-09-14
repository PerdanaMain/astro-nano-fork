import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

/**
 * Sesi CMS lama (tab yang dibuka sebelum config baru ter-deploy) masih
 * menyimpan upload di folder entri dan menulis path relatif, sehingga
 * gambar rusak di situs. Integration ini menyembuhkan kondisi itu setiap
 * build: file gambar di folder entri dipindah ke public/uploads/<slug>.<ext>
 * dan path di frontmatter/body ditulis ulang menjadi /uploads/....
 */
function healCmsMedia() {
  return {
    name: "heal-cms-media",
    hooks: {
      "astro:config:setup": ({ logger }) => {
        const root = fileURLToPath(new URL(".", import.meta.url));
        const uploadsDir = path.join(root, "public", "uploads");
        fs.mkdirSync(uploadsDir, { recursive: true });

        for (const coll of ["projects", "blog"]) {
          const collDir = path.join(root, "src", "content", coll);
          if (!fs.existsSync(collDir)) continue;

          for (const ent of fs.readdirSync(collDir, { withFileTypes: true })) {
            if (!ent.isDirectory()) continue;
            const dir = path.join(collDir, ent.name);
            const md = path.join(dir, "index.md");
            if (!fs.existsSync(md)) continue;

            const original = fs.readFileSync(md, "utf8");
            let text = original;
            // basename file → nama tujuan di public/uploads
            const moved = new Map();

            // 1) image di frontmatter dengan path relatif
            const m = text.match(/^image:\s*['"]?([^'"\n]+?)['"]?\s*$/m);
            if (m) {
              const val = m[1].trim();
              if (val && !val.startsWith("/") && !/^https?:/.test(val)) {
                const base = path.basename(decodeURIComponent(val));
                const src = path.join(dir, base);
                if (fs.existsSync(src)) {
                  const destName = `${ent.name}${path.extname(base).toLowerCase()}`;
                  fs.renameSync(src, path.join(uploadsDir, destName));
                  moved.set(base, destName);
                  text = text.replace(m[0], `image: /uploads/${destName}`);
                  logger.info(`heal: ${coll}/${ent.name}: "${base}" → public/uploads/${destName}`);
                }
              }
            }

            // 2) referensi gambar relatif di body markdown
            text = text.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (whole, alt, url) => {
              if (url.startsWith("/") || /^https?:/.test(url)) return whole;
              const base = path.basename(decodeURIComponent(url));
              let destName = moved.get(base);
              if (!destName) {
                const src = path.join(dir, base);
                if (!fs.existsSync(src)) return whole;
                destName = `${ent.name}${path.extname(base).toLowerCase()}`;
                fs.renameSync(src, path.join(uploadsDir, destName));
                moved.set(base, destName);
              }
              logger.info(`heal: ${coll}/${ent.name}: body "${base}" → /uploads/${destName}`);
              return `![${alt}](/uploads/${destName})`;
            });

            if (text !== original) fs.writeFileSync(md, text);
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: "https://perdanamain.web.id",
  integrations: [mdx(), sitemap(), tailwind(), healCmsMedia()],
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
