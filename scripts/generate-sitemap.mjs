import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://shootandrun.es";
const entries = [
  ["/", "weekly", "1.0"],
  ["/reservar", "weekly", "0.9"],
  ["/laser-tag-murcia", "monthly", "0.8"],
  ["/cumpleanos-laser-tag-murcia", "monthly", "0.8"],
  ["/eventos-empresa-laser-tag", "monthly", "0.8"],
  ["/realidad-virtual-murcia", "monthly", "0.8"],
  ["/blog", "weekly", "0.7"],
  ["/blog/top-5-planes-cumpleanos-murcia", "monthly", "0.6", "2026-04-01"],
  ["/blog/laser-tag-vs-paintball-cual-elegir", "monthly", "0.6", "2026-03-25"],
  ["/blog/ideas-eventos-empresa-murcia", "monthly", "0.6", "2026-03-18"],
  ["/blog/laser-tag-institutos-murcia", "monthly", "0.6", "2026-04-20"],
  ["/blog/laser-tag-ayuntamientos-fiestas-patronales", "monthly", "0.6", "2026-04-20"],
  ["/blog/realidad-virtual-free-roam-no-marea", "monthly", "0.6", "2026-04-20"],
  ["/blog/catalogo-juegos-vr-murcia", "monthly", "0.6", "2026-04-20"],
  ["/politica-privacidad", "yearly", "0.3"],
  ["/aviso-legal", "yearly", "0.3"],
];

const urls = entries.map(([path, changefreq, priority, lastmod]) => [
  "  <url>",
  `    <loc>${BASE_URL}${path}</loc>`,
  lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
  `    <changefreq>${changefreq}</changefreq>`,
  `    <priority>${priority}</priority>`,
  "  </url>",
].filter(Boolean).join("\n"));

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...urls,
  "</urlset>",
  "",
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${entries.length} entries)`);
