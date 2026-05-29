import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
  buildContentFile,
  loadContentData,
  validateAboutContent,
  validateContentTreeShape,
  validateLocaleConfig,
  validateLocaleStructuralParity,
  validateLocalizedContentData,
  validateNetworkContent,
  validateNewsContent,
} from "./generate-content.mjs";
import { NETWORK_MAP_IMAGE, NETWORK_MARKET_IDS, validateNetworkMapConfig } from "../src/network/worldMapConfig.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const getDefaultContentTree = (data) => data.contentByLocale?.[data.localeConfig?.defaultLocale ?? "en"] ?? data;

const englishUi = () => ({
  homeAriaLabel: "DWD Healthcare home",
  languageNavAriaLabel: "Language",
  switchLanguageLabel: "Switch to {language}",
  newsFilterAriaLabel: "News category filters",
  newsResultSummary: "{count} news {itemLabel} shown for {category}",
  newsResultItemSingular: "item",
  newsResultItemPlural: "items",
  readSourceAriaLabel: "Read source: {title} (opens in new tab)",
  networkAggregateCountLabel: "aggregate category count",
  networkAggregateCategoriesLabel: "aggregate categories",
  networkApproxMapLabel: "Approx. market map",
  aboutProfileLabel: "Profile",
  focusEmptyState: "Focus categories are being prepared.",
  focusTablistAriaLabel: "Core focus categories",
  footerLinksAriaLabel: "Footer links",
});

const koreanUi = () => ({
  homeAriaLabel: "DWD Healthcare 홈",
  languageNavAriaLabel: "언어",
  switchLanguageLabel: "{language}로 전환",
  newsFilterAriaLabel: "뉴스 카테고리 필터",
  newsResultSummary: "{category} 기준 뉴스 {count}개 표시",
  newsResultItemSingular: "개",
  newsResultItemPlural: "개",
  readSourceAriaLabel: "출처 읽기: {title} (새 탭에서 열림)",
  networkAggregateCountLabel: "집계 카테고리 수",
  networkAggregateCategoriesLabel: "집계 카테고리",
  networkApproxMapLabel: "시장 개략 지도",
  aboutProfileLabel: "프로필",
  focusEmptyState: "핵심 분야를 준비 중입니다.",
  focusTablistAriaLabel: "핵심 분야 카테고리",
  footerLinksAriaLabel: "푸터 링크",
});

const minimalLocalizedData = () => {
  const base = getDefaultContentTree(loadContentData(path.join(rootDir, "content.data.json")));
  const contentTree = structuredClone(base);

  contentTree.metadata = {
    title: "DWD Healthcare",
    description: "DWD Healthcare connects scientific review, strategic capital, and global healthcare market execution.",
    ogLocale: "en_US",
    canonicalPath: "/en",
  };
  contentTree.ui = englishUi();
  contentTree.news.categoryOptions = [
    { id: "portfolio", label: "Portfolio" },
    { id: "dwd-healthcare", label: "DWD Healthcare" },
  ];
  contentTree.news.items = [
    {
      id: 999,
      title: "Portfolio company update",
      summary: "A short original summary.",
      categoryId: "portfolio",
      company: "DWD Healthcare",
      source: "",
      sourceUrl: "https://example.com/news",
      publishedAt: "2026-05-26",
      image: "",
      imageAlt: "",
      tags: [],
      featured: false,
      visible: true,
    },
  ];

  return {
    localeConfig: {
      defaultLocale: "en",
      supportedLocales: [
        { id: "en", label: "English", nativeLabel: "English", htmlLang: "en", hrefLang: "en" },
        { id: "ko", label: "Korean", nativeLabel: "한국어", htmlLang: "ko", hrefLang: "ko" },
      ],
      countryLocaleMap: { KR: "ko" },
    },
    contentByLocale: {
      en: structuredClone(contentTree),
      ko: {
        ...structuredClone(contentTree),
        metadata: {
          title: "DWD Healthcare",
          description: "DWD Healthcare는 과학적 검토, 전략적 자본, 글로벌 헬스케어 시장 실행을 연결합니다.",
          ogLocale: "ko_KR",
          canonicalPath: "/ko",
        },
        ui: koreanUi(),
        news: {
          ...contentTree.news,
          categoryOptions: [
            { id: "portfolio", label: "포트폴리오" },
            { id: "dwd-healthcare", label: "DWD Healthcare" },
          ],
        },
      },
    },
  };
};

const validAboutData = () => ({
  about: {
    headlineLine: "We do not just invest.",
    headlineHighlight: "We architect the future of medicine.",
    leader: {
      eyebrow: "CEO MESSAGE",
      name: "Sample CEO",
      role: "Chief Executive Officer",
      photo: "/images/team/sample-ceo-placeholder.svg",
      photoAlt: "Sample CEO portrait placeholder",
      greetingTitle: "Building a disciplined bridge between science, capital, and global healthcare markets.",
      greetingBody: [
        "DWD Healthcare exists to help promising bio-healthcare innovation move beyond technical potential and become globally credible business value."
      ],
      bio: [
        "Sample biography item for global healthcare strategy leadership."
      ],
      tags: [
        "Strategy"
      ]
    },
    philosophy: {
      eyebrow: "PHILOSOPHY",
      title: "From scientific evidence to global healthcare value.",
      body: "DWD Healthcare connects research-grade insight, strategic capital, and cross-border execution.",
      principles: [
        { title: "Scientific Rigor", text: "We start with disciplined review of evidence." },
        { title: "Commercial Translation", text: "We convert technical potential into market narratives." },
        { title: "Global Standard", text: "We prepare companies for global expectations." }
      ]
    },
    footprint: {
      eyebrow: "GLOBAL OPERATING FOOTPRINT",
      title: "Headquartered in South Korea, connected through Shanghai and Texas.",
      body: "DWD Healthcare operates from South Korea with branch offices positioned for China and US healthcare market execution.",
      offices: [
        {
          id: "south-korea-hq",
          type: "hq",
          label: "South Korea",
          shortLabel: "HQ",
          description: "Headquarters",
          x: 78,
          y: 42,
        },
        {
          id: "shanghai-branch",
          type: "branch",
          label: "Shanghai",
          shortLabel: "SH",
          description: "China Branch Office",
          x: 73,
          y: 48,
        },
        {
          id: "texas-branch",
          type: "branch",
          label: "Texas",
          shortLabel: "TX",
          description: "US Branch Office",
          x: 18,
          y: 43,
        },
      ],
    }
  }
});

test("validateAboutContent accepts leadership and philosophy content", () => {
  assert.doesNotThrow(() => validateAboutContent(validAboutData()));
});

test("validateAboutContent accepts missing disabled expertise tags", () => {
  const data = validAboutData();
  delete data.about.leader.tags;

  assert.doesNotThrow(() => validateAboutContent(data));
});

test("validateAboutContent rejects legacy mission and vision fields", () => {
  const data = validAboutData();
  data.about[["mission", "Title"].join("")] = "Legacy mission";
  data.about[["vision", "Title"].join("")] = "Legacy vision";

  assert.throws(
    () => validateAboutContent(data),
    /about\.missionTitle must be removed/
  );
});

test("validateAboutContent rejects invalid portrait references", () => {
  const data = validAboutData();
  data.about.leader.photo = "sample-ceo.bmp";

  assert.throws(
    () => validateAboutContent(data),
    /about\.leader\.photo must be an https:\/\/ URL or a \/images\/ public image path/
  );
});

test("validateAboutContent rejects missing footprint offices", () => {
  const data = validAboutData();
  data.about.footprint.offices = [];

  assert.throws(
    () => validateAboutContent(data),
    /about\.footprint\.offices must contain exactly 3 offices/
  );
});

test("validateAboutContent rejects invalid footprint coordinates", () => {
  const data = validAboutData();
  data.about.footprint.offices[0].x = 130;

  assert.throws(
    () => validateAboutContent(data),
    /about\.footprint\.offices\[0\]\.x must be a number from 0 to 100/
  );
});

test("validateAboutContent rejects footprint without exactly one hq", () => {
  const data = validAboutData();
  data.about.footprint.offices[1].type = "hq";

  assert.throws(
    () => validateAboutContent(data),
    /about\.footprint\.offices must contain exactly 1 hq office/
  );
});

const validNewsData = () => ({
  news: {
    categoryOptions: [
      { id: "portfolio", label: "Portfolio" },
      { id: "dwd-healthcare", label: "DWD Healthcare" },
    ],
    items: [
      {
        id: 1,
        title: "Portfolio company update",
        summary: "A short original summary.",
        categoryId: "portfolio",
        company: "DWD Healthcare",
        source: "",
        sourceUrl: "https://example.com/news",
        publishedAt: "2026-05-26",
        image: "",
        imageAlt: "",
        tags: [],
        featured: false,
        visible: true,
      },
    ],
  },
});

test("validateNewsContent accepts active newsroom categories", () => {
  assert.doesNotThrow(() => validateNewsContent(validNewsData()));
});

test("validateNewsContent rejects disabled Market category options", () => {
  const data = validNewsData();
  data.news.categoryOptions.push({ id: "market", label: "Market" });

  assert.throws(
    () => validateNewsContent(data),
    /disabled category market/
  );
});

test("validateLocaleConfig accepts en and ko locale configuration", () => {
  assert.doesNotThrow(() => validateLocaleConfig(minimalLocalizedData()));
});

test("validateLocaleConfig rejects unsupported default locales", () => {
  const data = minimalLocalizedData();
  data.localeConfig.defaultLocale = "jp";

  assert.throws(
    () => validateLocaleConfig(data),
    /defaultLocale must be one of supportedLocales/
  );
});

test("validateLocalizedContentData validates every locale content tree", () => {
  const data = minimalLocalizedData();
  data.contentByLocale.ko.news.items[0].sourceUrl = "http://example.com/news";

  assert.throws(
    () => validateLocalizedContentData(data),
    /locale ko/
  );
});

test("validateContentTreeShape rejects missing locale top-level keys", () => {
  const data = minimalLocalizedData();
  delete data.contentByLocale.ko.sections;

  assert.throws(
    () => validateContentTreeShape("ko", data.contentByLocale.ko),
    /missing sections/
  );
});

test("validateContentTreeShape rejects missing required section ids", () => {
  const data = minimalLocalizedData();
  data.contentByLocale.ko.sections = data.contentByLocale.ko.sections.filter((section) => section.id !== "contact");

  assert.throws(
    () => validateContentTreeShape("ko", data.contentByLocale.ko),
    /missing required id contact/
  );
});

test("validateLocaleStructuralParity allows translated labels with matching stable ids", () => {
  const data = minimalLocalizedData();
  data.contentByLocale.ko.sections[0].navLabel = "소개";
  data.contentByLocale.ko.focus.categories[0].title = "의약품 및 바이오";
  data.contentByLocale.ko.news.categoryOptions[0].label = "포트폴리오";

  assert.doesNotThrow(() => validateLocaleStructuralParity(data));
});

test("validateLocaleStructuralParity rejects mismatched stable ids", () => {
  const data = minimalLocalizedData();
  data.contentByLocale.ko.sections[0].id = "renamed-about";

  assert.throws(
    () => validateLocaleStructuralParity(data),
    /locale ko sections/
  );
});

test("buildContentFile emits locale exports and active content exports", () => {
  const output = buildContentFile(minimalLocalizedData());

  assert.match(output, /export const LOCALE_CONFIG/);
  assert.match(output, /export const CONTENT_BY_LOCALE/);
  assert.match(output, /export const ACTIVE_LOCALE/);
  assert.match(output, /export const ACTIVE_METADATA/);
  assert.match(output, /export const UI = ACTIVE_CONTENT\.ui/);
  assert.match(output, /export const SECTIONS = ACTIVE_CONTENT\.sections/);
});

const validNetworkData = () => {
  const data = getDefaultContentTree(loadContentData(path.join(rootDir, "content.data.json")));
  return { network: structuredClone(data.network) };
};

test("validateNetworkContent accepts approved aggregate market content", () => {
  assert.doesNotThrow(() => validateNetworkContent(validNetworkData()));
});

test("validateNetworkContent rejects identity-bearing top-level Network copy", () => {
  const data = validNetworkData();
  data.network.privacyNote = "Representative network scale includes Mayo Clinic access.";

  assert.throws(() => validateNetworkContent(data), /Network/);
});

test("validateNetworkContent rejects bare domains and email addresses", () => {
  for (const unsafeValue of ["example.kr", "example.io", "network@example.kr", "mailto:network@example.kr"]) {
    const data = validNetworkData();
    data.network.intro = unsafeValue;

    assert.throws(() => validateNetworkContent(data), /Network|blocked|approved/);
  }
});

test("validateNetworkContent rejects partner fields at any Network depth", () => {
  for (const [key, value] of [
    ["institutionName", "Mayo Clinic"],
    ["companyName", "Pfizer"],
    ["collaboratorName", "Samsung Biologics"],
    ["partnerName", "Named Medical Center"],
    ["logo", "mark.svg"],
    ["logoUrl", "https://example.com/logo.svg"],
    ["logoAlt", "Partner logo"],
    ["image", "partner.png"],
    ["imageUrl", "https://example.com/partner.png"],
    ["url", "https://example.com"],
    ["email", "network@example.kr"],
  ]) {
    const data = validNetworkData();
    data.network.regions[0].stats[0][key] = value;

    assert.throws(() => validateNetworkContent(data), /not allowed|blocked|Network/);
  }
});

test("validateNetworkContent rejects relationship language variants", () => {
  for (const unsafeValue of ["collaborating institution", "joint research", "strategic partner", "powered by", "with Mayo Clinic"]) {
    const data = validNetworkData();
    data.network.privacyNote = unsafeValue;

    assert.throws(() => validateNetworkContent(data), /Network|blocked|approved/);
  }
});

test("validateNetworkContent rejects real organization examples in nested Network content", () => {
  for (const unsafeValue of ["Mayo Clinic", "Pfizer", "Samsung Biologics"]) {
    const marketData = validNetworkData();
    marketData.network.regions[0].summary = unsafeValue;
    assert.throws(() => validateNetworkContent(marketData), /Network|allowed|approved|blocked/);

    const statData = validNetworkData();
    statData.network.regions[0].stats[0].label = unsafeValue;
    assert.throws(() => validateNetworkContent(statData), /Network|allowed|blocked/);
  }
});

test("network map config covers approved market ids and local image metadata", () => {
  const data = validNetworkData();
  const marketIds = data.network.regions.map((market) => market.id);

  assert.doesNotThrow(() => validateNetworkMapConfig(marketIds));
  assert.deepEqual(NETWORK_MARKET_IDS, ["us", "eu", "japan", "china", "asia-pacific", "mena", "row"]);
  assert.deepEqual(marketIds, NETWORK_MARKET_IDS);
  assert.equal(NETWORK_MAP_IMAGE.src, "/images/network/world-map-3.png");
  assert.equal(NETWORK_MAP_IMAGE.width, 1676);
  assert.equal(NETWORK_MAP_IMAGE.height, 938);
  assert.equal(NETWORK_MAP_IMAGE.aspectRatio, "1676/938");
  assert.ok(NETWORK_MAP_IMAGE.width / NETWORK_MAP_IMAGE.height > 1.78);
  assert.ok(NETWORK_MAP_IMAGE.width / NETWORK_MAP_IMAGE.height < 1.79);

  const mapAssetPath = path.join(rootDir, "public/images/network/world-map-3.png");
  assert.equal(fs.existsSync(mapAssetPath), true);
  assert.equal(fs.readFileSync(mapAssetPath).subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
});

test("network map config rejects missing, duplicate, or unsupported markets", () => {
  assert.throws(
    () => validateNetworkMapConfig(["us", "eu", "japan", "china", "asia-pacific", "mena"]),
    /missing required market row/
  );
  assert.throws(
    () => validateNetworkMapConfig(["us", "eu", "japan", "china", "asia-pacific", "mena", "row", "north-america"]),
    /unsupported market north-america/
  );
  assert.throws(
    () => validateNetworkMapConfig(["us", "us", "japan", "china", "asia-pacific", "mena", "row"]),
    /must be unique/
  );
});

test("network regions use approved PNG map marker anchors", () => {
  const data = validNetworkData();
  const markerAnchors = Object.fromEntries(
    data.network.regions.map((region) => [region.id, { x: region.x, y: region.y }])
  );

  assert.deepEqual(markerAnchors, {
    us: { x: 18, y: 42 },
    eu: { x: 45, y: 32 },
    japan: { x: 91, y: 38 },
    china: { x: 74, y: 40 },
    "asia-pacific": { x: 82, y: 84 },
    mena: { x: 46, y: 68 },
    row: { x: 22, y: 88 },
  });
});

test("Global Network map does not render headquarters or branch office markers", () => {
  const appSource = fs.readFileSync(path.join(rootDir, "src", "App.jsx"), "utf8");
  const mapStartIndex = appSource.indexOf("const GlobalNetworkMap = () => {");
  const mapEndIndex = appSource.indexOf("const Navigation = () => {", mapStartIndex);
  const globalNetworkMapSource = appSource.slice(mapStartIndex, mapEndIndex);

  assert.doesNotMatch(globalNetworkMapSource, /ABOUT\.footprint\?\.offices/);
  assert.doesNotMatch(globalNetworkMapSource, /networkOfficeMarkers/);
  assert.doesNotMatch(globalNetworkMapSource, /network-office-marker/);
  assert.doesNotMatch(globalNetworkMapSource, /network-office-legend/);
});

test("WorldMapImage renders the PNG on a white map surface", () => {
  const componentSource = fs.readFileSync(path.join(rootDir, "src", "network", "WorldMapImage.jsx"), "utf8");

  assert.match(componentSource, /data-testid="network-world-map-surface"/);
  assert.match(componentSource, /bg-white/);
  assert.match(componentSource, /data-testid="network-world-map-whitewash"/);
});

test("site content disables Team section", () => {
  const data = getDefaultContentTree(loadContentData(path.join(rootDir, "content.data.json")));
  const teamSection = data.sections.find((section) => section.id === "team");

  assert.equal(teamSection?.hidden, true);
});

test("site content disables Global Operating Footprint block", () => {
  const data = getDefaultContentTree(loadContentData(path.join(rootDir, "content.data.json")));

  assert.equal(data.about.footprint?.hidden, true);
});

test("App gates Team section rendering on the section visibility flag", () => {
  const appSource = fs.readFileSync(path.join(rootDir, "src", "App.jsx"), "utf8");
  const teamSectionIndex = appSource.indexOf('<section id="team"');
  const teamVisibilityGuardIndex = appSource.lastIndexOf(
    "isSectionVisible(SECTION_BY_ID.team)",
    teamSectionIndex
  );

  assert.notEqual(teamSectionIndex, -1);
  assert.ok(
    teamVisibilityGuardIndex >= 0,
    "Team section must not render unless SECTION_BY_ID.team is visible"
  );
});

test("App gates Global Operating Footprint rendering on the footprint hidden flag", () => {
  const appSource = fs.readFileSync(path.join(rootDir, "src", "App.jsx"), "utf8");
  const footprintStartIndex = appSource.indexOf("const AboutFootprintMap = () => {");
  const footprintEndIndex = appSource.indexOf("const AboutSection = () => {", footprintStartIndex);
  const footprintSource = appSource.slice(footprintStartIndex, footprintEndIndex);

  assert.notEqual(footprintStartIndex, -1);
  assert.notEqual(footprintEndIndex, -1);
  assert.match(footprintSource, /footprint\.hidden === true/);
});
