import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { loadContentData } from "./generate-content.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");

const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const getDefaultOrigin = () => process.env.SITE_ORIGIN || "https://dwd-healthcare.com";

const stripExistingLocaleHeadTags = (html) =>
  html
    .replace(/<title>.*?<\/title>\s*/gis, "")
    .replace(/<meta\s+name=["']description["'][^>]*>\s*/gis, "")
    .replace(/<meta\s+property=["']og:[^"']+["'][^>]*>\s*/gis, "")
    .replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gis, "")
    .replace(/<link\s+rel=["']alternate["'][^>]*hreflang=["'][^"']+["'][^>]*>\s*/gis, "");

const injectHead = (html, locale, localeContent, alternates, origin) => {
  const metadata = localeContent.metadata;
  const canonicalUrl = `${origin}${metadata.canonicalPath}`;
  const alternateTags = alternates
    .map(
      (alternate) =>
        `    <link rel="alternate" hreflang="${escapeHtml(alternate.hrefLang)}" href="${escapeHtml(origin + alternate.path)}" />`
    )
    .join("\n");

  const localeHead = [
    `    <title>${escapeHtml(metadata.title)}</title>`,
    `    <meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `    <meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `    <meta property="og:locale" content="${escapeHtml(metadata.ogLocale)}" />`,
    `    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`,
    `    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    alternateTags,
  ].join("\n");

  return stripExistingLocaleHeadTags(html)
    .replace(/<html lang="[^"]*">/, `<html lang="${escapeHtml(locale.htmlLang)}">`)
    .replace("</head>", `${localeHead}\n  </head>`);
};

const data = loadContentData();
const html = fs.readFileSync(templatePath, "utf8");
const origin = getDefaultOrigin();
const alternates = data.localeConfig.supportedLocales.map((locale) => ({
  hrefLang: locale.hrefLang ?? locale.htmlLang,
  path: data.contentByLocale[locale.id].metadata.canonicalPath,
}));

alternates.push({ hrefLang: "x-default", path: `/${data.localeConfig.defaultLocale}` });

data.localeConfig.supportedLocales.forEach((locale) => {
  const localeContent = data.contentByLocale[locale.id];
  const outDir = path.join(distDir, locale.id);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, "index.html"),
    injectHead(html, locale, localeContent, alternates, origin),
    "utf8"
  );
});

console.log("Generated locale HTML shells");
