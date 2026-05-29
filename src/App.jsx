import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowRight, Plus, Minus, Dna, Users, MapPin, Menu, X, Layers, TrendingUp, ExternalLink, Microscope, Cpu, Leaf, TestTube, Activity, Phone, Mail, Languages } from 'lucide-react';
import {
  ACTIVE_LOCALE,
  ACTIVE_LOCALE_META,
  SUPPORTED_LOCALES,
  UI,
  SECTIONS,
  HERO,
  MARQUEE,
  ABOUT,
  FOCUS,
  TEAM,
  BUSINESS,
  NETWORK,
  PORTFOLIO,
  NEWS,
  CONTACT,
  FOOTER,
} from './content.jsx';
import { WorldMapImage } from './network/WorldMapImage.jsx';

const ICONS = {
  Activity,
  Dna,
  Microscope,
  Cpu,
  TestTube,
  Leaf,
  Layers,
  TrendingUp,
};

const SECTION_BY_ID = Object.fromEntries(SECTIONS.map((section) => [section.id, section]));
const isSectionVisible = (section) => section?.hidden !== true;
const VISIBLE_SECTIONS = SECTIONS.filter(isSectionVisible);
const EMPTY_FOCUS_CATEGORIES = [];
const DISABLED_NEWS_CATEGORIES = new Set(["market"]);

const formatTemplate = (template, values = {}) =>
  String(template ?? "").replace(/\{([a-zA-Z0-9_]+)\}/g, (match, key) =>
    values[key] === undefined ? match : String(values[key])
  );

const getLocaleHref = (localeId, hash = "") => `/${localeId}${hash || ""}`;

const renderIcon = (iconKey, className) => {
  const Icon = ICONS[iconKey];
  if (!Icon) return null;
  return <Icon className={className} />;
};

// --- COMPONENTS ---

const SectionHeader = ({ number, title, align = "left", compact = false }) => (
  <div className={`flex flex-col ${align === "right" ? "items-end text-right" : "items-start"} ${compact ? "mb-8 md:mb-12" : "mb-12 md:mb-24"} relative z-10`}>
    <span className="font-mono text-sm md:text-base text-blue-600 mb-2 tracking-widest">[ {number} ]</span>
    <h2 className={`${compact ? "text-4xl md:text-6xl 2xl:text-7xl" : "text-4xl md:text-7xl"} font-bold tracking-tighter uppercase text-slate-900 leading-[0.9]`}>
      {title}
    </h2>
  </div>
);

// Improved Custom Cursor with blending mode
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    const mouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    
    // Add hover listeners for interactive elements
    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.interactive')) {
        setIsHovering(true);
      }
    };
    const handleMouseOut = (e) => {
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('.interactive')) {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 border-2 border-blue-600 rounded-full pointer-events-none z-[60] hidden md:flex items-center justify-center mix-blend-exclusion"
      style={{ backgroundColor: "rgba(37, 99, 235, 0)" }}
      animate={{ 
        x: mousePosition.x - (isHovering ? 32 : 16), 
        y: mousePosition.y - (isHovering ? 32 : 16),
        width: isHovering ? 64 : 32,
        height: isHovering ? 64 : 32,
        backgroundColor: isHovering ? "rgba(37, 99, 235, 1)" : "rgba(37, 99, 235, 0)"
      }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      {!isHovering && <div className="w-1 h-1 bg-blue-600 rounded-full" />}
    </motion.div>
  );
};

// Infinite Marquee Component
const InfiniteMarquee = ({ text, speed = 20, direction = 1 }) => {
  return (
    <div className="relative flex overflow-hidden py-4 border-y border-slate-900 bg-slate-900 text-white">
      <motion.div
        className="flex whitespace-nowrap font-mono text-lg font-bold tracking-widest uppercase"
        animate={{ x: direction === 1 ? [0, -1000] : [-1000, 0] }}
        transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      >
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-8 flex items-center">
            {text} <span className="ml-8 text-blue-500">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

const formatNewsDate = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return new Intl.DateTimeFormat(ACTIVE_LOCALE_META?.htmlLang ?? ACTIVE_LOCALE, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
};

const getNewsMeta = (item) => [item.company, item.source].filter(Boolean).join(" / ");

const NewsSection = () => {
  const allCategoryId = "all";
  const [activeCategoryId, setActiveCategoryId] = useState(allCategoryId);
  const [failedImageUrls, setFailedImageUrls] = useState([]);
  const activeCategoryOptions = (NEWS.categoryOptions ?? []).filter(
    (category) => !DISABLED_NEWS_CATEGORIES.has(category.id)
  );
  const categoryById = new Map(activeCategoryOptions.map((category) => [category.id, category]));
  const visibleItems = NEWS.items.filter(
    (item) => item.visible !== false && !DISABLED_NEWS_CATEGORIES.has(item.categoryId)
  );
  const categories = [{ id: allCategoryId, label: NEWS.allFilterLabel }, ...activeCategoryOptions];
  const activeCategoryLabel =
    activeCategoryId === allCategoryId ? NEWS.allFilterLabel : categoryById.get(activeCategoryId)?.label ?? activeCategoryId;
  const filteredItems =
    activeCategoryId === allCategoryId
      ? visibleItems
      : visibleItems.filter((item) => item.categoryId === activeCategoryId);
  const featuredItem = filteredItems.find((item) => item.featured);
  const standardItems = featuredItem
    ? filteredItems.filter((item) => item.id !== featuredItem.id)
    : filteredItems;
  const markImageFailed = (src) => {
    setFailedImageUrls((current) => (current.includes(src) ? current : [...current, src]));
  };
  const hasUsableImage = (item) => Boolean(item.image) && !failedImageUrls.includes(item.image);
  const featuredHasImage = featuredItem && hasUsableImage(featuredItem);
  const resultSummary = formatTemplate(UI.newsResultSummary, {
    count: filteredItems.length,
    itemLabel: filteredItems.length === 1 ? UI.newsResultItemSingular : UI.newsResultItemPlural,
    category: activeCategoryLabel,
  });
  const emptyMessage = visibleItems.length === 0 ? NEWS.emptyState : NEWS.emptyFilterState;
  const getCategoryLabel = (categoryId) => categoryById.get(categoryId)?.label ?? categoryId;

  return (
    <section id="news" className="py-24 px-6 border-b border-slate-200 bg-white">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12">
          <div>
            <SectionHeader number={SECTION_BY_ID.news.number} title={SECTION_BY_ID.news.title} />
            <p className="font-mono text-sm uppercase tracking-widest text-blue-600">
              {NEWS.eyebrow}
            </p>
            <p className="max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
              {NEWS.intro}
            </p>
          </div>

          <div className="flex flex-wrap items-start gap-3 lg:justify-end" role="group" aria-label={UI.newsFilterAriaLabel}>
            {categories.map((category) => {
              const isActive = activeCategoryId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`interactive border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{resultSummary}</p>

        {filteredItems.length === 0 ? (
          <div className="mt-12 border-2 border-dashed border-slate-300 p-10 text-center font-mono text-sm uppercase tracking-widest text-slate-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="mt-12 space-y-8">
            {featuredItem && (
              <article className={`grid grid-cols-1 overflow-hidden border-2 border-slate-900 bg-slate-50 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${featuredHasImage ? "lg:grid-cols-2" : ""}`}>
                {featuredHasImage && (
                  <img
                    src={featuredItem.image}
                    alt={featuredItem.imageAlt ?? ""}
                    loading="lazy"
                    onError={() => markImageFailed(featuredItem.image)}
                    className="h-full min-h-[280px] w-full object-cover"
                  />
                )}
                <div className="min-w-0 p-8 md:p-10">
                  <div className="mb-6 flex min-w-0 flex-wrap items-center gap-3 break-words font-mono text-xs uppercase tracking-widest text-slate-400 [overflow-wrap:anywhere]">
                    <span className="bg-blue-600 px-3 py-1 text-white">{NEWS.featuredLabel}</span>
                    <span className="text-blue-600">{getCategoryLabel(featuredItem.categoryId)}</span>
                    <span className="text-slate-400">{formatNewsDate(featuredItem.publishedAt)}</span>
                  </div>
                  <h3 className="min-w-0 break-words text-3xl md:text-5xl font-black tracking-tighter text-slate-900 [overflow-wrap:anywhere]">
                    {featuredItem.title}
                  </h3>
                  {getNewsMeta(featuredItem) && (
                    <div className="mt-5 min-w-0 break-words font-mono text-xs uppercase tracking-widest text-slate-400 [overflow-wrap:anywhere]">
                      {getNewsMeta(featuredItem)}
                    </div>
                  )}
                  <p className="mt-6 min-w-0 break-words text-lg leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{featuredItem.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {(featuredItem.tags ?? []).map((tag) => (
                      <span key={tag} className="min-w-0 break-words border border-slate-300 px-2 py-1 font-mono text-xs text-slate-500 [overflow-wrap:anywhere]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  {featuredItem.sourceUrl && (
                    <a
                      href={featuredItem.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={formatTemplate(UI.readSourceAriaLabel, { title: featuredItem.title })}
                      className="interactive mt-8 inline-flex min-w-0 items-center gap-2 break-words border-b border-slate-900 pb-1 text-sm font-bold uppercase transition-colors hover:border-blue-600 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 [overflow-wrap:anywhere]"
                    >
                      <span>{NEWS.readMoreLabel}</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {standardItems.map((item) => (
                <article key={item.id} className="flex min-h-[320px] min-w-0 flex-col overflow-hidden border border-slate-300 bg-white transition-colors hover:border-blue-600">
                  {hasUsableImage(item) && (
                    <img
                      src={item.image}
                      alt={item.imageAlt ?? ""}
                      loading="lazy"
                      onError={() => markImageFailed(item.image)}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex min-w-0 items-center justify-between gap-4 break-words font-mono text-xs uppercase tracking-widest text-slate-400 [overflow-wrap:anywhere]">
                      <span className="text-blue-600">{getCategoryLabel(item.categoryId)}</span>
                      <time dateTime={item.publishedAt}>{formatNewsDate(item.publishedAt)}</time>
                    </div>
                    <h3 className="mt-6 min-w-0 break-words text-2xl font-black tracking-tighter text-slate-900 [overflow-wrap:anywhere]">
                      {item.title}
                    </h3>
                    <p className="mt-4 min-w-0 flex-1 break-words leading-relaxed text-slate-600 [overflow-wrap:anywhere]">{item.summary}</p>
                    {getNewsMeta(item) && (
                      <div className="mt-6 min-w-0 break-words font-mono text-xs uppercase tracking-widest text-slate-400 [overflow-wrap:anywhere]">
                        {getNewsMeta(item)}
                      </div>
                    )}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(item.tags ?? []).map((tag) => (
                        <span key={tag} className="min-w-0 break-words border border-slate-300 px-2 py-1 font-mono text-xs text-slate-500 [overflow-wrap:anywhere]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={formatTemplate(UI.readSourceAriaLabel, { title: item.title })}
                        className="interactive mt-6 inline-flex min-w-0 items-center gap-2 break-words text-sm font-bold uppercase text-slate-900 transition-colors hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-4 [overflow-wrap:anywhere]"
                      >
                        <span>{NEWS.readMoreLabel}</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const getNetworkRegionTotal = (region) =>
  (region?.stats ?? []).reduce((sum, stat) => sum + (Number(stat.count) || 0), 0);

const getNetworkTotal = (regions) =>
  (regions ?? []).reduce((sum, region) => sum + getNetworkRegionTotal(region), 0);

const AboutFootprintMap = () => {
  const footprint = ABOUT.footprint;

  if (!footprint || footprint.hidden === true) return null;

  const offices = footprint?.offices ?? [];
  const hqOffice = offices.find((office) => office.type === "hq");
  const branchOffices = offices.filter((office) => office.type === "branch");

  if (offices.length === 0 || !hqOffice) return null;

  return (
    <div data-testid="about-footprint" className="mt-14 overflow-hidden border-t-2 border-slate-900 pt-8 md:mt-16">
      <div className="mb-8 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-widest text-blue-600">{footprint.eyebrow}</p>
          <h3 className="mt-4 max-w-3xl break-words text-3xl font-black leading-tight tracking-tighter text-slate-900 md:text-5xl [overflow-wrap:anywhere]">
            {footprint.title}
          </h3>
        </div>
        <p className="max-w-4xl break-words text-base leading-relaxed text-slate-600 md:text-lg [overflow-wrap:anywhere]">
          {footprint.body}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <div className="relative min-h-[360px] overflow-hidden border-2 border-slate-900 bg-white shadow-[10px_10px_0px_0px_rgba(15,23,42,0.14)] md:min-h-[460px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:42px_42px]" />
          <div
            className="absolute left-[7%] top-[20%] h-[34%] w-[32%] border border-slate-300 bg-slate-100/80"
            style={{ clipPath: "polygon(8% 26%, 30% 0%, 80% 12%, 100% 42%, 75% 86%, 22% 100%, 0% 70%)" }}
          />
          <div
            className="absolute right-[6%] top-[16%] h-[55%] w-[46%] border border-slate-300 bg-slate-100/80"
            style={{ clipPath: "polygon(16% 18%, 42% 0%, 88% 12%, 100% 46%, 84% 78%, 56% 100%, 18% 82%, 0% 48%)" }}
          />

          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {branchOffices.map((office) => (
              <line
                key={`route-${office.id}`}
                x1={hqOffice.x}
                y1={hqOffice.y}
                x2={office.x}
                y2={office.y}
                vectorEffect="non-scaling-stroke"
                className="stroke-blue-600/70"
                strokeWidth="1.4"
                strokeDasharray="4 4"
              />
            ))}
          </svg>

          {offices.map((office) => {
            const isHq = office.type === "hq";

            return (
              <div
                key={office.id}
                data-testid={`about-office-marker-${office.id}`}
                className="absolute flex w-28 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 text-center"
                style={{
                  left: `clamp(64px, ${office.x}%, calc(100% - 64px))`,
                  top: `clamp(48px, ${office.y}%, calc(100% - 48px))`,
                }}
              >
                <span
                  className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 font-mono text-[11px] font-bold uppercase tracking-widest shadow-sm ${
                    isHq
                      ? "border-blue-600 bg-blue-600 text-white shadow-[0_0_0_8px_rgba(37,99,235,0.16)]"
                      : "border-blue-600 bg-white text-blue-600"
                  }`}
                  aria-hidden="true"
                >
                  {office.shortLabel}
                </span>
                <span className="max-w-full break-words border border-slate-300 bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-600 [overflow-wrap:anywhere]">
                  {office.label}
                </span>
              </div>
            );
          })}

          <div className="absolute inset-x-5 bottom-5 border-t border-slate-900 pt-4 font-mono text-xs uppercase tracking-widest text-slate-500">
            HQ / Branch Office Footprint
          </div>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4">
          {offices.map((office) => {
            const isHq = office.type === "hq";

            return (
              <article
                key={`office-card-${office.id}`}
                className={`min-w-0 border p-5 ${
                  isHq ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900"
                }`}
              >
                <div className={`font-mono text-xs uppercase tracking-widest ${isHq ? "text-blue-300" : "text-blue-600"}`}>
                  {office.shortLabel} / {office.type}
                </div>
                <h4 className="mt-4 break-words text-2xl font-black tracking-tight [overflow-wrap:anywhere]">
                  {office.label}
                </h4>
                <p className={`mt-3 break-words text-sm leading-relaxed [overflow-wrap:anywhere] ${isHq ? "text-slate-300" : "text-slate-600"}`}>
                  {office.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => {
  const leader = ABOUT.leader;
  const philosophy = ABOUT.philosophy;

  return (
    <section id="about" className="px-6 py-20 border-b border-slate-200 md:py-24">
      <div className="mx-auto max-w-[1920px]">
        <div className="grid grid-cols-1 gap-12 xl:grid-cols-[minmax(520px,0.66fr)_minmax(0,1.34fr)] xl:gap-16">
          <aside data-testid="about-leader-rail" className="min-w-0 space-y-6 xl:sticky xl:top-24 xl:self-start">
            <SectionHeader number={SECTION_BY_ID.about.number} title={SECTION_BY_ID.about.title} compact />

            <figure className="min-w-0 max-w-[420px] xl:max-w-[400px]">
              <div className="overflow-hidden bg-white">
                <img
                  data-testid="about-ceo-photo"
                  src={leader.photo}
                  alt={leader.photoAlt}
                  loading="lazy"
                  className="block h-auto w-full bg-white object-contain object-center"
                />
              </div>
              <figcaption className="mt-4 border-t border-slate-300 pt-4">
                <h3 className="break-words text-2xl font-black tracking-tighter text-slate-900 [overflow-wrap:anywhere]">
                  {leader.name}
                </h3>
                <p className="mt-1 break-words font-mono text-xs uppercase tracking-widest text-slate-500 [overflow-wrap:anywhere]">
                  {leader.role}
                </p>
              </figcaption>
            </figure>

            <div data-testid="about-profile" className="grid max-w-[620px] grid-cols-1 gap-6 border-t-2 border-slate-900 pt-5">
              <div>
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-slate-400">{UI.aboutProfileLabel}</p>
                <ul className="space-y-3">
                  {leader.bio.map((item, index) => (
                    <li key={`leader-bio-${index}`} className="flex min-w-0 gap-3 text-sm leading-relaxed text-slate-700 md:text-base">
                      <span className="mt-2 h-2 w-2 shrink-0 bg-blue-600" aria-hidden="true" />
                      <span className="min-w-0 break-words [overflow-wrap:anywhere]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </aside>

          <div data-testid="about-content-rail" className="min-w-0 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-5xl text-2xl font-light leading-tight md:text-4xl"
            >
              {ABOUT.headlineLine} <br />
              <span className="inline break-words bg-blue-600 px-2 py-1 font-bold text-white">
                {ABOUT.headlineHighlight}
              </span>
            </motion.div>

            <div className="grid min-w-0 gap-6 border-t-2 border-slate-900 pt-7 2xl:grid-cols-[minmax(0,0.94fr)_minmax(420px,0.76fr)] 2xl:items-start">
              <article className="min-w-0">
                <p className="font-mono text-xs uppercase tracking-widest text-blue-600">{leader.eyebrow}</p>
                <h3 className="mt-4 max-w-3xl break-words text-3xl font-black leading-tight tracking-tighter text-slate-900 md:text-4xl 2xl:text-[44px] [overflow-wrap:anywhere]">
                  {leader.greetingTitle}
                </h3>
                <div className="mt-6 max-w-3xl space-y-4 border-l-2 border-blue-600 pl-5">
                  {leader.greetingBody.map((paragraph, index) => (
                    <p key={`leader-greeting-${index}`} className="break-words text-base leading-relaxed text-slate-600 md:text-[17px] [overflow-wrap:anywhere]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>

              <aside data-testid="about-philosophy-panel" className="min-w-0 border-2 border-slate-900 bg-slate-900 p-6 text-white md:p-8">
                <p className="font-mono text-xs uppercase tracking-widest text-blue-400">{philosophy.eyebrow}</p>
                <h3 className="mt-4 max-w-3xl break-words text-2xl font-black leading-tight tracking-tighter md:text-3xl [overflow-wrap:anywhere]">
                  {philosophy.title}
                </h3>
                <p className="mt-5 max-w-3xl break-words text-sm leading-relaxed text-slate-300 md:text-base [overflow-wrap:anywhere]">
                  {philosophy.body}
                </p>
                <div className="mt-6 space-y-4">
                  {philosophy.principles.map((principle, index) => (
                    <article key={principle.title} className="grid min-w-0 grid-cols-[2.5rem_1fr] gap-4 border-t border-slate-700 pt-4">
                      <p className="font-mono text-xs text-blue-400">{String(index + 1).padStart(2, "0")}</p>
                      <div className="min-w-0">
                        <h4 className="break-words text-lg font-black tracking-tight [overflow-wrap:anywhere]">
                          {principle.title}
                        </h4>
                        <p className="mt-2 break-words text-sm leading-relaxed text-slate-300 [overflow-wrap:anywhere]">
                          {principle.text}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </div>

        <AboutFootprintMap />
      </div>
    </section>
  );
};

const GlobalNetworkMap = () => {
  const regions = NETWORK.regions ?? [];
  const [activeRegionId, setActiveRegionId] = useState(regions[0]?.id ?? null);
  const activeRegion = regions.find((region) => region.id === activeRegionId) ?? regions[0];
  const total = getNetworkTotal(regions);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
      <div
        data-testid="global-network-map"
        className="relative min-h-[460px] overflow-hidden border-2 border-slate-900 bg-white p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] md:min-h-[600px] md:p-6"
      >
        <div
          data-testid="network-map-coordinate-layer"
          className="relative mx-auto aspect-[1676/938] w-full max-w-full"
        >
          <WorldMapImage />
          <div
            data-testid="network-map-caption"
            className="absolute left-3 top-3 hidden font-mono text-[10px] uppercase tracking-widest text-slate-600 sm:block md:left-4 md:top-4"
          >
            {UI.networkApproxMapLabel}
          </div>

          {regions.map((region) => {
            const isActive = activeRegion?.id === region.id;
            const regionTotal = getNetworkRegionTotal(region);

            return (
              <button
                key={region.id}
                type="button"
                data-market-id={region.id}
                data-testid={`network-market-marker-${region.id}`}
                aria-pressed={isActive}
                aria-label={`${region.label}: ${regionTotal} ${UI.networkAggregateCountLabel}`}
                onClick={() => setActiveRegionId(region.id)}
                onFocus={() => setActiveRegionId(region.id)}
                onMouseEnter={() => setActiveRegionId(region.id)}
                title={`${region.label}: ${regionTotal} ${UI.networkAggregateCountLabel}`}
                className={`interactive absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-center font-mono text-[8px] uppercase leading-none tracking-widest shadow-sm transition-[background-color,border-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:h-12 md:w-12 md:text-[10px] ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white shadow-[0_0_0_6px_rgba(37,99,235,0.22)]"
                    : "border-slate-400 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600"
                }`}
                style={{
                  left: `clamp(22px, ${region.x}%, calc(100% - 22px))`,
                  top: `clamp(22px, ${region.y}%, calc(100% - 22px))`,
                }}
              >
                <span>
                  <span className="block font-bold">{region.shortLabel}</span>
                  <span className="mt-1 block text-[8px] opacity-70 md:text-[9px]">{regionTotal}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div
          data-testid="network-map-total"
          className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-slate-900 pt-4 font-mono uppercase tracking-widest"
        >
          <div className="text-xs text-slate-500">{NETWORK.hubLabel}</div>
          <div className="text-right">
            <div className="text-xs text-slate-500">{NETWORK.totalLabel}</div>
            <div className="text-4xl font-black tracking-tight text-slate-900">{total}</div>
          </div>
        </div>
      </div>

      {activeRegion && (
        <aside
          data-testid="network-selected-region"
          className="min-w-0 border-2 border-slate-900 bg-slate-900 p-6 text-white shadow-[10px_10px_0px_0px_rgba(37,99,235,1)]"
          aria-live="polite"
          aria-atomic="true"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-blue-300">{NETWORK.regionSummaryLabel}</p>
          <h3 className="mt-4 break-words text-4xl font-black uppercase tracking-tight [overflow-wrap:anywhere]">
            {activeRegion.label}
          </h3>
          <p className="mt-4 break-words text-sm leading-relaxed text-slate-300 [overflow-wrap:anywhere]">
            {activeRegion.summary}
          </p>
          <div className="mt-8 space-y-3">
            {(activeRegion.stats ?? []).map((stat) => (
              <div key={`${activeRegion.id}-${stat.id}`} className="flex min-w-0 items-center justify-between gap-4 border-t border-slate-700 pt-3">
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-widest text-blue-300">{stat.code}</div>
                  <div className="break-words text-sm font-semibold text-white [overflow-wrap:anywhere]">{stat.label}</div>
                </div>
                <div className="shrink-0 text-4xl font-black text-white">{stat.count}</div>
              </div>
            ))}
          </div>
        </aside>
      )}

      <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 xl:col-span-2 xl:grid-cols-4">
        {regions.map((region) => (
          <button
            key={`card-${region.id}`}
            type="button"
            aria-pressed={activeRegion?.id === region.id}
            onClick={() => setActiveRegionId(region.id)}
            className={`interactive min-w-0 border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              activeRegion?.id === region.id
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-300 bg-white text-slate-900 hover:border-blue-600"
            }`}
          >
            <div className="font-mono text-xs uppercase tracking-widest opacity-70">{region.shortLabel}</div>
            <div className="mt-3 break-words text-xl font-black uppercase tracking-tight [overflow-wrap:anywhere]">{region.label}</div>
            <div className="mt-4 font-mono text-sm">{getNetworkRegionTotal(region)} {UI.networkAggregateCategoriesLabel}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const LanguageSwitcher = ({ currentHash = "", compact = false, onNavigate }) => (
  <div
    role="group"
    className={`flex items-center gap-2 ${compact ? "flex-wrap justify-center" : "border-l border-slate-300 pl-6"}`}
    aria-label={UI.languageNavAriaLabel}
  >
    {!compact && <Languages size={16} className="text-slate-400" aria-hidden="true" />}
    {SUPPORTED_LOCALES.map((locale) => {
      const isActive = locale.id === ACTIVE_LOCALE;

      return (
        <a
          key={locale.id}
          href={getLocaleHref(locale.id, currentHash)}
          hrefLang={locale.hrefLang ?? locale.htmlLang}
          lang={locale.htmlLang}
          aria-current={isActive ? "page" : undefined}
          aria-label={formatTemplate(UI.switchLanguageLabel, { language: locale.label })}
          onClick={onNavigate}
          className={`interactive inline-flex min-h-9 items-center border px-3 font-mono text-xs uppercase tracking-widest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
            isActive
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-600 hover:border-blue-600 hover:text-blue-600"
          }`}
        >
          {compact ? locale.nativeLabel : locale.id}
        </a>
      );
    })}
  </div>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState(() =>
    typeof window === "undefined" ? "" : window.location.hash
  );
  const links = VISIBLE_SECTIONS;

  useEffect(() => {
    const syncHash = () => setCurrentHash(window.location.hash);

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1920px] mx-auto px-6 h-20 flex justify-between items-center">
        <a
          href="#"
          aria-label={UI.homeAriaLabel}
          className="interactive relative z-50 inline-flex items-center"
        >
          <img
            src="/images/logo/dwd-healthcare-executive-left-lockup-transparent.png"
            alt=""
            className="block h-11 w-auto max-w-[calc(100vw-96px)] object-contain md:h-14 md:max-w-[420px]"
          />
        </a>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-6">
            {links.map((link) => (
              <a key={link.id} href={`#${link.id}`} className="font-mono text-sm uppercase tracking-wider hover:text-blue-600 transition-colors interactive">
                {link.navLabel}
              </a>
            ))}
          </div>
          <LanguageSwitcher currentHash={currentHash} />
        </div>

        {/* Mobile Menu Toggle */}
        <button className="lg:hidden z-50 interactive" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full h-screen bg-slate-50 flex flex-col items-center justify-center space-y-8 lg:hidden"
            >
              {links.map((link) => (
                <a 
                  key={link.id} 
                  href={`#${link.id}`} 
                  onClick={() => setIsOpen(false)}
                  className="text-4xl font-bold tracking-tighter hover:text-blue-600 interactive"
                >
                  {link.navLabel}
                </a>
              ))}
              <LanguageSwitcher currentHash={currentHash} compact onNavigate={() => setIsOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const shouldReduceMotion = useReducedMotion();
  const [portfolioHoverImage, setPortfolioHoverImage] = useState(null);
  const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);
  const [activeFocusId, setActiveFocusId] = useState(() => FOCUS.categories?.[0]?.id ?? "");
  const businessTitleLines =
    SECTION_BY_ID.business.titleLines && SECTION_BY_ID.business.titleLines.length > 0
      ? SECTION_BY_ID.business.titleLines
      : [SECTION_BY_ID.business.title];
  const focusCategories = Array.isArray(FOCUS.categories) ? FOCUS.categories : EMPTY_FOCUS_CATEGORIES;
  const activeFocus =
    focusCategories.find((category) => category.id === activeFocusId) ?? focusCategories[0];

  useEffect(() => {
    const hashId = window.location.hash.replace("#", "");
    if (!hashId) return undefined;

    const scrollToHash = () => {
      document.getElementById(hashId)?.scrollIntoView({ block: "start" });
    };
    const animationFrame = requestAnimationFrame(scrollToHash);
    const timeout = window.setTimeout(scrollToHash, 250);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, []);

  const togglePortfolio = (id) => {
    setExpandedPortfolioId((currentId) => (currentId === id ? null : id));
  };

  const moveFocusTab = (index) => {
    const nextCategory = focusCategories[index];
    if (!nextCategory) return;
    setActiveFocusId(nextCategory.id);
    requestAnimationFrame(() => {
      document.getElementById(`focus-tab-${nextCategory.id}`)?.focus();
    });
  };

  const handleFocusTabKeyDown = (event, index) => {
    if (focusCategories.length === 0) return;

    let nextIndex = index;
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        nextIndex = (index + 1) % focusCategories.length;
        break;
      case "ArrowLeft":
      case "ArrowUp":
        nextIndex = (index - 1 + focusCategories.length) % focusCategories.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = focusCategories.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    moveFocusTab(nextIndex);
  };

  return (
    <div className="bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white cursor-none-override min-h-screen relative overflow-x-hidden font-sans">
      <CustomCursor />
      <Navigation />
      
      {/* Scroll Progress Bar */}
      <motion.div className="fixed top-20 left-0 right-0 h-1 bg-blue-600 origin-left z-50" style={{ scaleX }} />

      {/* NOISE TEXTURE OVERLAY - Adds "Concrete" feel */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.06] mix-blend-overlay"
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }} 
      />

      {/* Grid Background */}
      <div className="fixed inset-0 z-0 opacity-[0.04] pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>

      <main className="relative z-10 pt-20">
        
        {/* HERO SECTION */}
        <section className="min-h-screen flex flex-col justify-between px-6 py-12 md:p-24 border-b border-slate-200 relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
            <div className="col-span-1 md:col-span-8 flex flex-col justify-center">
              <motion.div 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-6xl md:text-[8vw] leading-[0.85] font-black tracking-tighter mb-8 mix-blend-darken">
                  {HERO.titleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < HERO.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-mono text-sm md:text-xl max-w-xl border-l-2 border-blue-600 pl-6 text-slate-600"
              >
                {HERO.subtitleLines.map((line, index) => (
                  <React.Fragment key={`${line}-${index}`}>
                    {line}
                    {index < HERO.subtitleLines.length - 1 && <br />}
                  </React.Fragment>
                ))}
              </motion.p>
            </div>
            <div className="col-span-1 md:col-span-4 flex items-end justify-end md:justify-start">
               <div className="w-full h-[300px] md:h-full border-2 border-slate-900 bg-slate-900 text-slate-50 p-6 flex flex-col justify-between hover:bg-slate-800 transition-colors duration-500 shadow-2xl">
                  {renderIcon(HERO.card.iconKey, "w-12 h-12 text-blue-500 animate-pulse")}
                  <div className="font-mono text-xs space-y-2 opacity-70">
                    {HERO.card.lines.map((line) => (
                      <p key={line.text} className={line.accent ? "text-blue-400" : undefined}>
                        {line.text}
                      </p>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0"
          >
            <ArrowRight className="rotate-90 w-8 h-8 text-blue-600" />
          </motion.div>
        </section>

        {/* INFINITE MARQUEE */}
        <InfiniteMarquee text={MARQUEE.primary} />

        {/* ABOUT US */}
        <AboutSection />

        {/* FOCUS AREAS */}
        <section id="focus" className="py-24 px-6 border-b border-slate-200 bg-slate-50">
          <div className="max-w-[1920px] mx-auto">
            <SectionHeader number={SECTION_BY_ID.focus.number} title={SECTION_BY_ID.focus.title} />

            {focusCategories.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 bg-white p-10 text-center font-mono text-sm uppercase tracking-widest text-slate-500">
                {UI.focusEmptyState}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                <div
                  role="tablist"
                  aria-label={UI.focusTablistAriaLabel}
                  className="flex gap-3 overflow-x-auto pb-2 lg:col-span-4 lg:flex-col lg:overflow-visible lg:pb-0"
                >
                  {focusCategories.map((category, index) => {
                    const isActive = activeFocus?.id === category.id;
                    return (
                      <button
                        key={category.id}
                        id={`focus-tab-${category.id}`}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`focus-panel-${category.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveFocusId(category.id)}
                        onKeyDown={(event) => handleFocusTabKeyDown(event, index)}
                        className={`interactive min-w-[260px] border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 lg:min-w-0 ${
                          isActive
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white text-slate-900 hover:border-blue-600 hover:text-blue-600"
                        }`}
                      >
                        <span className={`mb-6 block font-mono text-xs uppercase tracking-widest ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                          [{String(index + 1).padStart(2, "0")}] {category.code}
                        </span>
                        <span className="block min-w-0 break-words text-xl font-black uppercase tracking-tight [overflow-wrap:anywhere]">
                          {category.title}
                        </span>
                        <span className={`mt-3 block min-w-0 break-words text-sm leading-relaxed [overflow-wrap:anywhere] ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                          {category.summaryKo}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="min-w-0 lg:col-span-8">
                  {focusCategories.map((category) => {
                    const isActive = activeFocus?.id === category.id;
                    return (
                      <motion.div
                        key={category.id}
                        id={`focus-panel-${category.id}`}
                        role="tabpanel"
                        aria-labelledby={`focus-tab-${category.id}`}
                        hidden={!isActive}
                        tabIndex={isActive ? 0 : -1}
                        initial={false}
                        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                        className="min-w-0 border border-slate-300 bg-white p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,0.10)] md:p-10"
                      >
                        <div className="flex flex-col gap-8 border-b border-slate-200 pb-8 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-blue-600">
                              {category.code}
                            </p>
                            <h3 className="min-w-0 break-words text-3xl font-black uppercase tracking-tighter text-slate-900 md:text-5xl [overflow-wrap:anywhere]">
                              {category.title}
                            </h3>
                            <p className="mt-5 min-w-0 break-words text-xl font-bold leading-relaxed text-slate-600 md:text-2xl [overflow-wrap:anywhere]">
                              {category.summaryKo}
                            </p>
                          </div>
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                            {renderIcon(category.iconKey, "h-9 w-9")}
                          </div>
                        </div>

                        <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {category.subcategories.map((subcategory, index) => (
                            <li
                              key={`${category.id}-${subcategory}-${index}`}
                              className="flex min-h-[72px] min-w-0 items-center gap-4 border border-slate-200 bg-slate-50 px-5 py-4"
                            >
                              <span className="font-mono text-xs font-bold text-blue-600">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="min-w-0 break-words text-base font-semibold leading-snug text-slate-900 [overflow-wrap:anywhere]">
                                {subcategory}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TEAM */}
        {isSectionVisible(SECTION_BY_ID.team) ? (
          <section id="team" className="py-24 px-6 border-b border-slate-200 bg-slate-100">
            <div className="max-w-[1920px] mx-auto">
              <SectionHeader number={SECTION_BY_ID.team.number} title={SECTION_BY_ID.team.title} align="right" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1">
                {TEAM.members.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white h-[400px] border border-slate-200 overflow-hidden cursor-none interactive hover:border-blue-600 hover:border-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:z-10"
                  >
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <Users
                        className="w-24 h-24 text-slate-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform duration-500"
                        style={{ display: member.image ? 'none' : 'block' }}
                      />
                    </div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-900/90 to-transparent opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <h3 className="text-white text-xl font-bold">{member.name}</h3>
                      <p className="text-blue-400 font-mono text-sm mb-2">{member.role}</p>
                      <p className="text-slate-300 text-xs mb-4 line-clamp-2">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.tags.map(tag => (
                          <span key={tag} className="text-[10px] border border-white/30 text-white px-2 py-1 uppercase tracking-wider">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* BUSINESS MODEL (Refined Layout) */}
        <section id="business" className="py-24 px-6 bg-slate-900 text-slate-50 border-b border-slate-800">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-24 text-white">
                <span className="font-mono text-sm text-blue-500 mb-2 block tracking-widest">[ {SECTION_BY_ID.business.number} ]</span>
                <h2 className="text-4xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9]">
                  {businessTitleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < businessTitleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-slate-800">
              {BUSINESS.steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="group relative z-10 interactive p-12 border-b lg:border-b-0 lg:border-r border-slate-800 hover:bg-slate-800 transition-all duration-500"
                >
                  {/* Big Number Background */}
                  <div className="absolute right-4 top-4 text-[120px] font-black text-slate-800/50 leading-none pointer-events-none group-hover:text-blue-900/30 transition-colors">
                    {step.id}
                  </div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="mb-12">
                       <div className="w-16 h-16 bg-blue-600 text-white flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                         {renderIcon(step.iconKey, "w-10 h-10")}
                       </div>
                    </div>
                    
                    <div>
                      <h3 className="text-3xl font-bold mb-4 flex items-center tracking-tight">
                        {step.title}
                      </h3>
                      <div className="w-12 h-1 bg-blue-600 mb-6 group-hover:w-full transition-all duration-500 ease-out"></div>
                      <p className="text-slate-400 text-lg leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* SECOND MARQUEE */}
        <InfiniteMarquee text={MARQUEE.secondary} speed={25} direction={-1} />

        {/* NETWORK */}
        {isSectionVisible(SECTION_BY_ID.network) && (
          <section id="network" className="scroll-mt-20 py-24 px-6 border-b border-slate-200 bg-slate-50">
            <div className="max-w-[1920px] mx-auto">
              <div className="grid min-w-0 grid-cols-1 gap-12 xl:grid-cols-[0.8fr_1.2fr]">
                <div className="min-w-0">
                  <SectionHeader number={SECTION_BY_ID.network.number} title={SECTION_BY_ID.network.title} />
                  <p className="font-mono text-sm uppercase tracking-widest text-blue-600">
                    {NETWORK.eyebrow}
                  </p>
                  <p className="mt-4 max-w-xl break-words text-lg leading-relaxed text-slate-600 [overflow-wrap:anywhere] md:text-xl">
                    {NETWORK.intro}
                  </p>
                  <p className="mt-6 max-w-xl border-l-4 border-slate-900 pl-4 font-mono text-xs uppercase tracking-widest text-slate-500">
                    {NETWORK.privacyNote}
                  </p>
                </div>
                <div className="min-w-0">
                  <GlobalNetworkMap />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PORTFOLIO (Interactive Accordion) */}
        <section id="portfolio" className="py-24 px-6 border-b border-slate-200 relative overflow-hidden bg-slate-50">
           {/* Dynamic Background Image - Only show when hovering and NOT expanded */}
           <AnimatePresence mode="wait">
             {portfolioHoverImage && expandedPortfolioId === null && (
               <motion.div 
                 key={portfolioHoverImage}
                 initial={{ opacity: 0, scale: 1.1 }}
                 animate={{ opacity: 0.15, scale: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.4 }}
                 className="absolute inset-0 bg-cover bg-center z-0 pointer-events-none grayscale mix-blend-multiply"
                 style={{ backgroundImage: `url(${portfolioHoverImage})` }}
               />
             )}
           </AnimatePresence>

           <div className="max-w-[1920px] mx-auto relative z-10">
             <SectionHeader number={SECTION_BY_ID.portfolio.number} title={SECTION_BY_ID.portfolio.title} />
             
             <div className="mt-12">
               {/* Table Header */}
               <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b-4 border-slate-900 font-mono text-sm uppercase font-bold text-slate-500">
                 <div className="col-span-1">{PORTFOLIO.tableHeaders.no}</div>
                 <div className="col-span-4">{PORTFOLIO.tableHeaders.company}</div>
                 <div className="col-span-4">{PORTFOLIO.tableHeaders.category}</div>
                 <div className="col-span-2 text-right">{PORTFOLIO.tableHeaders.year}</div>
                 <div className="col-span-1 text-center">{PORTFOLIO.tableHeaders.info}</div>
               </div>

               {/* Portfolio List */}
               {PORTFOLIO.items.map((item, index) => {
                 const displayNo = String(index + 1).padStart(2, "0");
                 const isExpanded = expandedPortfolioId === item.id;
                 return (
                   <div key={item.id} className="border-b border-slate-300">
                     <motion.button
                       type="button"
                       aria-expanded={isExpanded}
                       aria-controls={`portfolio-panel-${item.id}`}
                       initial={{ backgroundColor: "rgba(255,255,255,0)" }}
                       animate={{ backgroundColor: isExpanded ? "rgb(15 23 42)" : "rgba(255,255,255,0)" }}
                       whileHover={{ backgroundColor: isExpanded ? "rgb(15 23 42)" : "rgba(37, 99, 235, 0.05)" }}
                       onClick={() => togglePortfolio(item.id)}
                       onMouseEnter={() => setPortfolioHoverImage(item.image)}
                       onMouseLeave={() => setPortfolioHoverImage(null)}
                       className={`grid w-full grid-cols-1 md:grid-cols-12 gap-4 py-8 md:py-10 items-center text-left transition-colors group cursor-pointer interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 ${isExpanded ? 'text-white' : ''}`}
                     >
                        <div className={`col-span-1 font-mono text-xs md:text-sm pl-2 md:pl-0 ${isExpanded ? 'text-blue-400' : 'text-blue-600'}`}>{displayNo}</div>
                        <div className={`col-span-4 text-3xl md:text-5xl font-black uppercase tracking-tighter transition-colors duration-300 ${isExpanded ? 'text-slate-50' : 'text-slate-900 group-hover:text-blue-600'}`}>
                          {item.name}
                        </div>
                        <div className={`col-span-4 font-mono text-sm md:text-lg flex items-center ${isExpanded ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className={`w-2 h-2 mr-2 rounded-full ${isExpanded ? 'bg-blue-500' : 'bg-slate-400 group-hover:bg-blue-600'}`}></span>
                          {item.category}
                        </div>
                        <div className={`col-span-2 text-right font-mono font-bold ${isExpanded ? 'text-slate-400' : 'text-slate-400 group-hover:text-slate-900'}`}>
                          {item.year}
                        </div>
                        <div className="col-span-1 flex justify-center">
                           {isExpanded ? <Minus className="text-blue-500" aria-hidden="true" /> : <Plus className="text-slate-400 group-hover:text-blue-600" aria-hidden="true" />}
                        </div>
                     </motion.button>

                     {/* Expandable Content */}
                     <AnimatePresence>
                       {isExpanded && (
                         <motion.div
                           id={`portfolio-panel-${item.id}`}
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           transition={{ duration: 0.4, ease: "easeInOut" }}
                           className="overflow-hidden bg-slate-900 text-slate-300"
                         >
                           <div className="p-8 md:p-12 border-t border-slate-800">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                               <div>
                                 <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">{PORTFOLIO.investmentLabel}</h4>
                                 <p className="text-lg md:text-xl text-white leading-relaxed font-light">
                                   {item.description}
                                 </p>
                                 
                                 <div className="mt-8">
                                   <button className="flex items-center space-x-2 text-sm font-bold uppercase hover:text-blue-500 transition-colors border-b border-transparent hover:border-blue-500 pb-1">
                                      <span>{PORTFOLIO.visitLabel}</span>
                                      <ExternalLink size={14} />
                                   </button>
                                 </div>
                               </div>
                               
                               <div className="space-y-6">
                                 <h4 className="font-mono text-blue-500 mb-4 text-sm tracking-widest uppercase">{PORTFOLIO.milestonesLabel}</h4>
                                 <ul className="space-y-4">
                                   {item.highlights.map((highlight, idx) => (
                                     <li key={idx} className="flex items-start">
                                       <ArrowRight className="min-w-[20px] w-5 h-5 mr-3 text-blue-600 mt-1" />
                                       <span className="text-lg">{highlight}</span>
                                     </li>
                                   ))}
                                 </ul>
                               </div>
                             </div>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 );
               })}
             </div>
           </div>
        </section>

        <NewsSection />

        {/* CONTACT */}
        <section id="contact" className="min-h-[80vh] flex flex-col justify-between py-24 px-6 bg-slate-900 text-slate-50">
           <div className="max-w-[1920px] mx-auto w-full">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
               <div>
                <span className="font-mono text-blue-500 block mb-4">{CONTACT.pretitle}</span>
                <h2 className="text-6xl md:text-[8rem] font-bold leading-none tracking-tighter mb-10">
                  {CONTACT.titleLines.map((line, index) => (
                    <React.Fragment key={`${line}-${index}`}>
                      {line}
                      {index < CONTACT.titleLines.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="max-w-xl text-lg md:text-xl leading-relaxed text-slate-300">
                  {CONTACT.contactNote}
                </p>
               </div>
               
               <div className="flex flex-col justify-end space-y-12 lg:items-end">
                  <address className="not-italic space-y-4 text-left lg:text-right">
                    <h3 className="font-mono text-slate-500">{CONTACT.headquartersLabel}</h3>
                    <p className="text-2xl font-bold break-words">
                      {CONTACT.headquartersAddressLines.map((line, index) => (
                        <React.Fragment key={`${line}-${index}`}>
                          {line}
                          {index < CONTACT.headquartersAddressLines.length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                    <a
                      href={CONTACT.mapHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-500 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 interactive"
                      aria-label={`${CONTACT.mapLinkLabel} - ${CONTACT.headquartersLabel}`}
                    >
                      <MapPin size={18} aria-hidden="true" />
                      <span>{CONTACT.mapLinkLabel}</span>
                    </a>
                  </address>
                  
                  <address className="not-italic space-y-5 text-left lg:text-right">
                    <h3 className="font-mono text-slate-500">{CONTACT.contactLabel}</h3>

                    <a
                      href={CONTACT.phoneHref}
                      aria-label={`${CONTACT.phoneLabel}: ${CONTACT.phone}`}
                      className="group flex w-full min-w-0 items-start gap-3 rounded-sm text-slate-50 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 lg:justify-end interactive"
                    >
                      <Phone className="mt-1 h-7 w-7 shrink-0 text-blue-500 md:h-10 md:w-10" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-mono text-sm text-slate-500">{CONTACT.phoneLabel}</span>
                        <span className="block break-words text-2xl font-bold sm:text-3xl md:text-5xl [overflow-wrap:anywhere]">{CONTACT.phone}</span>
                      </span>
                    </a>

                    <a
                      href={CONTACT.emailHref}
                      aria-label={`${CONTACT.emailLabel}: ${CONTACT.email}`}
                      className="group flex w-full min-w-0 items-start gap-3 rounded-sm text-slate-50 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 lg:justify-end interactive"
                    >
                      <Mail className="mt-1 h-6 w-6 shrink-0 text-blue-500 md:h-9 md:w-9" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block font-mono text-sm text-slate-500">{CONTACT.emailLabel}</span>
                        <span className="block break-words text-2xl font-bold underline decoration-2 underline-offset-8 md:text-4xl [overflow-wrap:anywhere]">{CONTACT.email}</span>
                      </span>
                    </a>
                  </address>
               </div>
             </div>
           </div>
           
           <footer className="mt-24 pt-8 border-t border-slate-800 flex flex-col gap-5 font-mono text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
             <p>{FOOTER.copyright}</p>
             <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
               <address className="not-italic flex flex-wrap justify-center gap-x-4 gap-y-2">
                 <a href={CONTACT.phoneHref} className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 interactive">
                   {CONTACT.phoneLabel} {CONTACT.phone}
                 </a>
                 <a href={CONTACT.emailHref} className="break-all hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 interactive">
                   {CONTACT.emailLabel} {CONTACT.email}
                 </a>
               </address>
               {FOOTER.links.length > 0 && (
                 <nav aria-label={UI.footerLinksAriaLabel} className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                   {FOOTER.links.map((link) => (
                     <a key={link.label} href={link.href} className="hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 interactive">{link.label}</a>
                   ))}
                 </nav>
               )}
             </div>
           </footer>
        </section>

      </main>
    </div>
  );
}
