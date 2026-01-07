import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(rootDir, "content.data.json");
const outPath = path.join(rootDir, "src", "content.jsx");

const stringify = (value) => JSON.stringify(value, null, 2);

export const buildContentFile = (data) => {
  const sections = [
    "// AUTO-GENERATED from content.data.json. Do not edit directly.",
    "// Use the editor UI or run `npm run content:gen`.",
    "",
    `export const BRAND = ${stringify(data.brand)};`,
    "",
    `export const ICON_KEYS = ${stringify(data.iconKeys)};`,
    "",
    "export const SECTIONS = " + stringify(data.sections) + ";",
    "",
    `export const HERO = ${stringify(data.hero)};`,
    "",
    `export const MARQUEE = ${stringify(data.marquee)};`,
    "",
    `export const ABOUT = ${stringify(data.about)};`,
    "",
    `export const FOCUS = ${stringify(data.focus)};`,
    "",
    `export const TEAM = ${stringify(data.team)};`,
    "",
    `export const BUSINESS = ${stringify(data.business)};`,
    "",
    `export const NETWORK = ${stringify(data.network)};`,
    "",
    `export const PORTFOLIO = ${stringify(data.portfolio)};`,
    "",
    `export const CONTACT = ${stringify(data.contact)};`,
    "",
    `export const FOOTER = ${stringify(data.footer)};`,
    "",
  ];

  return sections.join("\n");
};

export const writeContentFile = (data, targetPath = outPath) => {
  const content = buildContentFile(data);
  fs.writeFileSync(targetPath, content, "utf8");
};

export const loadContentData = (targetPath = dataPath) => {
  const raw = fs.readFileSync(targetPath, "utf8");
  return JSON.parse(raw);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const data = loadContentData();
  writeContentFile(data);
  console.log("Generated src/content.jsx from content.data.json");
}
