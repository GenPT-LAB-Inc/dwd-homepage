import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const dataPath = path.join(rootDir, "content.data.json");
const outPath = path.join(rootDir, "src", "content.jsx");

const stringify = (value) => JSON.stringify(value, null, 2);

const isBlank = (value) => typeof value !== "string" || value.trim().length === 0;
const isPlainObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const isHttpsUrl = (value) => typeof value === "string" && /^https:\/\/\S+$/i.test(value);
const isPublicImagePath = (value) =>
  typeof value === "string" && /^\/images\/[A-Za-z0-9._/-]+\.(png|jpe?g|webp|svg)$/i.test(value);
const isImageReference = (value) => isHttpsUrl(value) || isPublicImagePath(value);
const LEGACY_ABOUT_FIELDS = ["mission", "vision"].flatMap((prefix) =>
  ["Title", "Text"].map((suffix) => `${prefix}${suffix}`)
);
const isIsoDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const EXPECTED_FOCUS_CATEGORIES = [
  { id: "pharmaceuticals-biotech", title: "Pharmaceuticals & Biotech" },
  { id: "medical-devices-diagnostics", title: "Medical Devices & Diagnostics" },
  { id: "digital-healthcare", title: "Digital Healthcare" },
  { id: "consumer-health-wellness", title: "Consumer Health & Wellness" },
];

const CONTENT_TREE_KEYS = [
  "metadata",
  "ui",
  "brand",
  "iconKeys",
  "sections",
  "hero",
  "marquee",
  "about",
  "focus",
  "team",
  "business",
  "network",
  "portfolio",
  "news",
  "contact",
  "footer",
];
const LEGACY_CONTENT_TREE_KEYS = CONTENT_TREE_KEYS.filter((key) => !["metadata", "ui"].includes(key));
const REQUIRED_SECTION_IDS = ["about", "focus", "team", "business", "network", "portfolio", "news", "contact"];
const REQUIRED_UI_KEYS = [
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
const LOCALE_ID_PATTERN = /^[a-z]{2}(?:-[A-Z]{2})?$/;
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
const NETWORK_REGION_BY_ID = new Map(NETWORK_REGION_OPTIONS.map((region) => [region.id, region]));
const NETWORK_STAT_BY_ID = new Map(NETWORK_STAT_OPTIONS.map((stat) => [stat.id, stat]));
const NETWORK_ALLOWED_REGION_IDS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.id));
const NETWORK_ALLOWED_REGION_LABELS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.label));
const NETWORK_ALLOWED_REGION_SHORT_LABELS = new Set(NETWORK_REGION_OPTIONS.map((region) => region.shortLabel));
const NETWORK_ALLOWED_STAT_IDS = new Set(NETWORK_STAT_OPTIONS.map((stat) => stat.id));
const NETWORK_ALLOWED_STAT_LABELS = new Set(NETWORK_STAT_OPTIONS.map((stat) => stat.label));
const NETWORK_ALLOWED_STAT_CODES = new Set(NETWORK_STAT_OPTIONS.map((stat) => stat.code));
const NETWORK_ALLOWED_REGION_SUMMARIES = new Set([
  "Representative aggregate coverage for the US market across approved healthcare access categories.",
  "Representative aggregate coverage for the EU market across approved healthcare access categories.",
  "Representative aggregate coverage for the Japan market across approved healthcare access categories.",
  "Representative aggregate coverage for the China market across approved healthcare access categories.",
  "Representative aggregate coverage for Asia-Pacific markets excluding Japan and China.",
  "Representative aggregate coverage for Middle East and North Africa markets.",
  "Representative aggregate coverage for rest-of-world markets outside the named regions.",
]);
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

export const validateAboutContent = (data) => {
  const errors = [];
  const about = data?.about;
  const leader = about?.leader;
  const philosophy = about?.philosophy;
  const footprint = about?.footprint;

  if (!about) {
    errors.push("about must be configured");
  }

  for (const legacyField of LEGACY_ABOUT_FIELDS) {
    if (about?.[legacyField] !== undefined) {
      errors.push(`about.${legacyField} must be removed; use about.philosophy instead`);
    }
  }

  for (const field of ["headlineLine", "headlineHighlight"]) {
    if (isBlank(about?.[field])) {
      errors.push(`about is missing ${field}`);
    }
  }

  for (const field of ["eyebrow", "name", "role", "photo", "photoAlt", "greetingTitle"]) {
    if (isBlank(leader?.[field])) {
      errors.push(`about.leader is missing ${field}`);
    }
  }

  if (!isBlank(leader?.photo) && !isImageReference(leader.photo)) {
    errors.push("about.leader.photo must be an https:// URL or a /images/ public image path");
  }

  for (const field of ["greetingBody", "bio"]) {
    if (!Array.isArray(leader?.[field]) || leader[field].length === 0) {
      errors.push(`about.leader.${field} must contain at least one item`);
    } else {
      leader[field].forEach((item, index) => {
        if (isBlank(item)) {
          errors.push(`about.leader.${field}[${index}] must not be blank`);
        }
      });
    }
  }

  if (leader?.tags !== undefined) {
    if (!Array.isArray(leader.tags)) {
      errors.push("about.leader.tags must be an array when configured");
    } else {
      leader.tags.forEach((item, index) => {
        if (isBlank(item)) {
          errors.push(`about.leader.tags[${index}] must not be blank`);
        }
      });
    }
  }

  for (const field of ["eyebrow", "title", "body"]) {
    if (isBlank(philosophy?.[field])) {
      errors.push(`about.philosophy is missing ${field}`);
    }
  }

  if (!Array.isArray(philosophy?.principles) || philosophy.principles.length !== 3) {
    errors.push("about.philosophy.principles must contain exactly 3 principles");
  } else {
    philosophy.principles.forEach((principle, index) => {
      for (const field of ["title", "text"]) {
        if (isBlank(principle?.[field])) {
          errors.push(`about.philosophy.principles[${index}].${field} must not be blank`);
        }
      }
    });
  }

  for (const field of ["eyebrow", "title", "body"]) {
    if (isBlank(footprint?.[field])) {
      errors.push(`about.footprint is missing ${field}`);
    }
  }

  if (!Array.isArray(footprint?.offices) || footprint.offices.length !== 3) {
    errors.push("about.footprint.offices must contain exactly 3 offices");
  } else {
    const hqCount = footprint.offices.filter((office) => office?.type === "hq").length;
    const branchCount = footprint.offices.filter((office) => office?.type === "branch").length;

    if (hqCount !== 1) {
      errors.push("about.footprint.offices must contain exactly 1 hq office");
    }
    if (branchCount < 1) {
      errors.push("about.footprint.offices must contain at least 1 branch office");
    }

    footprint.offices.forEach((office, index) => {
      for (const field of ["id", "type", "label", "shortLabel", "description"]) {
        if (isBlank(office?.[field])) {
          errors.push(`about.footprint.offices[${index}].${field} must not be blank`);
        }
      }

      if (!["hq", "branch"].includes(office?.type)) {
        errors.push(`about.footprint.offices[${index}].type must be hq or branch`);
      }

      for (const field of ["x", "y"]) {
        const value = Number(office?.[field]);
        if (!Number.isFinite(value) || value < 0 || value > 100) {
          errors.push(`about.footprint.offices[${index}].${field} must be a number from 0 to 100`);
        }
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateFocusContent = (data, options = {}) => {
  const errors = [];
  const { locale = "en" } = options;
  const focus = data?.focus;
  const categories = focus?.categories;
  const categoryList = Array.isArray(categories) ? categories : [];
  const iconKeys = new Set(data?.iconKeys ?? []);
  const expectedIds = new Set(EXPECTED_FOCUS_CATEGORIES.map((category) => category.id));
  const expectedTitles = new Map(EXPECTED_FOCUS_CATEGORIES.map((category) => [category.id, category.title]));
  const ids = new Set();

  if (!focus) {
    errors.push("focus must be configured");
  }

  if (focus?.areas !== undefined) {
    errors.push("legacy focus.areas must be removed");
  }

  if (!Array.isArray(categories)) {
    errors.push("focus.categories must be an array");
  } else if (categories.length !== EXPECTED_FOCUS_CATEGORIES.length) {
    errors.push(`focus.categories must contain exactly ${EXPECTED_FOCUS_CATEGORIES.length} categories`);
  }

  categoryList.forEach((category, index) => {
    const label = category?.id ?? `index ${index}`;

    if (isBlank(category?.id)) {
      errors.push(`focus category at index ${index} is missing id`);
    } else if (!FOCUS_ID_PATTERN.test(category.id)) {
      errors.push(`focus category ${label} id must use lowercase kebab-case`);
    } else if (ids.has(category.id)) {
      errors.push(`focus category ${label} has a duplicate id`);
    } else if (!expectedIds.has(category.id)) {
      errors.push(`focus category ${label} is not an expected fixed category`);
    } else {
      ids.add(category.id);
    }

    for (const field of ["code", "title", "summaryKo", "iconKey"]) {
      if (isBlank(category?.[field])) {
        errors.push(`focus category ${label} is missing ${field}`);
      }
    }

    if (!isBlank(category?.iconKey) && !iconKeys.has(category.iconKey)) {
      errors.push(`focus category ${label} has invalid iconKey`);
    }

    if (
      locale === "en" &&
      !isBlank(category?.id) &&
      expectedTitles.has(category.id) &&
      category.title !== expectedTitles.get(category.id)
    ) {
      errors.push(`focus category ${label} must use title "${expectedTitles.get(category.id)}"`);
    }

    if (!Array.isArray(category?.subcategories) || category.subcategories.length === 0) {
      errors.push(`focus category ${label} must contain at least one subcategory`);
    }

    if (Array.isArray(category?.subcategories)) {
      category.subcategories.forEach((subcategory, subcategoryIndex) => {
        if (isBlank(subcategory)) {
          errors.push(`focus category ${label} has a blank subcategory at index ${subcategoryIndex}`);
        }
      });
    }
  });

  for (const expectedCategory of EXPECTED_FOCUS_CATEGORIES) {
    if (!ids.has(expectedCategory.id)) {
      errors.push(`focus.categories is missing ${expectedCategory.id}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateNetworkContent = (data, options = {}) => {
  const errors = [];
  const { locale = "en" } = options;
  const network = data?.network;
  const regions = network?.regions;
  const regionList = Array.isArray(regions) ? regions : [];
  const regionIds = new Set();

  if (!network) {
    errors.push("network must be configured");
  }

  if (!Array.isArray(regions) || regions.length === 0) {
    errors.push("network.regions must contain at least one region");
  } else if (regions.length !== NETWORK_ALLOWED_REGION_IDS.size) {
    errors.push(`network.regions must contain exactly ${NETWORK_ALLOWED_REGION_IDS.size} allowed aggregate regions`);
  }

  if (network && typeof network === "object") {
    Object.keys(network).forEach((key) => {
      if (!NETWORK_ALLOWED_KEYS.has(key)) {
        errors.push(`network.${key} is not allowed; Network must use only aggregate map fields`);
      }
    });
  }

  findForbiddenNetworkKeys(network).forEach((pathLabel) => {
    errors.push(`${pathLabel} is not allowed because Network must not contain real partner names, URLs, or logos`);
  });

  findUnsafeNetworkValues(network).forEach((pathLabel) => {
    errors.push(`${pathLabel} contains a blocked URL, logo/image reference, or relationship term`);
  });

  for (const [field, approvedValue] of Object.entries(NETWORK_APPROVED_COPY)) {
    if (isBlank(network?.[field])) {
      errors.push(`network is missing ${field}`);
    } else if (locale === "en" && network[field] !== approvedValue) {
      errors.push(`network.${field} must use approved aggregate-only Network copy`);
    }
  }

  regionList.forEach((region, regionIndex) => {
    const label = region?.id ?? `index ${regionIndex}`;
    const stats = region?.stats;
    const statList = Array.isArray(stats) ? stats : [];
    const statIds = new Set();

    Object.keys(region ?? {}).forEach((key) => {
      if (!NETWORK_ALLOWED_REGION_KEYS.has(key)) {
        errors.push(`network region ${label}.${key} is not allowed; region data must use only aggregate map fields`);
      }
    });

    if (isBlank(region?.id)) {
      errors.push(`network region at index ${regionIndex} is missing id`);
    } else if (!NETWORK_ID_PATTERN.test(region.id)) {
      errors.push(`network region ${label} id must use lowercase kebab-case`);
    } else if (!NETWORK_ALLOWED_REGION_IDS.has(region.id)) {
      errors.push(`network region ${label} id must use an allowed aggregate region id`);
    } else if (regionIds.has(region.id)) {
      errors.push(`network region ${label} has a duplicate id`);
    } else {
      regionIds.add(region.id);
    }

    for (const field of ["label", "shortLabel", "summary"]) {
      if (isBlank(region?.[field])) {
        errors.push(`network region ${label} is missing ${field}`);
      }
    }

    if (locale === "en" && !isBlank(region?.label) && !NETWORK_ALLOWED_REGION_LABELS.has(region.label)) {
      errors.push(`network region ${label} label must use an allowed safe region label`);
    }

    if (!isBlank(region?.shortLabel) && !NETWORK_ALLOWED_REGION_SHORT_LABELS.has(region.shortLabel)) {
      errors.push(`network region ${label} shortLabel must use an allowed safe region code`);
    }

    if (locale === "en" && !isBlank(region?.summary) && !NETWORK_ALLOWED_REGION_SUMMARIES.has(region.summary)) {
      errors.push(`network region ${label} summary must use an allowed safe aggregate summary`);
    }

    const expectedRegion = NETWORK_REGION_BY_ID.get(region?.id);
    if (expectedRegion && region.shortLabel !== expectedRegion.shortLabel) {
      errors.push(`network region ${label} shortLabel must match the selected aggregate region`);
    }

    if (locale === "en" && expectedRegion && region.label !== expectedRegion.label) {
      errors.push(`network region ${label} label must match the selected aggregate region`);
    }

    for (const field of ["x", "y"]) {
      if (typeof region?.[field] !== "number" || region[field] < 5 || region[field] > 95) {
        errors.push(`network region ${label} ${field} must be a number from 5 to 95`);
      }
    }

    if (!Array.isArray(stats) || stats.length === 0) {
      errors.push(`network region ${label} must contain at least one stat`);
    }

    statList.forEach((stat, statIndex) => {
      const statLabel = stat?.id ?? `index ${statIndex}`;

      Object.keys(stat ?? {}).forEach((key) => {
        if (!NETWORK_ALLOWED_STAT_KEYS.has(key)) {
          errors.push(`network region ${label} stat ${statLabel}.${key} is not allowed; stat data must use only aggregate fields`);
        }
      });

      if (isBlank(stat?.id)) {
        errors.push(`network region ${label} stat at index ${statIndex} is missing id`);
      } else if (!NETWORK_ID_PATTERN.test(stat.id)) {
        errors.push(`network region ${label} stat ${statLabel} id must use lowercase kebab-case`);
      } else if (!NETWORK_ALLOWED_STAT_IDS.has(stat.id)) {
        errors.push(`network region ${label} stat ${statLabel} id must use an allowed aggregate stat id`);
      } else if (statIds.has(stat.id)) {
        errors.push(`network region ${label} stat ${statLabel} has a duplicate id`);
      } else {
        statIds.add(stat.id);
      }

      for (const field of ["code", "label"]) {
        if (isBlank(stat?.[field])) {
          errors.push(`network region ${label} stat ${statLabel} is missing ${field}`);
        }
      }

      if (!isBlank(stat?.code) && !NETWORK_ALLOWED_STAT_CODES.has(stat.code)) {
        errors.push(`network region ${label} stat ${statLabel} code must use an allowed aggregate code`);
      }

      if (locale === "en" && !isBlank(stat?.label) && !NETWORK_ALLOWED_STAT_LABELS.has(stat.label)) {
        errors.push(`network region ${label} stat ${statLabel} label must use an allowed aggregate category`);
      }

      const expectedStat = NETWORK_STAT_BY_ID.get(stat?.id);
      if (expectedStat && stat.code !== expectedStat.code) {
        errors.push(`network region ${label} stat ${statLabel} code must match the selected aggregate stat`);
      }

      if (locale === "en" && expectedStat && stat.label !== expectedStat.label) {
        errors.push(`network region ${label} stat ${statLabel} label must match the selected aggregate stat`);
      }

      if (!Number.isInteger(stat?.count) || stat.count < 0) {
        errors.push(`network region ${label} stat ${statLabel} count must be a non-negative integer`);
      }
    });
  });

  NETWORK_ALLOWED_REGION_IDS.forEach((regionId) => {
    if (!regionIds.has(regionId)) {
      errors.push(`network.regions is missing ${regionId}`);
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateNewsContent = (data) => {
  const errors = [];
  const news = data?.news;
  const categoryOptions = Array.isArray(news?.categoryOptions) ? news.categoryOptions : [];

  if (!news || !Array.isArray(news.items)) {
    errors.push("news.items must be an array");
  }

  if (!news || !Array.isArray(news.categoryOptions) || news.categoryOptions.length === 0) {
    errors.push("news.categoryOptions must contain at least one category");
  } else {
    const seenCategoryIds = new Set();

    categoryOptions.forEach((category, index) => {
      if (!isPlainObject(category)) {
        errors.push(`news.categoryOptions at index ${index} must be an object with id and label`);
        return;
      }

      if (isBlank(category.id)) {
        errors.push(`news.categoryOptions at index ${index} is missing id`);
      } else if (!FOCUS_ID_PATTERN.test(category.id)) {
        errors.push(`news.categoryOptions ${category.id} id must use lowercase kebab-case`);
      } else if (seenCategoryIds.has(category.id)) {
        errors.push(`news.categoryOptions contains duplicate category ${category.id}`);
      } else {
        seenCategoryIds.add(category.id);
      }

      if (isBlank(category.label)) {
        errors.push(`news.categoryOptions ${category.id ?? index} is missing label`);
      }

      if (DISABLED_NEWS_CATEGORIES.has(category.id)) {
        errors.push(`news.categoryOptions contains disabled category ${category.id}`);
      } else if (!EXPECTED_NEWS_CATEGORY_IDS.has(category.id)) {
        errors.push(`news.categoryOptions contains unsupported category ${category.id}`);
      }
    });

    EXPECTED_NEWS_CATEGORY_IDS.forEach((categoryId) => {
      if (!seenCategoryIds.has(categoryId)) {
        errors.push(`news.categoryOptions is missing ${categoryId}`);
      }
    });
  }

  const categories = new Set(categoryOptions.map((category) => category?.id));
  const ids = new Set();

  (news?.items ?? []).forEach((item, index) => {
    const label = item?.id ?? `index ${index}`;
    const isVisible = item?.visible !== false;

    if (item?.id === undefined || item?.id === null || item?.id === "") {
      errors.push(`news item at index ${index} is missing id`);
    } else if (ids.has(item.id)) {
      errors.push(`news item ${label} has a duplicate id`);
    } else {
      ids.add(item.id);
    }

    if (DISABLED_NEWS_CATEGORIES.has(item?.categoryId)) {
      errors.push(`news item ${label} uses disabled category ${item.categoryId}`);
    } else if (!categories.has(item?.categoryId)) {
      errors.push(`news item ${label} has invalid categoryId`);
    }

    if (item?.category !== undefined) {
      errors.push(`news item ${label} must use categoryId instead of legacy category`);
    }

    if (!isBlank(item?.publishedAt) && !isIsoDate(item.publishedAt)) {
      errors.push(`news item ${label} publishedAt must use YYYY-MM-DD`);
    }

    if (!isBlank(item?.sourceUrl) && !isHttpsUrl(item.sourceUrl)) {
      errors.push(`news item ${label} sourceUrl must start with https://`);
    }

    if (!isBlank(item?.image) && !isHttpsUrl(item.image)) {
      errors.push(`news item ${label} image must start with https://`);
    }

    if (item?.featured === true && item?.visible === false) {
      errors.push(`news item ${label} cannot be featured while hidden`);
    }

    if (isVisible) {
      for (const field of ["title", "summary", "categoryId", "publishedAt", "sourceUrl"]) {
        if (isBlank(item?.[field])) {
          errors.push(`visible news item ${label} is missing ${field}`);
        }
      }

      if (isBlank(item?.company) && isBlank(item?.source)) {
        errors.push(`visible news item ${label} needs company or source`);
      }
    }
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateLocaleConfig = (data) => {
  const errors = [];
  const config = data?.localeConfig;
  const supportedLocales = Array.isArray(config?.supportedLocales) ? config.supportedLocales : [];
  const localeIds = new Set();

  if (!isPlainObject(config)) {
    errors.push("localeConfig must be configured");
  }

  if (isBlank(config?.defaultLocale)) {
    errors.push("localeConfig.defaultLocale must be configured");
  }

  if (!Array.isArray(config?.supportedLocales) || config.supportedLocales.length === 0) {
    errors.push("localeConfig.supportedLocales must contain at least one locale");
  }

  supportedLocales.forEach((locale, index) => {
    if (!isPlainObject(locale)) {
      errors.push(`localeConfig.supportedLocales[${index}] must be an object`);
      return;
    }

    for (const field of ["id", "label", "nativeLabel", "htmlLang", "hrefLang"]) {
      if (isBlank(locale[field])) {
        errors.push(`localeConfig.supportedLocales[${index}] is missing ${field}`);
      }
    }

    if (!isBlank(locale.id) && !LOCALE_ID_PATTERN.test(locale.id)) {
      errors.push(`localeConfig.supportedLocales[${index}].id must use a BCP 47 language id`);
    } else if (!isBlank(locale.id) && localeIds.has(locale.id)) {
      errors.push(`localeConfig.supportedLocales contains duplicate locale ${locale.id}`);
    } else if (!isBlank(locale.id)) {
      localeIds.add(locale.id);
    }
  });

  if (!isBlank(config?.defaultLocale) && !localeIds.has(config.defaultLocale)) {
    errors.push("localeConfig.defaultLocale must be one of supportedLocales");
  }

  if (config?.countryLocaleMap !== undefined) {
    if (!isPlainObject(config.countryLocaleMap)) {
      errors.push("localeConfig.countryLocaleMap must be an object when configured");
    } else {
      Object.entries(config.countryLocaleMap).forEach(([countryCode, localeId]) => {
        if (!/^[A-Z]{2}$/.test(countryCode)) {
          errors.push(`localeConfig.countryLocaleMap key ${countryCode} must use ISO 3166-1 alpha-2 format`);
        }
        if (!localeIds.has(localeId)) {
          errors.push(`localeConfig.countryLocaleMap.${countryCode} must reference a supported locale`);
        }
      });
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateContentTreeShape = (locale, contentTree) => {
  const errors = [];

  if (!isPlainObject(contentTree)) {
    throw new Error(`locale ${locale} content tree must be an object`);
  }

  CONTENT_TREE_KEYS.forEach((key) => {
    if (contentTree[key] === undefined) {
      errors.push(`locale ${locale} missing ${key}`);
    }
  });

  for (const field of ["title", "description", "ogLocale", "canonicalPath"]) {
    if (isBlank(contentTree.metadata?.[field])) {
      errors.push(`locale ${locale} metadata is missing ${field}`);
    }
  }

  if (!isBlank(contentTree.metadata?.canonicalPath) && contentTree.metadata.canonicalPath !== `/${locale}`) {
    errors.push(`locale ${locale} metadata.canonicalPath must be /${locale}`);
  }

  REQUIRED_UI_KEYS.forEach((key) => {
    if (isBlank(contentTree.ui?.[key])) {
      errors.push(`locale ${locale} ui is missing ${key}`);
    }
  });

  if (!Array.isArray(contentTree.sections)) {
    errors.push(`locale ${locale} sections must be an array`);
  } else {
    const sectionIds = new Set();
    contentTree.sections.forEach((section, index) => {
      if (isBlank(section?.id)) {
        errors.push(`locale ${locale} sections[${index}] is missing id`);
      } else if (sectionIds.has(section.id)) {
        errors.push(`locale ${locale} sections contains duplicate id ${section.id}`);
      } else {
        sectionIds.add(section.id);
      }
    });

    REQUIRED_SECTION_IDS.forEach((sectionId) => {
      if (!sectionIds.has(sectionId)) {
        errors.push(`locale ${locale} sections missing required id ${sectionId}`);
      }
    });
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

const idsFrom = (items) => (Array.isArray(items) ? items.map((item) => item?.id) : []);
const valuesFrom = (items, selector) => (Array.isArray(items) ? items.map(selector) : []);

const compareStableIds = (errors, locale, label, defaultIds, localeIds) => {
  if (JSON.stringify(defaultIds) !== JSON.stringify(localeIds)) {
    errors.push(`locale ${locale} ${label} stable ids must match default locale`);
  }
};

export const validateLocaleStructuralParity = (data) => {
  validateLocaleConfig(data);

  const errors = [];
  const defaultLocale = data.localeConfig.defaultLocale;
  const defaultTree = data.contentByLocale?.[defaultLocale];

  if (!isPlainObject(data.contentByLocale)) {
    throw new Error("contentByLocale must be configured");
  }

  if (!isPlainObject(defaultTree)) {
    throw new Error(`contentByLocale.${defaultLocale} must be configured`);
  }

  data.localeConfig.supportedLocales.forEach((localeMeta) => {
    const locale = localeMeta.id;
    const contentTree = data.contentByLocale?.[locale];

    if (locale === defaultLocale || !isPlainObject(contentTree)) {
      return;
    }

    compareStableIds(errors, locale, "sections", idsFrom(defaultTree.sections), idsFrom(contentTree.sections));
    compareStableIds(
      errors,
      locale,
      "sections.hidden",
      valuesFrom(defaultTree.sections, (section) => section?.hidden === true),
      valuesFrom(contentTree.sections, (section) => section?.hidden === true)
    );
    compareStableIds(
      errors,
      locale,
      "focus.categories",
      idsFrom(defaultTree.focus?.categories),
      idsFrom(contentTree.focus?.categories)
    );
    compareStableIds(
      errors,
      locale,
      "focus.category.codes",
      valuesFrom(defaultTree.focus?.categories, (category) => category?.code),
      valuesFrom(contentTree.focus?.categories, (category) => category?.code)
    );
    compareStableIds(
      errors,
      locale,
      "news.categoryOptions",
      idsFrom(defaultTree.news?.categoryOptions),
      idsFrom(contentTree.news?.categoryOptions)
    );
    compareStableIds(
      errors,
      locale,
      "network.regions",
      idsFrom(defaultTree.network?.regions),
      idsFrom(contentTree.network?.regions)
    );

    (defaultTree.network?.regions ?? []).forEach((region) => {
      const localeRegion = contentTree.network?.regions?.find((item) => item?.id === region?.id);
      compareStableIds(
        errors,
        locale,
        `network.regions.${region?.id}.stats`,
        idsFrom(region?.stats),
        idsFrom(localeRegion?.stats)
      );
    });
    compareStableIds(errors, locale, "business.steps", idsFrom(defaultTree.business?.steps), idsFrom(contentTree.business?.steps));
    compareStableIds(errors, locale, "portfolio.items", idsFrom(defaultTree.portfolio?.items), idsFrom(contentTree.portfolio?.items));
  });

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }
};

export const validateLocalizedContentData = (data) => {
  validateLocaleConfig(data);

  const errors = [];
  const contentByLocale = data?.contentByLocale;
  const supportedLocaleIds = data.localeConfig.supportedLocales.map((locale) => locale.id);

  if (!isPlainObject(contentByLocale)) {
    errors.push("contentByLocale must be configured");
  } else {
    supportedLocaleIds.forEach((locale) => {
      if (!isPlainObject(contentByLocale[locale])) {
        errors.push(`contentByLocale.${locale} must be configured`);
      }
    });

    Object.keys(contentByLocale).forEach((locale) => {
      if (!supportedLocaleIds.includes(locale)) {
        errors.push(`contentByLocale.${locale} is not listed in localeConfig.supportedLocales`);
      }
    });
  }

  if (errors.length === 0) {
    supportedLocaleIds.forEach((locale) => {
      const contentTree = contentByLocale[locale];

      for (const validator of [
        () => validateContentTreeShape(locale, contentTree),
        () => validateAboutContent(contentTree),
        () => validateFocusContent(contentTree, { locale }),
        () => validateNetworkContent(contentTree, { locale }),
        () => validateNewsContent(contentTree),
      ]) {
        try {
          validator();
        } catch (error) {
          errors.push(`locale ${locale}: ${error.message}`);
        }
      }
    });

    try {
      validateLocaleStructuralParity(data);
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join("\n"));
  }

  return data;
};

export const validateContentData = (data) => {
  if (data?.localeConfig !== undefined || data?.contentByLocale !== undefined) {
    return validateLocalizedContentData(data);
  }

  validateAboutContent(data);
  validateFocusContent(data);
  validateNetworkContent(data);
  validateNewsContent(data);
  return data;
};

export const buildContentFile = (data) => {
  if (data?.localeConfig !== undefined || data?.contentByLocale !== undefined) {
    const sections = [
      "// AUTO-GENERATED from content.data.json. Do not edit directly.",
      "// Use the editor UI or run `npm run content:gen`.",
      "",
      `export const LOCALE_CONFIG = ${stringify(data.localeConfig)};`,
      "",
      "export const DEFAULT_LOCALE = LOCALE_CONFIG.defaultLocale;",
      "export const SUPPORTED_LOCALES = LOCALE_CONFIG.supportedLocales;",
      "export const COUNTRY_LOCALE_MAP = LOCALE_CONFIG.countryLocaleMap ?? {};",
      "",
      `export const CONTENT_BY_LOCALE = ${stringify(data.contentByLocale)};`,
      "",
      "const SUPPORTED_LOCALE_IDS = new Set(SUPPORTED_LOCALES.map((locale) => locale.id));",
      "",
      "const getRuntimeLocale = () => {",
      "  if (typeof window === \"undefined\") {",
      "    return DEFAULT_LOCALE;",
      "  }",
      "",
      "  const [pathLocale] = window.location.pathname.split(\"/\").filter(Boolean);",
      "  return SUPPORTED_LOCALE_IDS.has(pathLocale) ? pathLocale : DEFAULT_LOCALE;",
      "};",
      "",
      "export const ACTIVE_LOCALE = getRuntimeLocale();",
      "export const ACTIVE_LOCALE_META = SUPPORTED_LOCALES.find((locale) => locale.id === ACTIVE_LOCALE) ?? SUPPORTED_LOCALES[0];",
      "export const ACTIVE_CONTENT = CONTENT_BY_LOCALE[ACTIVE_LOCALE] ?? CONTENT_BY_LOCALE[DEFAULT_LOCALE];",
      "export const ACTIVE_METADATA = ACTIVE_CONTENT.metadata;",
      "export const METADATA = ACTIVE_METADATA;",
      "export const UI = ACTIVE_CONTENT.ui;",
      "",
      "export const BRAND = ACTIVE_CONTENT.brand;",
      "",
      "export const ICON_KEYS = ACTIVE_CONTENT.iconKeys;",
      "",
      "export const SECTIONS = ACTIVE_CONTENT.sections;",
      "",
      "export const HERO = ACTIVE_CONTENT.hero;",
      "",
      "export const MARQUEE = ACTIVE_CONTENT.marquee;",
      "",
      "export const ABOUT = ACTIVE_CONTENT.about;",
      "",
      "export const FOCUS = ACTIVE_CONTENT.focus;",
      "",
      "export const TEAM = ACTIVE_CONTENT.team;",
      "",
      "export const BUSINESS = ACTIVE_CONTENT.business;",
      "",
      "export const NETWORK = ACTIVE_CONTENT.network;",
      "",
      "export const PORTFOLIO = ACTIVE_CONTENT.portfolio;",
      "",
      "export const NEWS = ACTIVE_CONTENT.news;",
      "",
      "export const CONTACT = ACTIVE_CONTENT.contact;",
      "",
      "export const FOOTER = ACTIVE_CONTENT.footer;",
      "",
    ];

    return sections.join("\n");
  }

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
    `export const NEWS = ${stringify(data.news)};`,
    "",
    `export const CONTACT = ${stringify(data.contact)};`,
    "",
    `export const FOOTER = ${stringify(data.footer)};`,
    "",
  ];

  return sections.join("\n");
};

export const writeContentFile = (data, targetPath = outPath) => {
  validateContentData(data);
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
