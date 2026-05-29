import React, { useEffect, useMemo, useRef, useState } from "react";

const SECTION_LABELS = {
  metadata: "Metadata",
  ui: "UI Labels",
  brand: "Brand",
  sections: "Sections",
  hero: "Hero",
  marquee: "Marquee",
  about: "About",
  focus: "Focus Areas",
  team: "Team",
  business: "Business",
  network: "Network",
  portfolio: "Portfolio",
  news: "News",
  contact: "Contact",
  footer: "Footer",
};

const UI_LABEL_FIELDS = [
  "homeAriaLabel",
  "languageNavAriaLabel",
  "switchLanguageLabel",
  "newsFilterAriaLabel",
  "newsResultSummary",
  "newsResultItemSingular",
  "newsResultItemPlural",
  "readSourceAriaLabel",
  "networkAggregateCountLabel",
  "networkAggregateCategoriesLabel",
  "networkApproxMapLabel",
  "aboutProfileLabel",
  "focusEmptyState",
  "focusTablistAriaLabel",
  "footerLinksAriaLabel",
];

const Input = (props) => (
  <input
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const TextArea = (props) => (
  <textarea
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none ${props.className ?? ""}`}
  />
);

const Field = ({ label, help, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
    {children}
    {help && <span className="block text-xs text-slate-400">{help}</span>}
  </label>
);

const Card = ({ title, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-3 text-sm font-semibold text-slate-700">{title}</div>
    <div className="space-y-4 px-5 py-4">{children}</div>
  </section>
);

const SectionHeader = ({ title, description }) => (
  <div className="space-y-1">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    {description && <p className="text-xs text-slate-500">{description}</p>}
  </div>
);

const arrayFromText = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

const textFromArray = (list) => (list ?? []).join("\n");

const tagsFromText = (text) =>
  text
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const textFromTags = (tags) => (tags ?? []).join(", ");

const moveItem = (list, from, to) => {
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

const cloneData = (value) =>
  typeof structuredClone === "function" ? structuredClone(value) : JSON.parse(JSON.stringify(value));

const isHttpsUrl = (value) => typeof value === "string" && /^https:\/\/\S+$/i.test(value);
const isPublicImagePath = (value) =>
  typeof value === "string" && /^\/images\/[A-Za-z0-9._/-]+\.(png|jpe?g|webp|svg)$/i.test(value);
const isImageReference = (value) => isHttpsUrl(value) || isPublicImagePath(value);
const LEGACY_ABOUT_FIELDS = ["mission", "vision"].flatMap((prefix) =>
  ["Title", "Text"].map((suffix) => `${prefix}${suffix}`)
);

const EXPECTED_FOCUS_CATEGORIES = [
  { id: "pharmaceuticals-biotech", title: "Pharmaceuticals & Biotech" },
  { id: "medical-devices-diagnostics", title: "Medical Devices & Diagnostics" },
  { id: "digital-healthcare", title: "Digital Healthcare" },
  { id: "consumer-health-wellness", title: "Consumer Health & Wellness" },
];

const FOCUS_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXPECTED_NEWS_CATEGORIES = [
  { id: "portfolio", label: "Portfolio" },
  { id: "dwd-healthcare", label: "DWD Healthcare" },
];
const EXPECTED_NEWS_CATEGORY_IDS = new Set(EXPECTED_NEWS_CATEGORIES.map((category) => category.id));
const DISABLED_NEWS_CATEGORIES = new Set(["market"]);
const NETWORK_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const NETWORK_ALLOWED_KEYS = new Set([
  "eyebrow",
  "intro",
  "privacyNote",
  "hubLabel",
  "totalLabel",
  "regionSummaryLabel",
  "regions",
]);
const NETWORK_ALLOWED_REGION_KEYS = new Set(["id", "label", "shortLabel", "x", "y", "summary", "stats"]);
const NETWORK_ALLOWED_STAT_KEYS = new Set(["id", "code", "label", "count"]);
const NETWORK_REGION_OPTIONS = [
  { id: "us", label: "US", shortLabel: "US" },
  { id: "eu", label: "EU", shortLabel: "EU" },
  { id: "japan", label: "Japan", shortLabel: "JP" },
  { id: "china", label: "China", shortLabel: "CN" },
  { id: "asia-pacific", label: "Asia-Pacific", shortLabel: "APAC" },
  { id: "mena", label: "MENA", shortLabel: "MENA" },
  { id: "row", label: "ROW (Rest of World)", shortLabel: "ROW" },
];
const NETWORK_STAT_OPTIONS = [
  { id: "major-medical-centers", code: "MED", label: "Major Medical Centers" },
  { id: "research-organizations", code: "R&D", label: "Research Organizations" },
  { id: "clinical-networks", code: "CLN", label: "Clinical Networks" },
  { id: "business-development-channels", code: "BD", label: "Business Development Channels" },
  { id: "enterprise-healthcare-channels", code: "MNC", label: "Enterprise Healthcare Channels" },
];
const NETWORK_STAT_LABEL_OPTIONS = NETWORK_STAT_OPTIONS.map((stat) => stat.label);
const NETWORK_STAT_CODE_OPTIONS = NETWORK_STAT_OPTIONS.map((stat) => stat.code);
const NETWORK_REGION_SUMMARY_OPTIONS = [
  "Representative aggregate coverage for the US market across approved healthcare access categories.",
  "Representative aggregate coverage for the EU market across approved healthcare access categories.",
  "Representative aggregate coverage for the Japan market across approved healthcare access categories.",
  "Representative aggregate coverage for the China market across approved healthcare access categories.",
  "Representative aggregate coverage for Asia-Pacific markets excluding Japan and China.",
  "Representative aggregate coverage for Middle East and North Africa markets.",
  "Representative aggregate coverage for rest-of-world markets outside the named regions.",
];
const NETWORK_REGION_BY_ID = new Map(NETWORK_REGION_OPTIONS.map((region) => [region.id, region]));
const NETWORK_STAT_BY_ID = new Map(NETWORK_STAT_OPTIONS.map((stat) => [stat.id, stat]));
const NETWORK_ALLOWED_REGION_IDS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.id));
const NETWORK_ALLOWED_REGION_LABELS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.label));
const NETWORK_ALLOWED_REGION_SHORT_LABELS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.shortLabel));
const NETWORK_ALLOWED_STAT_IDS = new Set(NETWORK_STAT_OPTIONS.map((stat) => stat.id));
const NETWORK_ALLOWED_STAT_LABELS = new Set(NETWORK_STAT_LABEL_OPTIONS);
const NETWORK_ALLOWED_STAT_CODES = new Set(NETWORK_STAT_CODE_OPTIONS);
const NETWORK_ALLOWED_REGION_SUMMARIES = new Set(NETWORK_REGION_SUMMARY_OPTIONS);
const NETWORK_APPROVED_COPY = {
  eyebrow: "AGGREGATED GLOBAL ACCESS",
  intro: "Representative market coverage across US, EU, Japan, China, Asia-Pacific, MENA, and ROW, expressed only as aggregate category counts.",
  privacyNote: "Representative network scale by market. Institution names are intentionally undisclosed.",
  hubLabel: "GLOBAL NETWORK",
  totalLabel: "Aggregate Category Count",
  regionSummaryLabel: "Selected Market",
};
const NETWORK_FORBIDDEN_KEYS = new Set([
  "alliance",
  "alliances",
  "caseStudy",
  "casestudy",
  "caseStudies",
  "casestudies",
  "cities",
  "city",
  "client",
  "clients",
  "collaboratorName",
  "collaboratorname",
  "companyName",
  "companyname",
  "customer",
  "customers",
  "email",
  "href",
  "image",
  "imageUrl",
  "imageurl",
  "institution",
  "institutionName",
  "institutionname",
  "logo",
  "logoAlt",
  "logoalt",
  "logoHref",
  "logohref",
  "logoURL",
  "logoUrl",
  "logourl",
  "logos",
  "name",
  "names",
  "node",
  "nodes",
  "organizationName",
  "organizationname",
  "partner",
  "partnerLogo",
  "partnerlogo",
  "partners",
  "partnerName",
  "partnername",
  "sourceUrl",
  "sourceurl",
  "sponsor",
  "sponsors",
  "statusLabel",
  "statuslabel",
  "statusLines",
  "statuslines",
  "url",
  "website",
]);
const NETWORK_BLOCKED_VALUE_PATTERN =
  /(https?:\/\/|www\.|mailto:|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b[A-Z0-9-]+\.(?:com|org|edu|net|io|ai|co|kr|jp|cn|de|fr|uk|ae|sa|sg|au|ca)\b|\.svg\b|\.png\b|\.jpe?g\b|\.webp\b|logo)/i;
const NETWORK_RELATIONSHIP_TERM_PATTERN =
  /\b(partner|partners|partnership|client|customer|endorsed|official|signed|deployed|collaboration|collaborating|alliance|joint research|powered by|with [A-Z][A-Za-z0-9&.-]*)\b/i;

const getAboutValidationErrors = (content) => {
  const errors = [];
  const about = content?.about;
  const leader = about?.leader;
  const philosophy = about?.philosophy;
  const footprint = about?.footprint;
  const isBlankValue = (value) => typeof value !== "string" || value.trim().length === 0;

  for (const legacyField of LEGACY_ABOUT_FIELDS) {
    if (about?.[legacyField] !== undefined) {
      errors.push(`About ${legacyField}: remove legacy Mission/Vision fields and use Philosophy.`);
    }
  }

  for (const field of ["headlineLine", "headlineHighlight"]) {
    if (isBlankValue(about?.[field])) errors.push(`About ${field}: value is required.`);
  }

  for (const field of ["eyebrow", "name", "role", "photo", "photoAlt", "greetingTitle"]) {
    if (isBlankValue(leader?.[field])) errors.push(`CEO ${field}: value is required.`);
  }

  if (!isBlankValue(leader?.photo) && !isImageReference(leader.photo)) {
    errors.push("CEO photo: use an https:// URL or a /images/ public image path.");
  }

  for (const field of ["greetingBody", "bio"]) {
    if (!Array.isArray(leader?.[field]) || leader[field].length === 0) {
      errors.push(`CEO ${field}: add at least one item.`);
    } else {
      leader[field].forEach((item, index) => {
        if (isBlankValue(item)) errors.push(`CEO ${field} row ${index + 1}: value is blank.`);
      });
    }
  }

  for (const field of ["eyebrow", "title", "body"]) {
    if (isBlankValue(philosophy?.[field])) errors.push(`Philosophy ${field}: value is required.`);
  }

  if (!Array.isArray(philosophy?.principles) || philosophy.principles.length !== 3) {
    errors.push("Philosophy principles: exactly 3 principles are required.");
  } else {
    philosophy.principles.forEach((principle, index) => {
      if (isBlankValue(principle?.title)) errors.push(`Philosophy principle ${index + 1}: title is required.`);
      if (isBlankValue(principle?.text)) errors.push(`Philosophy principle ${index + 1}: text is required.`);
    });
  }

  for (const field of ["eyebrow", "title", "body"]) {
    if (isBlankValue(footprint?.[field])) errors.push(`Footprint ${field}: value is required.`);
  }

  if (!Array.isArray(footprint?.offices) || footprint.offices.length !== 3) {
    errors.push("Footprint offices: exactly 3 offices are required.");
  } else {
    const hqCount = footprint.offices.filter((office) => office?.type === "hq").length;
    const branchCount = footprint.offices.filter((office) => office?.type === "branch").length;

    if (hqCount !== 1) errors.push("Footprint offices: exactly 1 hq office is required.");
    if (branchCount < 1) errors.push("Footprint offices: at least 1 branch office is required.");

    footprint.offices.forEach((office, index) => {
      for (const field of ["id", "type", "label", "shortLabel", "description"]) {
        if (isBlankValue(office?.[field])) errors.push(`Footprint office ${index + 1} ${field}: value is required.`);
      }
      if (!["hq", "branch"].includes(office?.type)) errors.push(`Footprint office ${index + 1}: type must be hq or branch.`);
      for (const field of ["x", "y"]) {
        const value = Number(office?.[field]);
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          errors.push(`Footprint office ${index + 1} ${field}: use a number from 0 to 100.`);
        }
      }
    });
  }

  return errors;
};

const getFocusValidationErrors = (content, locale = "en") => {
  const errors = [];
  const categories = content?.focus?.categories;
  const categoryList = Array.isArray(categories) ? categories : [];
  const iconKeys = new Set(content?.iconKeys ?? []);
  const expectedIds = new Set(EXPECTED_FOCUS_CATEGORIES.map((category) => category.id));
  const expectedTitles = new Map(EXPECTED_FOCUS_CATEGORIES.map((category) => [category.id, category.title]));
  const seenIds = new Set();
  const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;

  if (content?.focus?.areas !== undefined) {
    errors.push("Legacy Focus areas must be removed.");
  }

  if (!Array.isArray(categories)) {
    errors.push("Focus categories must be an array.");
  } else if (categories.length !== EXPECTED_FOCUS_CATEGORIES.length) {
    errors.push(`Focus categories must contain exactly ${EXPECTED_FOCUS_CATEGORIES.length} categories.`);
  }

  categoryList.forEach((category, index) => {
    const label = category?.id || `row ${index + 1}`;

    if (isBlank(category?.id)) {
      errors.push(`Focus row ${index + 1}: id is required.`);
    } else if (!FOCUS_ID_PATTERN.test(category.id)) {
      errors.push(`Focus ${label}: id must use lowercase kebab-case.`);
    } else if (seenIds.has(category.id)) {
      errors.push(`Focus ${label}: duplicate id.`);
    } else if (!expectedIds.has(category.id)) {
      errors.push(`Focus ${label}: this is not one of the fixed categories.`);
    } else {
      seenIds.add(category.id);
    }

    for (const field of ["code", "title", "summaryKo", "iconKey"]) {
      if (isBlank(category?.[field])) {
        errors.push(`Focus ${label}: ${field} is required.`);
      }
    }

    if (!isBlank(category?.iconKey) && !iconKeys.has(category.iconKey)) {
      errors.push(`Focus ${label}: choose a valid icon.`);
    }

    if (locale === "en" && !isBlank(category?.id) && expectedTitles.has(category.id) && category.title !== expectedTitles.get(category.id)) {
      errors.push(`Focus ${label}: English title is fixed as "${expectedTitles.get(category.id)}".`);
    }

    if (!Array.isArray(category?.subcategories) || category.subcategories.length === 0) {
      errors.push(`Focus ${label}: add at least one subcategory.`);
    }

    if (Array.isArray(category?.subcategories)) {
      category.subcategories.forEach((subcategory, subcategoryIndex) => {
        if (isBlank(subcategory)) {
          errors.push(`Focus ${label}: subcategory ${subcategoryIndex + 1} is blank.`);
        }
      });
    }
  });

  for (const expectedCategory of EXPECTED_FOCUS_CATEGORIES) {
    if (!seenIds.has(expectedCategory.id)) {
      errors.push(`Focus categories are missing ${expectedCategory.id}.`);
    }
  }

  return errors;
};

const findForbiddenNetworkKeys = (value, pathLabel = "network") => {
  const matches = [];

  if (!value || typeof value !== "object") return matches;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      matches.push(...findForbiddenNetworkKeys(item, `${pathLabel}[${index}]`));
    });
    return matches;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    const nestedPath = `${pathLabel}.${key}`;
    if (NETWORK_FORBIDDEN_KEYS.has(key) || NETWORK_FORBIDDEN_KEYS.has(key.toLowerCase())) {
      matches.push(nestedPath);
    }
    matches.push(...findForbiddenNetworkKeys(nestedValue, nestedPath));
  });

  return matches;
};

const findUnsafeNetworkValues = (value, pathLabel = "network") => {
  const matches = [];

  if (typeof value === "string") {
    if (NETWORK_BLOCKED_VALUE_PATTERN.test(value) || NETWORK_RELATIONSHIP_TERM_PATTERN.test(value)) {
      matches.push(pathLabel);
    }
    return matches;
  }

  if (!value || typeof value !== "object") return matches;

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      matches.push(...findUnsafeNetworkValues(item, `${pathLabel}[${index}]`));
    });
    return matches;
  }

  Object.entries(value).forEach(([key, nestedValue]) => {
    matches.push(...findUnsafeNetworkValues(nestedValue, `${pathLabel}.${key}`));
  });

  return matches;
};

const getNetworkValidationErrors = (content, locale = "en") => {
  const errors = [];
  const network = content?.network;
  const regions = network?.regions;
  const regionList = Array.isArray(regions) ? regions : [];
  const regionIds = new Set();
  const isBlankValue = (value) => typeof value !== "string" || value.trim().length === 0;

  if (!network) {
    errors.push("Network must be configured.");
  }

  if (!Array.isArray(regions) || regions.length === 0) {
    errors.push("Network regions must contain at least one region.");
  } else if (regions.length !== NETWORK_ALLOWED_REGION_IDS.size) {
    errors.push(`Network must contain exactly ${NETWORK_ALLOWED_REGION_IDS.size} allowed aggregate regions.`);
  }

  if (network && typeof network === "object") {
    Object.keys(network).forEach((key) => {
      if (!NETWORK_ALLOWED_KEYS.has(key)) {
        errors.push(`Network ${key}: this field is not allowed.`);
      }
    });
  }

  findForbiddenNetworkKeys(network).forEach((pathLabel) => {
    errors.push(`${pathLabel}: partner names, URLs, logos, and legacy node fields are not allowed.`);
  });

  findUnsafeNetworkValues(network).forEach((pathLabel) => {
    errors.push(`${pathLabel}: remove URLs, logo/image references, or relationship terms.`);
  });

  for (const [field, approvedValue] of Object.entries(NETWORK_APPROVED_COPY)) {
    if (isBlankValue(network?.[field])) {
      errors.push(`Network ${field} is required.`);
    } else if (locale === "en" && network[field] !== approvedValue) {
      errors.push(`Network ${field}: use the approved aggregate-only copy.`);
    }
  }

  regionList.forEach((region, regionIndex) => {
    const label = region?.id || `row ${regionIndex + 1}`;
    const stats = region?.stats;
    const statList = Array.isArray(stats) ? stats : [];
    const statIds = new Set();

    Object.keys(region ?? {}).forEach((key) => {
      if (!NETWORK_ALLOWED_REGION_KEYS.has(key)) {
        errors.push(`Network region ${label}.${key}: this field is not allowed.`);
      }
    });

    if (isBlankValue(region?.id)) {
      errors.push(`Network region ${regionIndex + 1}: id is required.`);
    } else if (!NETWORK_ID_PATTERN.test(region.id)) {
      errors.push(`Network region ${label}: id must use lowercase kebab-case.`);
    } else if (!NETWORK_ALLOWED_REGION_IDS.has(region.id)) {
      errors.push(`Network region ${label}: choose an allowed aggregate region id.`);
    } else if (regionIds.has(region.id)) {
      errors.push(`Network region ${label}: duplicate id.`);
    } else {
      regionIds.add(region.id);
    }

    if (isBlankValue(region?.label)) {
      errors.push(`Network region ${label}: label is required.`);
    } else if (locale === "en" && !NETWORK_ALLOWED_REGION_LABELS.has(region.label)) {
      errors.push(`Network region ${label}: choose an allowed safe region label.`);
    }

    if (isBlankValue(region?.shortLabel)) {
      errors.push(`Network region ${label}: shortLabel is required.`);
    } else if (!NETWORK_ALLOWED_REGION_SHORT_LABELS.has(region.shortLabel)) {
      errors.push(`Network region ${label}: choose an allowed safe region code.`);
    }

    if (isBlankValue(region?.summary)) {
      errors.push(`Network region ${label}: summary is required.`);
    } else if (locale === "en" && !NETWORK_ALLOWED_REGION_SUMMARIES.has(region.summary)) {
      errors.push(`Network region ${label}: choose an allowed safe aggregate summary.`);
    }

    const expectedRegion = NETWORK_REGION_BY_ID.get(region?.id);
    if (expectedRegion && region.shortLabel !== expectedRegion.shortLabel) {
      errors.push(`Network region ${label}: shortLabel must match the selected aggregate region.`);
    }
    if (locale === "en" && expectedRegion && region.label !== expectedRegion.label) {
      errors.push(`Network region ${label}: label must match the selected aggregate region.`);
    }

    for (const field of ["x", "y"]) {
      if (typeof region?.[field] !== "number" || region[field] < 5 || region[field] > 95) {
        errors.push(`Network region ${label}: ${field} must be a number from 5 to 95.`);
      }
    }

    if (!Array.isArray(stats) || stats.length === 0) {
      errors.push(`Network region ${label}: add at least one aggregate stat.`);
    }

    statList.forEach((stat, statIndex) => {
      const statLabel = stat?.id || `stat ${statIndex + 1}`;

      Object.keys(stat ?? {}).forEach((key) => {
        if (!NETWORK_ALLOWED_STAT_KEYS.has(key)) {
          errors.push(`Network region ${label} stat ${statLabel}.${key}: this field is not allowed.`);
        }
      });

      if (isBlankValue(stat?.id)) {
        errors.push(`Network region ${label} stat ${statIndex + 1}: id is required.`);
      } else if (!NETWORK_ID_PATTERN.test(stat.id)) {
        errors.push(`Network region ${label} stat ${statLabel}: id must use lowercase kebab-case.`);
      } else if (!NETWORK_ALLOWED_STAT_IDS.has(stat.id)) {
        errors.push(`Network region ${label} stat ${statLabel}: choose an allowed aggregate stat id.`);
      } else if (statIds.has(stat.id)) {
        errors.push(`Network region ${label} stat ${statLabel}: duplicate id.`);
      } else {
        statIds.add(stat.id);
      }

      if (isBlankValue(stat?.code)) {
        errors.push(`Network region ${label} stat ${statLabel}: code is required.`);
      } else if (!NETWORK_ALLOWED_STAT_CODES.has(stat.code)) {
        errors.push(`Network region ${label} stat ${statLabel}: choose an allowed safe code.`);
      }

      if (isBlankValue(stat?.label)) {
        errors.push(`Network region ${label} stat ${statLabel}: label is required.`);
      } else if (locale === "en" && !NETWORK_ALLOWED_STAT_LABELS.has(stat.label)) {
        errors.push(`Network region ${label} stat ${statLabel}: choose an allowed aggregate label.`);
      }

      const expectedStat = NETWORK_STAT_BY_ID.get(stat?.id);
      if (expectedStat && stat.code !== expectedStat.code) {
        errors.push(`Network region ${label} stat ${statLabel}: code must match the selected aggregate stat.`);
      }
      if (locale === "en" && expectedStat && stat.label !== expectedStat.label) {
        errors.push(`Network region ${label} stat ${statLabel}: label must match the selected aggregate stat.`);
      }

      if (typeof stat?.count !== "number" || stat.count < 0 || !Number.isInteger(stat.count)) {
        errors.push(`Network region ${label} stat ${statLabel}: count must be a non-negative integer.`);
      }
    });
  });

  for (const expectedRegionId of NETWORK_ALLOWED_REGION_IDS) {
    if (!regionIds.has(expectedRegionId)) {
      errors.push(`Network regions are missing ${expectedRegionId}.`);
    }
  }

  return errors;
};

const getNewsValidationErrors = (content) => {
  const errors = [];
  const news = content?.news;
  const categoryOptions = Array.isArray(news?.categoryOptions) ? news.categoryOptions : [];
  const categories = new Set(categoryOptions.map((category) => category?.id));
  const seenIds = new Set();
  const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;
  const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
  const isHttpsUrl = (value) => typeof value === "string" && /^https:\/\/\S+$/i.test(value);
  const isIsoDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };

  if (!news || !Array.isArray(news.items)) {
    errors.push("news.items must be an array.");
  }

  if (!news || !Array.isArray(news.categoryOptions) || news.categoryOptions.length === 0) {
    errors.push("News categories must contain at least one category.");
  } else {
    const seenCategories = new Set();

    categoryOptions.forEach((category, index) => {
      if (!isPlainObject(category)) {
        errors.push(`News category ${index + 1}: use an object with id and label.`);
        return;
      }

      if (isBlank(category.id)) {
        errors.push(`News category ${index + 1}: id is required.`);
      } else if (!FOCUS_ID_PATTERN.test(category.id)) {
        errors.push(`News category ${category.id}: id must use lowercase kebab-case.`);
      } else if (seenCategories.has(category.id)) {
        errors.push(`News categories contain duplicate category "${category.id}".`);
      } else {
        seenCategories.add(category.id);
      }

      if (isBlank(category.label)) {
        errors.push(`News category ${category.id ?? index + 1}: label is required.`);
      }

      if (DISABLED_NEWS_CATEGORIES.has(category.id)) {
        errors.push(`News categories cannot include disabled category "${category.id}".`);
      } else if (!EXPECTED_NEWS_CATEGORY_IDS.has(category.id)) {
        errors.push(`News categories contain unsupported category "${category.id}".`);
      }
    });

    EXPECTED_NEWS_CATEGORY_IDS.forEach((categoryId) => {
      if (!seenCategories.has(categoryId)) {
        errors.push(`News categories are missing "${categoryId}".`);
      }
    });
  }

  (news?.items ?? []).forEach((item, index) => {
    const label = item.id || `row ${index + 1}`;
    const isVisible = item.visible !== false;

    if (item.id === undefined || item.id === null || item.id === "") {
      errors.push(`News row ${index + 1}: id is required.`);
    } else if (seenIds.has(item.id)) {
      errors.push(`News ${label}: duplicate id.`);
    } else {
      seenIds.add(item.id);
    }

    if (DISABLED_NEWS_CATEGORIES.has(item.categoryId)) {
      errors.push(`News ${label}: "${item.categoryId}" is disabled.`);
    } else if (!categories.has(item.categoryId)) {
      errors.push(`News ${label}: choose a valid category.`);
    }
    if (item.category !== undefined) errors.push(`News ${label}: use categoryId instead of legacy category.`);
    if (!isBlank(item.publishedAt) && !isIsoDate(item.publishedAt)) errors.push(`News ${label}: date must be YYYY-MM-DD.`);
    if (!isBlank(item.sourceUrl) && !isHttpsUrl(item.sourceUrl)) errors.push(`News ${label}: source URL must start with https://.`);
    if (!isBlank(item.image) && !isHttpsUrl(item.image)) errors.push(`News ${label}: image URL must start with https://.`);
    if (item.featured === true && item.visible === false) errors.push(`News ${label}: hidden drafts cannot be featured.`);

    if (isVisible) {
      for (const field of ["title", "summary", "categoryId", "publishedAt", "sourceUrl"]) {
        if (isBlank(item[field])) errors.push(`News ${label}: ${field} is required before publishing.`);
      }
      if (isBlank(item.company) && isBlank(item.source)) {
        errors.push(`News ${label}: company or source is required before publishing.`);
      }
    }
  });

  return errors;
};

const Editor = () => {
  const [content, setContent] = useState(null);
  const [activeLocale, setActiveLocale] = useState("en");
  const [active, setActive] = useState("brand");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const errorBannerRef = useRef(null);

  const isLocalized = Boolean(content?.localeConfig && content?.contentByLocale);
  const localeConfig = content?.localeConfig;
  const supportedLocales = localeConfig?.supportedLocales ?? [];
  const activeContent = isLocalized ? content?.contentByLocale?.[activeLocale] : content;
  const getScopedPath = (path) => (isLocalized ? ["contentByLocale", activeLocale, ...path] : path);
  const iconKeys = useMemo(() => activeContent?.iconKeys ?? [], [activeContent]);

  const updateAtPath = (path, value) => {
    const scopedPath = getScopedPath(path);
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < scopedPath.length - 1; i += 1) {
        cursor = cursor[scopedPath[i]];
      }
      cursor[scopedPath[scopedPath.length - 1]] = value;
      return next;
    });
  };

  const updateArrayItem = (path, index, updater) => {
    const scopedPath = getScopedPath(path);
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < scopedPath.length; i += 1) {
        cursor = cursor[scopedPath[i]];
      }
      cursor[index] = updater(cursor[index]);
      return next;
    });
  };

  const addArrayItem = (path, item) => {
    const scopedPath = getScopedPath(path);
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < scopedPath.length; i += 1) {
        cursor = cursor[scopedPath[i]];
      }
      cursor.push(item);
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    const scopedPath = getScopedPath(path);
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < scopedPath.length; i += 1) {
        cursor = cursor[scopedPath[i]];
      }
      cursor.splice(index, 1);
      return next;
    });
  };

  const moveArrayItem = (path, from, to) => {
    const scopedPath = getScopedPath(path);
    setContent((prev) => {
      const next = cloneData(prev);
      let cursor = next;
      for (let i = 0; i < scopedPath.length; i += 1) {
        cursor = cursor[scopedPath[i]];
      }
      cursor.splice(0, cursor.length, ...moveItem(cursor, from, to));
      return next;
    });
  };

  const loadContent = async () => {
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/__editor/content");
      if (!res.ok) throw new Error("Failed to load content");
      const data = await res.json();
      setContent(data);
      setActiveLocale(data.localeConfig?.defaultLocale ?? "en");
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to load content");
    }
  };

  const saveContent = async () => {
    const validationErrors = content?.contentByLocale
      ? Object.entries(content.contentByLocale).flatMap(([locale, localeContent]) =>
          [
            ...getAboutValidationErrors(localeContent),
            ...getFocusValidationErrors(localeContent, locale),
            ...getNetworkValidationErrors(localeContent, locale),
            ...getNewsValidationErrors(localeContent),
          ].map((message) => `${locale}: ${message}`)
        )
      : [
          ...getAboutValidationErrors(content),
          ...getFocusValidationErrors(content),
          ...getNetworkValidationErrors(content),
          ...getNewsValidationErrors(content),
        ];
    if (validationErrors.length > 0) {
      setStatus("error");
      setError(validationErrors.join("\n"));
      return;
    }

    setStatus("saving");
    setError("");
    try {
      const res = await fetch("/__editor/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content, null, 2),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save content");
      }
      const data = await res.json();
      setStatus(`saved:${data.savedAt}`);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to save content");
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    if (status === "error" && error && errorBannerRef.current) {
      errorBannerRef.current.focus();
    }
  }, [status, error]);

  if (!content) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          {status === "error" ? error : "Loading editor..."}
        </div>
      </div>
    );
  }

  if (!activeContent) {
    return (
      <div className="min-h-screen bg-slate-50 p-10">
        <div className="mx-auto max-w-4xl rounded-lg border border-red-200 bg-white p-6 text-sm text-red-700">
          Active locale content is missing. Check content.data.json localeConfig and contentByLocale.
        </div>
      </div>
    );
  }

  const editorFocusCategories = Array.isArray(activeContent.focus?.categories)
    ? activeContent.focus.categories.filter((category) => category && typeof category === "object")
    : [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold">DWD Content Editor</h1>
            <p className="text-xs text-slate-500">Edit content.data.json and regenerate content.jsx.</p>
          </div>
          <div className="flex items-center gap-3">
            {isLocalized && (
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                Locale
                <Select value={activeLocale} onChange={(e) => setActiveLocale(e.target.value)} className="min-w-32">
                  {supportedLocales.map((locale) => (
                    <option key={locale.id} value={locale.id}>
                      {locale.nativeLabel}
                    </option>
                  ))}
                </Select>
              </label>
            )}
            <button
              onClick={loadContent}
              className="rounded border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Reload
            </button>
            <button
              onClick={saveContent}
              className="rounded bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
        {status.startsWith("saved") && (
          <div className="bg-emerald-50 px-6 py-2 text-xs text-emerald-700">
            Saved at {status.split(":")[1]}
          </div>
        )}
        {status === "error" && (
          <div
            ref={errorBannerRef}
            role="alert"
            aria-live="assertive"
            tabIndex={-1}
            className="whitespace-pre-line bg-red-50 px-6 py-2 text-xs text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            {error}
          </div>
        )}
      </header>

      <div className="mx-auto grid max-w-6xl grid-cols-[220px_1fr] gap-6 px-6 py-8">
        <aside className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-sm">
          {Object.keys(SECTION_LABELS).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full rounded px-3 py-2 text-left text-sm font-medium ${
                active === key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {SECTION_LABELS[key]}
            </button>
          ))}
        </aside>

        <main className="space-y-6">
          {active === "metadata" && (
            <Card title="Metadata">
              <SectionHeader
                title="Locale Metadata"
                description="Used by generated /en and /ko HTML shells for title, description, canonical URL, and Open Graph locale."
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <Input value={activeContent.metadata?.title ?? ""} onChange={(e) => updateAtPath(["metadata", "title"], e.target.value)} />
                </Field>
                <Field label="Open Graph Locale">
                  <Input
                    value={activeContent.metadata?.ogLocale ?? ""}
                    onChange={(e) => updateAtPath(["metadata", "ogLocale"], e.target.value)}
                  />
                </Field>
                <Field label="Canonical Path">
                  <Input
                    value={activeContent.metadata?.canonicalPath ?? ""}
                    onChange={(e) => updateAtPath(["metadata", "canonicalPath"], e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Description">
                <TextArea
                  rows={4}
                  value={activeContent.metadata?.description ?? ""}
                  onChange={(e) => updateAtPath(["metadata", "description"], e.target.value)}
                />
              </Field>
            </Card>
          )}

          {active === "ui" && (
            <Card title="UI Labels">
              <SectionHeader
                title="Localized UI and accessibility text"
                description="These labels are visitor-visible or screen-reader-visible strings used outside the main section content."
              />
              <div className="grid gap-4 md:grid-cols-2">
                {UI_LABEL_FIELDS.map((key) => (
                  <Field key={key} label={key}>
                    <Input value={activeContent.ui?.[key] ?? ""} onChange={(e) => updateAtPath(["ui", key], e.target.value)} />
                  </Field>
                ))}
              </div>
            </Card>
          )}

          {active === "brand" && (
            <Card title="Brand">
              <SectionHeader title="Navigation Brand" description="Top-left brand mark." />
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Left">
                  <Input value={activeContent.brand.left} onChange={(e) => updateAtPath(["brand", "left"], e.target.value)} />
                </Field>
                <Field label="Dot">
                  <Input value={activeContent.brand.dot} onChange={(e) => updateAtPath(["brand", "dot"], e.target.value)} />
                </Field>
                <Field label="Right">
                  <Input value={activeContent.brand.right} onChange={(e) => updateAtPath(["brand", "right"], e.target.value)} />
                </Field>
              </div>
            </Card>
          )}

          {active === "sections" && (
            <Card title="Sections">
              <SectionHeader title="Navigation & Section Headers" description="Order here defines navigation order." />
              <div className="space-y-4">
                {activeContent.sections.map((section, index) => (
                  <div key={section.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {section.id}</div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <Field label="Nav Label">
                        <Input
                          value={section.navLabel}
                          onChange={(e) => updateAtPath(["sections", index, "navLabel"], e.target.value)}
                        />
                      </Field>
                      <Field label="Number">
                        <Input
                          value={section.number}
                          onChange={(e) => updateAtPath(["sections", index, "number"], e.target.value)}
                        />
                      </Field>
                      <Field label="Title">
                        <Input
                          value={section.title}
                          onChange={(e) => updateAtPath(["sections", index, "title"], e.target.value)}
                        />
                      </Field>
                      <Field label="Title Lines" help="One line per row (optional).">
                        <TextArea
                          rows={3}
                          value={textFromArray(section.titleLines ?? [])}
                          onChange={(e) => {
                            const lines = arrayFromText(e.target.value);
                            updateAtPath(["sections", index, "titleLines"], lines.length > 0 ? lines : null);
                          }}
                        />
                      </Field>
                    </div>
                    <div className="mt-3 text-xs text-slate-400">
                      Section order is fixed to match the page layout.
                    </div>
                  </div>
                ))}
              </div>

            </Card>
          )}

          {active === "hero" && (
            <Card title="Hero">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title Lines" help="One line per row.">
                  <TextArea
                    rows={4}
                    value={textFromArray(activeContent.hero.titleLines)}
                    onChange={(e) => updateAtPath(["hero", "titleLines"], arrayFromText(e.target.value))}
                  />
                </Field>
                <Field label="Subtitle Lines" help="One line per row.">
                  <TextArea
                    rows={4}
                    value={textFromArray(activeContent.hero.subtitleLines)}
                    onChange={(e) => updateAtPath(["hero", "subtitleLines"], arrayFromText(e.target.value))}
                  />
                </Field>
              </div>
              <SectionHeader title="Hero Card" />
              <Field label="Card Icon">
                <Select
                  value={activeContent.hero.card.iconKey}
                  onChange={(e) => updateAtPath(["hero", "card", "iconKey"], e.target.value)}
                >
                  {iconKeys.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="space-y-3">
                {activeContent.hero.card.lines.map((line, index) => (
                  <div key={`${line.text}-${index}`} className="flex items-center gap-3">
                    <Input
                      value={line.text}
                      onChange={(e) =>
                        updateArrayItem(["hero", "card", "lines"], index, (item) => ({
                          ...item,
                          text: e.target.value,
                        }))
                      }
                    />
                    <label className="flex items-center gap-2 text-xs text-slate-600">
                      <input
                        type="checkbox"
                        checked={line.accent ?? false}
                        onChange={(e) =>
                          updateArrayItem(["hero", "card", "lines"], index, (item) => ({
                            ...item,
                            accent: e.target.checked,
                          }))
                        }
                      />
                      Accent
                    </label>
                    <button
                      className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                      onClick={() => removeArrayItem(["hero", "card", "lines"], index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => addArrayItem(["hero", "card", "lines"], { text: "NEW LINE" })}
                >
                  + Add Line
                </button>
              </div>
            </Card>
          )}

          {active === "marquee" && (
            <Card title="Marquee">
              <Field label="Primary Text">
                <Input value={activeContent.marquee.primary} onChange={(e) => updateAtPath(["marquee", "primary"], e.target.value)} />
              </Field>
              <Field label="Secondary Text">
                <Input value={activeContent.marquee.secondary} onChange={(e) => updateAtPath(["marquee", "secondary"], e.target.value)} />
              </Field>
            </Card>
          )}

          {active === "about" && (
            <Card title="About">
              <SectionHeader
                title="Leadership & Philosophy"
                description="Sample CEO fields can be replaced with official information when ready."
              />
              <Field label="Headline">
                <Input value={activeContent.about.headlineLine} onChange={(e) => updateAtPath(["about", "headlineLine"], e.target.value)} />
              </Field>
              <Field label="Headline Highlight">
                <Input
                  value={activeContent.about.headlineHighlight}
                  onChange={(e) => updateAtPath(["about", "headlineHighlight"], e.target.value)}
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="CEO Eyebrow">
                  <Input value={activeContent.about.leader.eyebrow} onChange={(e) => updateAtPath(["about", "leader", "eyebrow"], e.target.value)} />
                </Field>
                <Field label="CEO Name">
                  <Input value={activeContent.about.leader.name} onChange={(e) => updateAtPath(["about", "leader", "name"], e.target.value)} />
                </Field>
                <Field label="CEO Role">
                  <Input value={activeContent.about.leader.role} onChange={(e) => updateAtPath(["about", "leader", "role"], e.target.value)} />
                </Field>
                <Field label="CEO Photo Path" help="Use /images/team/file-name.jpg, .png, .webp, .svg, or an https:// image URL.">
                  <Input value={activeContent.about.leader.photo} onChange={(e) => updateAtPath(["about", "leader", "photo"], e.target.value)} />
                </Field>
              </div>
              <Field label="CEO Photo Alt">
                <Input value={activeContent.about.leader.photoAlt} onChange={(e) => updateAtPath(["about", "leader", "photoAlt"], e.target.value)} />
              </Field>
              <Field label="Greeting Title">
                <TextArea
                  rows={2}
                  value={activeContent.about.leader.greetingTitle}
                  onChange={(e) => updateAtPath(["about", "leader", "greetingTitle"], e.target.value)}
                />
              </Field>
              <Field label="Greeting Body" help="One paragraph per line.">
                <TextArea
                  rows={6}
                  value={textFromArray(activeContent.about.leader.greetingBody)}
                  onChange={(e) => updateAtPath(["about", "leader", "greetingBody"], arrayFromText(e.target.value))}
                />
              </Field>
              <Field label="Biography" help="One bullet per line.">
                <TextArea
                  rows={5}
                  value={textFromArray(activeContent.about.leader.bio)}
                  onChange={(e) => updateAtPath(["about", "leader", "bio"], arrayFromText(e.target.value))}
                />
              </Field>
              <Field label="Expertise Tags" help="Disabled. Expertise tags are no longer displayed under the public About profile.">
                <Input
                  value={textFromTags(activeContent.about.leader.tags)}
                  disabled
                  readOnly
                  className="cursor-not-allowed bg-slate-100 text-slate-400"
                />
              </Field>

              <div className="border-t border-slate-200 pt-4">
                <SectionHeader title="Philosophy" description="This replaces the legacy Mission and Vision blocks." />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Philosophy Eyebrow">
                  <Input value={activeContent.about.philosophy.eyebrow} onChange={(e) => updateAtPath(["about", "philosophy", "eyebrow"], e.target.value)} />
                </Field>
                <Field label="Philosophy Title">
                  <Input value={activeContent.about.philosophy.title} onChange={(e) => updateAtPath(["about", "philosophy", "title"], e.target.value)} />
                </Field>
              </div>
              <Field label="Philosophy Body">
                <TextArea
                  rows={4}
                  value={activeContent.about.philosophy.body}
                  onChange={(e) => updateAtPath(["about", "philosophy", "body"], e.target.value)}
                />
              </Field>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Philosophy Principles</div>
                {activeContent.about.philosophy.principles.map((principle, index) => (
                  <div key={`about-principle-${index}`} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">Principle {index + 1}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input
                          value={principle.title}
                          onChange={(e) =>
                            updateArrayItem(["about", "philosophy", "principles"], index, (item) => ({ ...item, title: e.target.value }))
                          }
                        />
                      </Field>
                      <Field label="Text">
                        <TextArea
                          rows={3}
                          value={principle.text}
                          onChange={(e) =>
                            updateArrayItem(["about", "philosophy", "principles"], index, (item) => ({ ...item, text: e.target.value }))
                          }
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4">
                <SectionHeader title="Global Operating Footprint" description="Office map shown inside the About section." />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Footprint Eyebrow">
                  <Input
                    value={activeContent.about.footprint.eyebrow}
                    onChange={(e) => updateAtPath(["about", "footprint", "eyebrow"], e.target.value)}
                  />
                </Field>
                <Field label="Footprint Title">
                  <Input
                    value={activeContent.about.footprint.title}
                    onChange={(e) => updateAtPath(["about", "footprint", "title"], e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Footprint Body">
                <TextArea
                  rows={3}
                  value={activeContent.about.footprint.body}
                  onChange={(e) => updateAtPath(["about", "footprint", "body"], e.target.value)}
                />
              </Field>

              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Office Locations</div>
                {activeContent.about.footprint.offices.map((office, index) => (
                  <div key={`about-office-${office.id}-${index}`} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">Office {index + 1}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="ID">
                        <Input
                          value={office.id}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, id: e.target.value }))}
                        />
                      </Field>
                      <Field label="Type">
                        <Select
                          value={office.type}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, type: e.target.value }))}
                        >
                          <option value="hq">hq</option>
                          <option value="branch">branch</option>
                        </Select>
                      </Field>
                      <Field label="Label">
                        <Input
                          value={office.label}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, label: e.target.value }))}
                        />
                      </Field>
                      <Field label="Short Label">
                        <Input
                          value={office.shortLabel}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, shortLabel: e.target.value }))}
                        />
                      </Field>
                      <Field label="X Coordinate" help="0 to 100 percent from the left edge of the footprint map.">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={office.x}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, x: Number(e.target.value) }))}
                        />
                      </Field>
                      <Field label="Y Coordinate" help="0 to 100 percent from the top edge of the footprint map.">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={office.y}
                          onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, y: Number(e.target.value) }))}
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <Input
                        value={office.description}
                        onChange={(e) => updateArrayItem(["about", "footprint", "offices"], index, (item) => ({ ...item, description: e.target.value }))}
                      />
                    </Field>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {active === "focus" && (
            <Card title="Focus Areas">
              <SectionHeader
                title="Core Focus Categories"
                description="Top-level categories render as tabs. Korean subcategories render inside the active tab panel."
              />
              <div className="space-y-4">
                {editorFocusCategories.map((category, index) => (
                  <div key={category.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {category.id}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label={activeLocale === "en" ? "English Category (fixed)" : "Category Title"}>
                        <Input
                          value={category.title}
                          readOnly={activeLocale === "en"}
                          className={activeLocale === "en" ? "bg-slate-50 text-slate-500" : undefined}
                          onChange={(e) => updateAtPath(["focus", "categories", index, "title"], e.target.value)}
                        />
                      </Field>
                      <Field label="Korean Summary">
                        <Input
                          value={category.summaryKo}
                          onChange={(e) => updateAtPath(["focus", "categories", index, "summaryKo"], e.target.value)}
                        />
                      </Field>
                      <Field label="Code">
                        <Input
                          value={category.code}
                          onChange={(e) => updateAtPath(["focus", "categories", index, "code"], e.target.value)}
                        />
                      </Field>
                      <Field label="Icon">
                        <Select
                          value={category.iconKey}
                          onChange={(e) => updateAtPath(["focus", "categories", index, "iconKey"], e.target.value)}
                        >
                          {iconKeys.map((key) => (
                            <option key={key} value={key}>
                              {key}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                    <Field label="Subcategories" help="One Korean subcategory per line. Empty lines are removed.">
                      <TextArea
                        rows={6}
                        value={textFromArray(Array.isArray(category.subcategories) ? category.subcategories : [])}
                        onChange={(e) => updateAtPath(["focus", "categories", index, "subcategories"], arrayFromText(e.target.value))}
                      />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["focus", "categories"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["focus", "categories"], index, Math.min(editorFocusCategories.length - 1, index + 1))}
                        disabled={index === editorFocusCategories.length - 1}
                      >
                        Move Down
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {active === "team" && (
            <Card title="Team">
              <div className="space-y-4">
                {activeContent.team.members.map((member, index) => (
                  <div key={member.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 text-xs font-semibold text-slate-400">ID: {member.id}</div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Name">
                        <Input value={member.name} onChange={(e) => updateAtPath(["team", "members", index, "name"], e.target.value)} />
                      </Field>
                      <Field label="Role">
                        <Input value={member.role} onChange={(e) => updateAtPath(["team", "members", index, "role"], e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Bio">
                      <TextArea value={member.bio} onChange={(e) => updateAtPath(["team", "members", index, "bio"], e.target.value)} />
                    </Field>
                    <Field label="Tags (comma separated)">
                      <Input
                        value={textFromTags(member.tags)}
                        onChange={(e) => updateAtPath(["team", "members", index, "tags"], tagsFromText(e.target.value))}
                      />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["team", "members"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["team", "members"], index, Math.min(activeContent.team.members.length - 1, index + 1))}
                        disabled={index === activeContent.team.members.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["team", "members"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...activeContent.team.members.map((member) => Number(member.id) || 0));
                    addArrayItem(["team", "members"], {
                      id: maxId + 1,
                      name: "New Member",
                      role: "",
                      bio: "",
                      tags: [],
                    });
                  }}
                >
                  + Add Team Member
                </button>
              </div>
            </Card>
          )}

          {active === "business" && (
            <Card title="Business">
              <div className="space-y-4">
                {activeContent.business.steps.map((step, index) => (
                  <div key={step.id} className="rounded border border-slate-200 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="Step ID">
                        <Input value={step.id} onChange={(e) => updateAtPath(["business", "steps", index, "id"], e.target.value)} />
                      </Field>
                      <Field label="Title">
                        <Input value={step.title} onChange={(e) => updateAtPath(["business", "steps", index, "title"], e.target.value)} />
                      </Field>
                      <Field label="Icon">
                        <Select
                          value={step.iconKey}
                          onChange={(e) => updateAtPath(["business", "steps", index, "iconKey"], e.target.value)}
                        >
                          {iconKeys.map((key) => (
                            <option key={key} value={key}>
                              {key}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    </div>
                    <Field label="Description">
                      <TextArea value={step.desc} onChange={(e) => updateAtPath(["business", "steps", index, "desc"], e.target.value)} />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["business", "steps"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() =>
                          moveArrayItem(["business", "steps"], index, Math.min(activeContent.business.steps.length - 1, index + 1))
                        }
                        disabled={index === activeContent.business.steps.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["business", "steps"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...activeContent.business.steps.map((step) => Number(step.id) || 0));
                    addArrayItem(["business", "steps"], {
                      id: String(maxId + 1).padStart(2, "0"),
                      title: "New Step",
                      desc: "",
                      iconKey: iconKeys[0] ?? "Dna",
                    });
                  }}
                >
                  + Add Business Step
                </button>
              </div>
            </Card>
          )}

          {active === "network" && (
            <div className="space-y-6">
              <Card title="Network Aggregate Map">
                <SectionHeader
                  title="Aggregate-only content"
                  description="No partner, institution, company, logo, URL, or city-level fields are allowed."
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input value={activeContent.network?.eyebrow ?? ""} onChange={(e) => updateAtPath(["network", "eyebrow"], e.target.value)} />
                  </Field>
                  <Field label="Hub Label">
                    <Input value={activeContent.network?.hubLabel ?? ""} onChange={(e) => updateAtPath(["network", "hubLabel"], e.target.value)} />
                  </Field>
                  <Field label="Total Label">
                    <Input value={activeContent.network?.totalLabel ?? ""} onChange={(e) => updateAtPath(["network", "totalLabel"], e.target.value)} />
                  </Field>
                  <Field label="Market Summary Label">
                    <Input
                      value={activeContent.network?.regionSummaryLabel ?? ""}
                      onChange={(e) => updateAtPath(["network", "regionSummaryLabel"], e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Intro">
                  <TextArea rows={3} value={activeContent.network?.intro ?? ""} onChange={(e) => updateAtPath(["network", "intro"], e.target.value)} />
                </Field>
                <Field label="Privacy Note">
                  <TextArea
                    rows={2}
                    value={activeContent.network?.privacyNote ?? ""}
                    onChange={(e) => updateAtPath(["network", "privacyNote"], e.target.value)}
                  />
                </Field>
              </Card>

              <Card title="Aggregate Markets">
                <SectionHeader
                  title="Fixed markets and aggregate stats"
                  description="Markets and categories are selected from approved aggregate labels. Add/remove controls are intentionally unavailable."
                />
                <div className="space-y-5">
                  {(Array.isArray(activeContent.network?.regions) ? activeContent.network.regions : []).map((region, index, regions) => (
                    <div key={region.id ?? index} className="rounded border border-slate-200 p-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Market ID">
                          <Select
                            value={region.id}
                            onChange={(e) => {
                              const option = NETWORK_REGION_BY_ID.get(e.target.value);
                              if (!option) return;
                              updateArrayItem(["network", "regions"], index, (current) => ({
                                ...current,
                                id: option.id,
                                label: option.label,
                                shortLabel: option.shortLabel,
                              }));
                            }}
                          >
                            {NETWORK_REGION_OPTIONS.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.id}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <Field label="Market Label">
                          {activeLocale === "en" ? (
                            <Select value={region.label} onChange={(e) => updateAtPath(["network", "regions", index, "label"], e.target.value)}>
                              {NETWORK_REGION_OPTIONS.map((option) => (
                                <option key={option.label} value={option.label}>
                                  {option.label}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <Input value={region.label} onChange={(e) => updateAtPath(["network", "regions", index, "label"], e.target.value)} />
                          )}
                        </Field>
                        <Field label="Short Label">
                          <Select
                            value={region.shortLabel}
                            onChange={(e) => updateAtPath(["network", "regions", index, "shortLabel"], e.target.value)}
                          >
                            {NETWORK_REGION_OPTIONS.map((option) => (
                              <option key={option.shortLabel} value={option.shortLabel}>
                                {option.shortLabel}
                              </option>
                            ))}
                          </Select>
                        </Field>
                        <Field label="X" help="Map marker percentage, 5 to 95.">
                          <Input
                            type="number"
                            min="5"
                            max="95"
                            value={region.x}
                            onChange={(e) => updateAtPath(["network", "regions", index, "x"], Number(e.target.value))}
                          />
                        </Field>
                        <Field label="Y" help="Map marker percentage, 5 to 95.">
                          <Input
                            type="number"
                            min="5"
                            max="95"
                            value={region.y}
                            onChange={(e) => updateAtPath(["network", "regions", index, "y"], Number(e.target.value))}
                          />
                        </Field>
                        <Field label="Summary">
                          {activeLocale === "en" ? (
                            <Select value={region.summary} onChange={(e) => updateAtPath(["network", "regions", index, "summary"], e.target.value)}>
                              {NETWORK_REGION_SUMMARY_OPTIONS.map((summary) => (
                                <option key={summary} value={summary}>
                                  {summary}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <TextArea
                              rows={3}
                              value={region.summary}
                              onChange={(e) => updateAtPath(["network", "regions", index, "summary"], e.target.value)}
                            />
                          )}
                        </Field>
                      </div>

                      <div className="mt-4 space-y-3">
                        <SectionHeader title="Aggregate Stats" description="Counts may change; labels and codes remain approved aggregate categories." />
                        {(Array.isArray(region.stats) ? region.stats : []).map((stat, statIndex) => (
                          <div key={`${region.id}-${stat.id ?? statIndex}`} className="grid gap-3 rounded border border-slate-100 bg-slate-50 p-3 md:grid-cols-4">
                            <Field label="Stat ID">
                              <Select
                                value={stat.id}
                                onChange={(e) => {
                                  const option = NETWORK_STAT_BY_ID.get(e.target.value);
                                  if (!option) return;
                                  updateArrayItem(["network", "regions", index, "stats"], statIndex, (current) => ({
                                    ...current,
                                    id: option.id,
                                    code: option.code,
                                    label: option.label,
                                  }));
                                }}
                              >
                                {NETWORK_STAT_OPTIONS.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.id}
                                  </option>
                                ))}
                              </Select>
                            </Field>
                            <Field label="Code">
                              <Select value={stat.code} onChange={(e) => updateAtPath(["network", "regions", index, "stats", statIndex, "code"], e.target.value)}>
                                {NETWORK_STAT_CODE_OPTIONS.map((code) => (
                                  <option key={code} value={code}>
                                    {code}
                                  </option>
                                ))}
                              </Select>
                            </Field>
                            <Field label="Category">
                              {activeLocale === "en" ? (
                                <Select value={stat.label} onChange={(e) => updateAtPath(["network", "regions", index, "stats", statIndex, "label"], e.target.value)}>
                                  {NETWORK_STAT_LABEL_OPTIONS.map((label) => (
                                    <option key={label} value={label}>
                                      {label}
                                    </option>
                                  ))}
                                </Select>
                              ) : (
                                <Input
                                  value={stat.label}
                                  onChange={(e) => updateAtPath(["network", "regions", index, "stats", statIndex, "label"], e.target.value)}
                                />
                              )}
                            </Field>
                            <Field label="Count">
                              <Input
                                type="number"
                                min="0"
                                step="1"
                                value={stat.count}
                                onChange={(e) => updateAtPath(["network", "regions", index, "stats", statIndex, "count"], Number(e.target.value))}
                              />
                            </Field>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex items-center gap-2">
                        <button
                          className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                          onClick={() => moveArrayItem(["network", "regions"], index, Math.max(0, index - 1))}
                          disabled={index === 0}
                        >
                          Move Up
                        </button>
                        <button
                          className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                          onClick={() => moveArrayItem(["network", "regions"], index, Math.min(regions.length - 1, index + 1))}
                          disabled={index === regions.length - 1}
                        >
                          Move Down
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {active === "portfolio" && (
            <Card title="Portfolio">
              <Field label="Table Headers">
                <div className="grid gap-4 md:grid-cols-5">
                  {Object.entries(activeContent.portfolio.tableHeaders).map(([key, value]) => (
                    <Input
                      key={key}
                      value={value}
                      onChange={(e) => updateAtPath(["portfolio", "tableHeaders", key], e.target.value)}
                    />
                  ))}
                </div>
              </Field>
              <Field label="Investment Label">
                <Input
                  value={activeContent.portfolio.investmentLabel}
                  onChange={(e) => updateAtPath(["portfolio", "investmentLabel"], e.target.value)}
                />
              </Field>
              <Field label="Milestones Label">
                <Input
                  value={activeContent.portfolio.milestonesLabel}
                  onChange={(e) => updateAtPath(["portfolio", "milestonesLabel"], e.target.value)}
                />
              </Field>
              <Field label="Visit Button Label">
                <Input value={activeContent.portfolio.visitLabel} onChange={(e) => updateAtPath(["portfolio", "visitLabel"], e.target.value)} />
              </Field>
              <SectionHeader title="Items" description="List order controls display order." />
              <div className="space-y-4">
                {activeContent.portfolio.items.map((item, index) => (
                  <div key={item.id} className="rounded border border-slate-200 p-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <Field label="ID">
                        <Input value={item.id} onChange={(e) => updateAtPath(["portfolio", "items", index, "id"], Number(e.target.value))} />
                      </Field>
                      <Field label="Name">
                        <Input value={item.name} onChange={(e) => updateAtPath(["portfolio", "items", index, "name"], e.target.value)} />
                      </Field>
                      <Field label="Category">
                        <Input
                          value={item.category}
                          onChange={(e) => updateAtPath(["portfolio", "items", index, "category"], e.target.value)}
                        />
                      </Field>
                      <Field label="Year">
                        <Input value={item.year} onChange={(e) => updateAtPath(["portfolio", "items", index, "year"], e.target.value)} />
                      </Field>
                      <Field label="Image URL">
                        <Input value={item.image} onChange={(e) => updateAtPath(["portfolio", "items", index, "image"], e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Description">
                      <TextArea
                        value={item.description}
                        onChange={(e) => updateAtPath(["portfolio", "items", index, "description"], e.target.value)}
                      />
                    </Field>
                    <Field label="Highlights (one per line)">
                      <TextArea
                        rows={4}
                        value={textFromArray(item.highlights)}
                        onChange={(e) => updateAtPath(["portfolio", "items", index, "highlights"], arrayFromText(e.target.value))}
                      />
                    </Field>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["portfolio", "items"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["portfolio", "items"], index, Math.min(activeContent.portfolio.items.length - 1, index + 1))}
                        disabled={index === activeContent.portfolio.items.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["portfolio", "items"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...activeContent.portfolio.items.map((item) => Number(item.id) || 0));
                    addArrayItem(["portfolio", "items"], {
                      id: maxId + 1,
                      name: "New Company",
                      category: "",
                      year: "",
                      image: "",
                      description: "",
                      highlights: [],
                    });
                  }}
                >
                  + Add Portfolio Item
                </button>
              </div>
            </Card>
          )}

          {active === "news" && (
            <Card title="News">
              <SectionHeader title="News Settings" description="Curated updates shown between Portfolio and Contact." />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Eyebrow">
                  <Input value={activeContent.news.eyebrow} onChange={(e) => updateAtPath(["news", "eyebrow"], e.target.value)} />
                </Field>
                <Field label="All Filter Label">
                  <Input value={activeContent.news.allFilterLabel} onChange={(e) => updateAtPath(["news", "allFilterLabel"], e.target.value)} />
                </Field>
                <Field label="Featured Label">
                  <Input value={activeContent.news.featuredLabel} onChange={(e) => updateAtPath(["news", "featuredLabel"], e.target.value)} />
                </Field>
                <Field label="Read More Label">
                  <Input value={activeContent.news.readMoreLabel} onChange={(e) => updateAtPath(["news", "readMoreLabel"], e.target.value)} />
                </Field>
              </div>
              <Field label="Intro">
                <TextArea value={activeContent.news.intro} onChange={(e) => updateAtPath(["news", "intro"], e.target.value)} />
              </Field>
              <Field label="Empty State">
                <Input value={activeContent.news.emptyState} onChange={(e) => updateAtPath(["news", "emptyState"], e.target.value)} />
              </Field>
              <Field label="Empty Filter State">
                <Input value={activeContent.news.emptyFilterState} onChange={(e) => updateAtPath(["news", "emptyFilterState"], e.target.value)} />
              </Field>
              <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-500">
                Categories are fixed for the first release: {EXPECTED_NEWS_CATEGORIES.map((category) => category.label).join(", ")}.
                Market is disabled and cannot be selected.
                IDs are stable across locales; labels may be translated.
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {activeContent.news.categoryOptions.map((category, index) => (
                  <div key={category.id} className="grid gap-3 rounded border border-slate-200 bg-white p-3 md:grid-cols-[0.75fr_1.25fr]">
                    <Field label="Category ID">
                      <Input value={category.id} readOnly className="bg-slate-50 text-slate-500" />
                    </Field>
                    <Field label="Label">
                      <Input
                        value={category.label}
                        onChange={(e) => updateAtPath(["news", "categoryOptions", index, "label"], e.target.value)}
                      />
                    </Field>
                  </div>
                ))}
              </div>

              <SectionHeader title="News Items" description="List order controls public display order." />
              <div className="space-y-4">
                {activeContent.news.items.map((item, index) => (
                  <div key={item.id} className="rounded border border-slate-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="text-xs font-semibold text-slate-400">ID: {item.id}</div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={item.visible !== false}
                            onChange={(e) => updateAtPath(["news", "items", index, "visible"], e.target.checked)}
                          />
                          Visible
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-600">
                          <input
                            type="checkbox"
                            checked={item.featured ?? false}
                            onChange={(e) => updateAtPath(["news", "items", index, "featured"], e.target.checked)}
                          />
                          Featured
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Title">
                        <Input value={item.title ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "title"], e.target.value)} />
                      </Field>
                      <Field label="Category">
                        <Select value={item.categoryId ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "categoryId"], e.target.value)}>
                          {activeContent.news.categoryOptions.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.label}
                            </option>
                          ))}
                        </Select>
                      </Field>
                      <Field label="Published Date">
                        <Input
                          type="date"
                          value={item.publishedAt ?? ""}
                          onChange={(e) => updateAtPath(["news", "items", index, "publishedAt"], e.target.value)}
                        />
                      </Field>
                      <Field label="Company">
                        <Input value={item.company ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "company"], e.target.value)} />
                      </Field>
                      <Field label="Source">
                        <Input value={item.source ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "source"], e.target.value)} />
                      </Field>
                      <Field label="Source URL">
                        <Input type="url" value={item.sourceUrl ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "sourceUrl"], e.target.value)} />
                      </Field>
                      <Field label="Image URL">
                        <Input type="url" value={item.image ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "image"], e.target.value)} />
                      </Field>
                      <Field label="Image Alt Text" help="Leave empty only when the image is decorative.">
                        <Input value={item.imageAlt ?? ""} onChange={(e) => updateAtPath(["news", "items", index, "imageAlt"], e.target.value)} />
                      </Field>
                      <Field label="Tags (comma separated)">
                        <Input value={textFromTags(item.tags)} onChange={(e) => updateAtPath(["news", "items", index, "tags"], tagsFromText(e.target.value))} />
                      </Field>
                    </div>

                    <Field label="Summary" help="Use an original short summary. Do not paste full article text.">
                      <TextArea
                        rows={4}
                        value={item.summary ?? ""}
                        onChange={(e) => updateAtPath(["news", "items", index, "summary"], e.target.value)}
                      />
                    </Field>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["news", "items"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["news", "items"], index, Math.min(activeContent.news.items.length - 1, index + 1))}
                        disabled={index === activeContent.news.items.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["news", "items"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => {
                    const maxId = Math.max(0, ...activeContent.news.items.map((item) => Number(item.id) || 0));
                    addArrayItem(["news", "items"], {
                      id: maxId + 1,
                      title: "",
                      summary: "",
                      categoryId: activeContent.news.categoryOptions[0]?.id ?? "portfolio",
                      company: "",
                      source: "",
                      sourceUrl: "",
                      publishedAt: "",
                      image: "",
                      imageAlt: "",
                      tags: [],
                      featured: false,
                      visible: false,
                    });
                  }}
                >
                  + Add News Item
                </button>
              </div>
            </Card>
          )}

          {active === "contact" && (
            <Card title="Contact">
              <Field label="Pretitle">
                <Input value={activeContent.contact.pretitle} onChange={(e) => updateAtPath(["contact", "pretitle"], e.target.value)} />
              </Field>
              <Field label="Title Lines" help="One line per row.">
                <TextArea
                  rows={3}
                  value={textFromArray(activeContent.contact.titleLines)}
                  onChange={(e) => updateAtPath(["contact", "titleLines"], arrayFromText(e.target.value))}
                />
              </Field>
              <SectionHeader title="Contact Details" description="Contact section and footer representative contact information." />
              <Field label="Contact Note">
                <TextArea
                  rows={3}
                  value={activeContent.contact.contactNote}
                  onChange={(e) => updateAtPath(["contact", "contactNote"], e.target.value)}
                />
              </Field>
              <Field label="Contact Group Label">
                <Input value={activeContent.contact.contactLabel} onChange={(e) => updateAtPath(["contact", "contactLabel"], e.target.value)} />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Phone Label">
                  <Input value={activeContent.contact.phoneLabel} onChange={(e) => updateAtPath(["contact", "phoneLabel"], e.target.value)} />
                </Field>
                <Field label="Phone">
                  <Input type="tel" inputMode="tel" value={activeContent.contact.phone} onChange={(e) => updateAtPath(["contact", "phone"], e.target.value)} />
                </Field>
                <Field label="Phone Link" help="Use tel:+82200000000 format. Keep it synchronized with the display phone.">
                  <Input type="tel" inputMode="tel" value={activeContent.contact.phoneHref} onChange={(e) => updateAtPath(["contact", "phoneHref"], e.target.value)} />
                </Field>
                <Field label="Email Label">
                  <Input value={activeContent.contact.emailLabel} onChange={(e) => updateAtPath(["contact", "emailLabel"], e.target.value)} />
                </Field>
                <Field label="Email">
                  <Input type="email" spellCheck={false} value={activeContent.contact.email} onChange={(e) => updateAtPath(["contact", "email"], e.target.value)} />
                </Field>
                <Field label="Email Link" help="Use mailto:name@example.com format. Keep it synchronized with the display email.">
                  <Input type="url" spellCheck={false} value={activeContent.contact.emailHref} onChange={(e) => updateAtPath(["contact", "emailHref"], e.target.value)} />
                </Field>
              </div>
              <SectionHeader title="Address" />
              <Field label="Headquarters Label">
                <Input
                  value={activeContent.contact.headquartersLabel}
                  onChange={(e) => updateAtPath(["contact", "headquartersLabel"], e.target.value)}
                />
              </Field>
              <Field label="Address Lines (one per line)">
                <TextArea
                  rows={2}
                  value={textFromArray(activeContent.contact.headquartersAddressLines)}
                  onChange={(e) => updateAtPath(["contact", "headquartersAddressLines"], arrayFromText(e.target.value))}
                />
              </Field>
              <Field label="Map Link Label">
                <Input value={activeContent.contact.mapLinkLabel} onChange={(e) => updateAtPath(["contact", "mapLinkLabel"], e.target.value)} />
              </Field>
              <Field label="Map Link URL" help="Use a real map URL. Do not use #.">
                <Input type="url" spellCheck={false} value={activeContent.contact.mapHref} onChange={(e) => updateAtPath(["contact", "mapHref"], e.target.value)} />
              </Field>
            </Card>
          )}

          {active === "footer" && (
            <Card title="Footer">
              <Field label="Copyright">
                <Input value={activeContent.footer.copyright} onChange={(e) => updateAtPath(["footer", "copyright"], e.target.value)} />
              </Field>
              <SectionHeader title="Links" />
              <div className="space-y-4">
                {activeContent.footer.links.map((link, index) => (
                  <div key={`${link.label}-${index}`} className="grid gap-4 rounded border border-slate-200 p-4 md:grid-cols-2">
                    <Field label="Label">
                      <Input value={link.label} onChange={(e) => updateAtPath(["footer", "links", index, "label"], e.target.value)} />
                    </Field>
                    <Field label="URL">
                      <Input value={link.href} onChange={(e) => updateAtPath(["footer", "links", index, "href"], e.target.value)} />
                    </Field>
                    <div className="md:col-span-2 flex items-center gap-2">
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["footer", "links"], index, Math.max(0, index - 1))}
                        disabled={index === 0}
                      >
                        Move Up
                      </button>
                      <button
                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-500"
                        onClick={() => moveArrayItem(["footer", "links"], index, Math.min(activeContent.footer.links.length - 1, index + 1))}
                        disabled={index === activeContent.footer.links.length - 1}
                      >
                        Move Down
                      </button>
                      <button
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-500"
                        onClick={() => removeArrayItem(["footer", "links"], index)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  className="rounded border border-dashed border-slate-300 px-3 py-2 text-xs text-slate-500"
                  onClick={() => addArrayItem(["footer", "links"], { label: "New Link", href: "" })}
                >
                  + Add Footer Link
                </button>
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default Editor;
