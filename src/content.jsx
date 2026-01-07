// Content-only file for the site. Edit text in quotes to update the website.
// Keep commas, brackets, ids, and iconKey values to avoid breaking the layout.

export const BRAND = {
  // Brand mark shown in the top-left navigation.
  left: "DWD",
  dot: ".",
  right: "HC",
};

export const ICON_KEYS = [
  // Allowed values for iconKey fields.
  "Activity",
  "Dna",
  "Microscope",
  "Cpu",
  "TestTube",
  "Leaf",
  "Layers",
  "TrendingUp",
];

export const SECTIONS = [
  // Single source of truth for nav + section headers.
  // id must match the <section id="..."> in App.jsx.
  // Order controls navigation order and section numbering.
  { id: "about", navLabel: "About", number: "01", title: "Our Philosophy" },
  { id: "focus", navLabel: "Focus", number: "02", title: "Core Focus Areas" },
  { id: "team", navLabel: "Team", number: "03", title: "The Architects" },
  {
    id: "business",
    navLabel: "Business",
    number: "04",
    title: "Business Process",
    titleLines: ["Business", "Process"],
  },
  { id: "network", navLabel: "Network", number: "05", title: "Global Network" },
  { id: "portfolio", navLabel: "Portfolio", number: "06", title: "Portfolio" },
  { id: "contact", navLabel: "Contact", number: "07", title: "Contact" },
];

export const HERO = {
  // Each entry becomes its own line.
  titleLines: ["ARCHITECTS", "OF BIO", "ECOSYSTEM"],
  // Each entry becomes its own line.
  subtitleLines: [
    "Global Pharma/Bio Consulting & Investment Firm.",
    "We build solid foundations for radical innovation.",
  ],
  card: {
    // iconKey must exist in the ICONS map in App.jsx.
    iconKey: "Dna",
    lines: [
      { text: "STATUS: OPERATIONAL" },
      { text: "LOC: SEOUL / BOSTON" },
      { text: "TARGET: SERIES A-B" },
      { text: "/// SYSTEM_READY", accent: true },
    ],
  },
};

export const MARQUEE = {
  primary: "STRATEGY • INVESTMENT • ACCELERATION • GLOBAL GROWTH",
  secondary: "PARTNERSHIP • INNOVATION • SCALABILITY • TRUST",
};

export const ABOUT = {
  headlineLine: "We do not just invest.",
  headlineHighlight: "We architect the future of medicine.",
  missionTitle: "MISSION",
  missionText:
    "To bridge the gap between scientific discovery and commercial viability through rigorous analysis and strategic capital.",
  visionTitle: "VISION",
  visionText:
    "Becoming the most trusted partner for bio-healthcare innovators aiming for global standard excellence.",
};

export const FOCUS = {
  // iconKey must exist in the ICONS map in App.jsx.
  // code shows in the top-right; kor is the small subtitle line.
  areas: [
    {
      id: "F01",
      title: "Cell Therapy",
      kor: "세포치료제",
      desc: "Next-gen CAR-T & NK platforms targeting solid tumors.",
      code: "CT-204",
      iconKey: "Activity",
    },
    {
      id: "F02",
      title: "Gene Therapy",
      kor: "유전자치료제",
      desc: "AAV vector engineering and in-vivo CRISPR editing.",
      code: "GT-X9",
      iconKey: "Dna",
    },
    {
      id: "F03",
      title: "Organoids",
      kor: "오가노이드",
      desc: "High-fidelity 3D tissue models for drug screening.",
      code: "OG-3D",
      iconKey: "Microscope",
    },
    {
      id: "F04",
      title: "Medical AI",
      kor: "의료 AI",
      desc: "Deep learning for pathology & early diagnosis.",
      code: "AI-NET",
      iconKey: "Cpu",
    },
    {
      id: "F05",
      title: "Cultured Meat",
      kor: "배양육",
      desc: "Sustainable cellular agriculture & alternative proteins.",
      code: "CM-ALT",
      iconKey: "TestTube",
    },
    {
      id: "F06",
      title: "Microbiome",
      kor: "마이크로바이옴",
      desc: "Therapeutics targeting gut-brain axis & metabolic disorders.",
      code: "MB-01",
      iconKey: "Leaf",
    },
  ],
};

export const TEAM = {
  // id must be unique and stable; order controls display + animation timing.
  members: [
    {
      id: 1,
      name: "Dr. James Seo",
      role: "Managing Partner",
      bio: "Former VP at Global Pharma. Expert in Oncology.",
      tags: ["MD", "PhD", "Strategy"],
    },
    {
      id: 2,
      name: "Sarah Kim",
      role: "Investment Director",
      bio: "15+ years in Bio-Healthcare VC.",
      tags: ["M&A", "IPO", "Valuation"],
    },
    {
      id: 3,
      name: "Prof. David Lee",
      role: "Scientific Advisor",
      bio: "Professor of Immunology, Seoul Nat'l Univ.",
      tags: ["R&D", "Immunology"],
    },
    {
      id: 4,
      name: "Michael Park",
      role: "Global Operation",
      bio: "Specialist in Cross-border licensing.",
      tags: ["BD", "Global"],
    },
  ],
};

export const BUSINESS = {
  // iconKey must exist in the ICONS map in App.jsx.
  // id is the big background number on each card.
  steps: [
    {
      id: "01",
      title: "In-Depth Consulting",
      desc:
        "Scientific diligence meets market intelligence. We de-risk early-stage assets through rigorous analysis.",
      iconKey: "Dna",
    },
    {
      id: "02",
      title: "Strategic Acceleration",
      desc:
        "Hands-on company building. We bridge the gap between bench and bedside with operational support.",
      iconKey: "Layers",
    },
    {
      id: "03",
      title: "Global Investment",
      desc:
        "Smart capital injection. We fuel growth for promising biotech startups targeting global markets.",
      iconKey: "TrendingUp",
    },
  ],
};

export const NETWORK = {
  statusLabel: "SYSTEM ACTIVE",
  // Use {count} to print the number of nodes automatically.
  statusLines: ["CONNECTING_NODES: {count}", "DATA_FLOW: ENCRYPTED", "LATENCY: 12ms"],
  // x/y are percentages (0-100) within the canvas area.
  nodes: [
    { city: "Seoul", x: 80, y: 40 },
    { city: "Boston", x: 25, y: 35 },
    { city: "Basel", x: 52, y: 30 },
    { city: "Singapore", x: 75, y: 60 },
    { city: "San Francisco", x: 15, y: 45 },
    { city: "London", x: 48, y: 25 },
  ],
};

export const PORTFOLIO = {
  tableHeaders: {
    no: "No.",
    company: "Company",
    category: "Category",
    year: "Year",
    info: "Info",
  },
  investmentLabel: "Investment Rationale",
  milestonesLabel: "Key Milestones & Status",
  visitLabel: "Visit Website",
  // Use full image URLs (https://...).
  // id must be unique and stable; list order controls display numbering.
  // highlights are bullet points.
  items: [
    {
      id: 1,
      name: "OncoMatrix",
      category: "Therapeutics",
      year: "2024",
      image:
        "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1000",
      description:
        "Developing next-generation ADC platforms for solid tumors. Their proprietary linker technology significantly reduces off-target toxicity.",
      highlights: [
        "Series A Lead Investor",
        "FDA IND Cleared (Phase 1)",
        "Strategic Partnership with Big Pharma",
      ],
    },
    {
      id: 2,
      name: "NeuroGen",
      category: "Digital Health",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000",
      description:
        "AI-driven diagnostic platform for early detection of neurodegenerative diseases using non-invasive retinal imaging.",
      highlights: ["Seed to Series A Follow-on", "CE Mark Obtained", "Deployed in 50+ Hospitals"],
    },
    {
      id: 3,
      name: "BioSentry",
      category: "Diagnostics",
      year: "2023",
      image:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000",
      description:
        "Real-time pathogen detection system for critical care environments. Reduces sepsis diagnosis time from days to hours.",
      highlights: [
        "Series B Participant",
        "Awarded 'Innovation of the Year'",
        "Successful Pilot in Mayo Clinic",
      ],
    },
    {
      id: 4,
      name: "CellCore",
      category: "MedTech",
      year: "2022",
      image:
        "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000",
      description:
        "Automated cell culture manufacturing systems for CGT (Cell & Gene Therapy) mass production.",
      highlights: [
        "Series A Lead",
        "5 Patents Registered",
        "Global Distribution Deal Signed",
      ],
    },
  ],
};

export const CONTACT = {
  pretitle: "Let's build together",
  // Each entry becomes its own line.
  titleLines: ["GET IN", "TOUCH"],
  form: {
    namePlaceholder: "NAME",
    emailPlaceholder: "EMAIL",
    messagePlaceholder: "MESSAGE",
    submitLabel: "Send Message",
  },
  headquartersLabel: "HEADQUARTERS",
  headquartersAddressLines: ["Teheran-ro 152, Gangnam-gu", "Seoul, South Korea"],
  mapLinkLabel: "View on Map",
  contactLabel: "CONTACT",
  email: "hello@dwdhc.com",
};

export const FOOTER = {
  copyright: "© 2026 DWD HEALTHCARE. ALL RIGHTS RESERVED.",
  links: [
    { label: "LINKEDIN", href: "#" },
    { label: "TWITTER", href: "#" },
    { label: "PRIVACY POLICY", href: "#" },
  ],
};
