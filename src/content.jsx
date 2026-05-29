// AUTO-GENERATED from content.data.json. Do not edit directly.
// Use the editor UI or run `npm run content:gen`.

export const LOCALE_CONFIG = {
  "defaultLocale": "en",
  "supportedLocales": [
    {
      "id": "en",
      "label": "English",
      "nativeLabel": "English",
      "htmlLang": "en",
      "hrefLang": "en"
    },
    {
      "id": "ko",
      "label": "Korean",
      "nativeLabel": "한국어",
      "htmlLang": "ko",
      "hrefLang": "ko"
    }
  ],
  "countryLocaleMap": {
    "KR": "ko"
  }
};

export const DEFAULT_LOCALE = LOCALE_CONFIG.defaultLocale;
export const SUPPORTED_LOCALES = LOCALE_CONFIG.supportedLocales;
export const COUNTRY_LOCALE_MAP = LOCALE_CONFIG.countryLocaleMap ?? {};

export const CONTENT_BY_LOCALE = {
  "en": {
    "brand": {
      "left": "DWD",
      "dot": "",
      "right": "HEALTHCARE"
    },
    "iconKeys": [
      "Activity",
      "Dna",
      "Microscope",
      "Cpu",
      "TestTube",
      "Leaf",
      "Layers",
      "TrendingUp"
    ],
    "sections": [
      {
        "id": "about",
        "navLabel": "About",
        "number": "01",
        "title": "Our Philosophy"
      },
      {
        "id": "focus",
        "navLabel": "Focus",
        "number": "02",
        "title": "Core Focus Areas"
      },
      {
        "id": "team",
        "navLabel": "Team",
        "number": "03",
        "title": "The Architects",
        "hidden": true
      },
      {
        "id": "business",
        "navLabel": "Business",
        "number": "04",
        "title": "Business Process",
        "titleLines": [
          "Business",
          "Process"
        ]
      },
      {
        "id": "network",
        "navLabel": "Network",
        "number": "05",
        "title": "Global Network",
        "hidden": false
      },
      {
        "id": "portfolio",
        "navLabel": "Portfolio",
        "number": "06",
        "title": "Portfolio"
      },
      {
        "id": "news",
        "navLabel": "News",
        "number": "07",
        "title": "Newsroom"
      },
      {
        "id": "contact",
        "navLabel": "Contact",
        "number": "08",
        "title": "Contact"
      }
    ],
    "hero": {
      "titleLines": [
        "ARCHITECTS",
        "OF BIO",
        "ECOSYSTEM"
      ],
      "subtitleLines": [
        "“Global growth doesn’t happen by accident. It’s engineered.”"
      ],
      "card": {
        "iconKey": "Dna",
        "lines": [
          {
            "text": "STATUS: OPERATIONAL"
          },
          {
            "text": "LOC: SEOUL / BOSTON"
          },
          {
            "text": "TARGET: SERIES A-B"
          },
          {
            "text": "/// SYSTEM_READY",
            "accent": true
          }
        ]
      }
    },
    "marquee": {
      "primary": "STRATEGY • INVESTMENT • ACCELERATION • GLOBAL GROWTH",
      "secondary": "PARTNERSHIP • INNOVATION • SCALABILITY • TRUST"
    },
    "about": {
      "headlineLine": "We do not just invest.",
      "headlineHighlight": "We architect the future of medicine.",
      "leader": {
        "eyebrow": "CEO MESSAGE",
        "name": "Joosik Choi",
        "role": "Chief Executive Officer",
        "photo": "/images/team/ceo-photo-v1.png",
        "photoAlt": "Sample CEO portrait",
        "greetingTitle": "Building a disciplined bridge between science, capital, and global healthcare markets.",
        "greetingBody": [
          "DWD Healthcare exists to help promising bio-healthcare innovation move beyond technical potential and become globally credible business value.",
          "We combine scientific review, strategic capital thinking, and market execution experience so founders, investors, and partners can make better decisions at each stage of growth.",
          "This message uses sample content until the official CEO greeting is provided."
        ],
        "bio": [
          "Sample biography item for global healthcare strategy leadership.",
          "Sample biography item for bio-pharmaceutical investment and commercialization.",
          "Sample biography item for cross-border business development and partnership execution.",
          "Sample biography item for advising growth-stage healthcare companies."
        ],
        "tags": [
          "Strategy",
          "Investment",
          "Global BD",
          "Healthcare"
        ]
      },
      "philosophy": {
        "eyebrow": "PHILOSOPHY",
        "title": "From scientific evidence to global healthcare value.",
        "body": "DWD Healthcare connects research-grade insight, strategic capital, and cross-border execution so bio-healthcare innovation can meet global standards.",
        "principles": [
          {
            "title": "Scientific Rigor",
            "text": "We start with disciplined review of evidence, unmet need, differentiation, and development risk."
          },
          {
            "title": "Commercial Translation",
            "text": "We convert technical potential into investment, partnership, and market-entry narratives that can be tested."
          },
          {
            "title": "Global Standard",
            "text": "We prepare companies for the expectations of global partners, regulators, customers, and capital markets."
          }
        ]
      },
      "footprint": {
        "hidden": true,
        "eyebrow": "GLOBAL OPERATING FOOTPRINT",
        "title": "Headquartered in South Korea, connected through Shanghai and Texas.",
        "body": "DWD Healthcare operates from South Korea with branch offices positioned for China and US healthcare market execution.",
        "offices": [
          {
            "id": "south-korea-hq",
            "type": "hq",
            "label": "South Korea",
            "shortLabel": "HQ",
            "description": "Headquarters",
            "x": 78,
            "y": 42
          },
          {
            "id": "shanghai-branch",
            "type": "branch",
            "label": "Shanghai",
            "shortLabel": "SH",
            "description": "China Branch Office",
            "x": 73,
            "y": 48
          },
          {
            "id": "texas-branch",
            "type": "branch",
            "label": "Texas",
            "shortLabel": "TX",
            "description": "US Branch Office",
            "x": 18,
            "y": 43
          }
        ]
      }
    },
    "focus": {
      "categories": [
        {
          "id": "pharmaceuticals-biotech",
          "code": "PB-01",
          "title": "Pharmaceuticals & Biotech",
          "summaryKo": "의약품·바이오신약·합성신약",
          "iconKey": "Dna",
          "subcategories": [
            "바이오의약품",
            "세포·유전자치료제",
            "ADC, 개량신약",
            "AI 신약개발"
          ]
        },
        {
          "id": "medical-devices-diagnostics",
          "code": "MD-02",
          "title": "Medical Devices & Diagnostics",
          "summaryKo": "의료기기·진단",
          "iconKey": "Activity",
          "subcategories": [
            "체외진단",
            "진단장비",
            "치료기기",
            "의료영상",
            "SaMD",
            "의료 AI 진단보조"
          ]
        },
        {
          "id": "digital-healthcare",
          "code": "DH-03",
          "title": "Digital Healthcare",
          "summaryKo": "디지털 헬스케어",
          "iconKey": "Cpu",
          "subcategories": [
            "디지털 치료제",
            "환자관리, 병원 솔루션",
            "의료데이터, 원격 모니터링",
            "헬스케어 플랫폼"
          ]
        },
        {
          "id": "consumer-health-wellness",
          "code": "CW-04",
          "title": "Consumer Health & Wellness",
          "summaryKo": "컨슈머헬스·웰니스",
          "iconKey": "Leaf",
          "subcategories": [
            "건강기능식품",
            "기능성 원료",
            "일반의약품",
            "이너뷰티",
            "약국·리테일 헬스케어 제품"
          ]
        }
      ]
    },
    "team": {
      "members": [
        {
          "id": 1,
          "name": "Joosik Choi",
          "role": "Managing Partner",
          "bio": "Former VP at Global Pharma. Expert in Oncology.",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "MD",
            "PhD",
            "Strategy"
          ]
        },
        {
          "id": 2,
          "name": "Kai Kim",
          "role": "Investment Director",
          "bio": "15+ years in Bio-Healthcare VC.",
          "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "M&A",
            "IPO",
            "Valuation"
          ]
        },
        {
          "id": 3,
          "name": "Martin Hyun",
          "role": "Scientific Advisor",
          "bio": "Professor of Immunology, Seoul Nat'l Univ.",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "R&D",
            "Immunology"
          ]
        },
        {
          "id": 4,
          "name": "Jinyeob Park",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 5,
          "name": "Yong Jeong",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 6,
          "name": "Jun Jang",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 7,
          "name": "Steve Kim",
          "role": "",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        }
      ]
    },
    "business": {
      "steps": [
        {
          "id": "01",
          "title": "Technology-Analytics",
          "desc": "Scientific diligence meets market intelligence. We de-risk early-stage assets through rigorous analysis.",
          "iconKey": "Microscope"
        },
        {
          "id": "02",
          "title": "Strategic Acceleration",
          "desc": "Hands-on company building. We bridge the gap between bench and bedside with operational support.",
          "iconKey": "Layers"
        },
        {
          "id": "03",
          "title": "Global Expansion",
          "desc": "Smart capital injection. We fuel growth for promising biotech startups targeting global markets.",
          "iconKey": "TrendingUp"
        }
      ]
    },
    "network": {
      "eyebrow": "AGGREGATED GLOBAL ACCESS",
      "intro": "Representative market coverage across US, EU, Japan, China, Asia-Pacific, MENA, and ROW, expressed only as aggregate category counts.",
      "privacyNote": "Representative network scale by market. Institution names are intentionally undisclosed.",
      "hubLabel": "GLOBAL NETWORK",
      "totalLabel": "Aggregate Category Count",
      "regionSummaryLabel": "Selected Market",
      "regions": [
        {
          "id": "us",
          "label": "US",
          "shortLabel": "US",
          "x": 18,
          "y": 42,
          "summary": "Representative aggregate coverage for the US market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 4
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 3
            },
            {
              "id": "enterprise-healthcare-channels",
              "code": "MNC",
              "label": "Enterprise Healthcare Channels",
              "count": 5
            }
          ]
        },
        {
          "id": "eu",
          "label": "EU",
          "shortLabel": "EU",
          "x": 45,
          "y": 32,
          "summary": "Representative aggregate coverage for the EU market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 4
            },
            {
              "id": "enterprise-healthcare-channels",
              "code": "MNC",
              "label": "Enterprise Healthcare Channels",
              "count": 4
            }
          ]
        },
        {
          "id": "japan",
          "label": "Japan",
          "shortLabel": "JP",
          "x": 91,
          "y": 38,
          "summary": "Representative aggregate coverage for the Japan market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 2
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 2
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 1
            }
          ]
        },
        {
          "id": "china",
          "label": "China",
          "shortLabel": "CN",
          "x": 74,
          "y": 40,
          "summary": "Representative aggregate coverage for the China market across approved healthcare access categories.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 2
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 2
            }
          ]
        },
        {
          "id": "asia-pacific",
          "label": "Asia-Pacific",
          "shortLabel": "APAC",
          "x": 82,
          "y": 84,
          "summary": "Representative aggregate coverage for Asia-Pacific markets excluding Japan and China.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 3
            }
          ]
        },
        {
          "id": "mena",
          "label": "MENA",
          "shortLabel": "MENA",
          "x": 46,
          "y": 68,
          "summary": "Representative aggregate coverage for Middle East and North Africa markets.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 3
            }
          ]
        },
        {
          "id": "row",
          "label": "ROW (Rest of World)",
          "shortLabel": "ROW",
          "x": 22,
          "y": 88,
          "summary": "Representative aggregate coverage for rest-of-world markets outside the named regions.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 4
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 3
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 4
            }
          ]
        }
      ]
    },
    "portfolio": {
      "tableHeaders": {
        "no": "No.",
        "company": "Company",
        "category": "Category",
        "year": "Year",
        "info": "Info"
      },
      "investmentLabel": "Overview",
      "milestonesLabel": "Key Milestones & Status",
      "visitLabel": "Visit Website",
      "items": [
        {
          "id": 1,
          "name": "OncoMatrix",
          "category": "Therapeutics",
          "year": "2024",
          "image": "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1000",
          "description": "Developing next-generation ADC platforms for solid tumors. Their proprietary linker technology significantly reduces off-target toxicity.",
          "highlights": [
            "Series A Lead Investor",
            "FDA IND Cleared (Phase 1)",
            "Strategic Partnership with Big Pharma"
          ]
        },
        {
          "id": 2,
          "name": "NeuroGen",
          "category": "Digital Health",
          "year": "2023",
          "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000",
          "description": "AI-driven diagnostic platform for early detection of neurodegenerative diseases using non-invasive retinal imaging.",
          "highlights": [
            "Seed to Series A Follow-on",
            "CE Mark Obtained",
            "Deployed in 50+ Hospitals"
          ]
        },
        {
          "id": 3,
          "name": "BioSentry",
          "category": "Diagnostics",
          "year": "2023",
          "image": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000",
          "description": "Real-time pathogen detection system for critical care environments. Reduces sepsis diagnosis time from days to hours.",
          "highlights": [
            "Series B Participant",
            "Awarded 'Innovation of the Year'",
            "Successful Pilot in Mayo Clinic"
          ]
        },
        {
          "id": 4,
          "name": "CellCore",
          "category": "MedTech",
          "year": "2022",
          "image": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000",
          "description": "Automated cell culture manufacturing systems for CGT (Cell & Gene Therapy) mass production.",
          "highlights": [
            "Series A Lead",
            "5 Patents Registered",
            "Global Distribution Deal Signed",
            "Series A Lead"
          ]
        }
      ]
    },
    "news": {
      "eyebrow": "CURATED UPDATES",
      "intro": "Selected updates from DWD Healthcare and portfolio companies across the bio-healthcare ecosystem.",
      "allFilterLabel": "All",
      "featuredLabel": "Featured",
      "readMoreLabel": "Read Source",
      "emptyState": "No published news items yet.",
      "emptyFilterState": "No news items in this category yet.",
      "categoryOptions": [
        {
          "id": "portfolio",
          "label": "Portfolio"
        },
        {
          "id": "dwd-healthcare",
          "label": "DWD Healthcare"
        }
      ],
      "items": [
        {
          "id": 1,
          "title": "NeuroXT and BIDMC Expand Collaboration to Advance AI-Driven Precision Treatment in Alzheimer's Disease",
          "summary": "BOSTON, May 26, 2026 /PRNewswire/ -- NeuroXT, a leading biotechnology company specializing in AI-driven neuroimaging biomarkers, today announced the successful completion of its initial collaborative research with Beth Israel Deaconess Medical Center (BIDMC), and the signing of a new agreement to further expand their research into the precision treatment of Alzheimer's disease.",
          "company": "NeuroXT",
          "source": "PR Newswire",
          "sourceUrl": "https://www.prnewswire.com/news-releases/neuroxt-and-bidmc-expand-collaboration-to-advance-ai-driven-precision-treatment-in-alzheimers-disease-302780888.html",
          "publishedAt": "2026-05-26",
          "image": "https://www.prnewswire.com/news-releases/neuroxt-and-bidmc-expand-collaboration-to-advance-ai-driven-precision-treatment-in-alzheimers-disease-302780888.html#",
          "imageAlt": "",
          "tags": [
            "MRI기반AI",
            "PET바이오마커"
          ],
          "featured": true,
          "visible": true,
          "categoryId": "portfolio"
        },
        {
          "id": 2,
          "title": "엑소퍼트 \"엑소좀으로 암 조기진단, 美 FDA 기기 등록 완료\"",
          "summary": "엑소퍼트는 엑소좀 기반 다중암 조기진단 플랫폼을 개발하고 있다. 한 번의 혈액 검사만으로 여러 암의 발병 여부를 한꺼번에 진단할 수 있는 기술을 보유했다.\n\n혈액 속 엑소좀을 분리한 뒤 엑소좀 고유의 라만 신호(분자지문)를 검출해 인공지능(AI) 기반 엑소좀 신호를 포괄적으로 분석하는 방식으로 진단 속도를 높이고 있다.\n\n폐암, 대장암, 위암, 간암, 췌장암, 유방암 등 6개 암종에 대해선 민감도 90.2%와 특이도 94.4%의 정확도를 확인해 국제학술지 네이처커뮤니케이션에 공개했다.",
          "company": "ExoPERT",
          "source": "한경 바이오 인사이트",
          "sourceUrl": "https://www.hankyung.com/article/202602281221i",
          "publishedAt": "2026-02-28",
          "image": "",
          "imageAlt": "",
          "tags": [],
          "featured": false,
          "visible": true,
          "categoryId": "portfolio"
        }
      ]
    },
    "contact": {
      "pretitle": "-",
      "titleLines": [
        "GET IN TOUCH"
      ],
      "contactNote": "사업 제휴 및 투자 문의는 대표 연락처로 접수해 주세요.",
      "headquartersLabel": "HEADQUARTERS",
      "headquartersAddressLines": [
        "Teheran-ro 152, Gangnam-gu",
        "Seoul, South Korea"
      ],
      "mapLinkLabel": "View on Map",
      "mapHref": "https://maps.google.com/?q=Teheran-ro%20152%2C%20Gangnam-gu%2C%20Seoul%2C%20South%20Korea",
      "contactLabel": "CONTACT",
      "phoneLabel": "대표전화",
      "phone": "+82-2-1234-5678",
      "phoneHref": "tel:+82212345678",
      "emailLabel": "대표이메일",
      "email": "sample@example.com",
      "emailHref": "mailto:sample@example.com"
    },
    "footer": {
      "copyright": "© 2026 DWD HEALTHCARE. ALL RIGHTS RESERVED.",
      "links": []
    },
    "metadata": {
      "title": "DWD Healthcare",
      "description": "DWD Healthcare connects scientific review, strategic capital, and global healthcare market execution.",
      "ogLocale": "en_US",
      "canonicalPath": "/en"
    },
    "ui": {
      "homeAriaLabel": "DWD Healthcare home",
      "languageNavAriaLabel": "Language",
      "switchLanguageLabel": "Switch to {language}",
      "newsFilterAriaLabel": "News category filters",
      "newsResultSummary": "{count} news {itemLabel} shown for {category}",
      "newsResultItemSingular": "item",
      "newsResultItemPlural": "items",
      "readSourceAriaLabel": "Read source: {title} (opens in new tab)",
      "networkAggregateCountLabel": "aggregate category count",
      "networkAggregateCategoriesLabel": "aggregate categories",
      "networkApproxMapLabel": "Approx. market map",
      "aboutProfileLabel": "Profile",
      "focusEmptyState": "Focus categories are being prepared.",
      "focusTablistAriaLabel": "Core focus categories",
      "footerLinksAriaLabel": "Footer links"
    }
  },
  "ko": {
    "brand": {
      "left": "DWD",
      "dot": "",
      "right": "HEALTHCARE"
    },
    "iconKeys": [
      "Activity",
      "Dna",
      "Microscope",
      "Cpu",
      "TestTube",
      "Leaf",
      "Layers",
      "TrendingUp"
    ],
    "sections": [
      {
        "id": "about",
        "navLabel": "소개",
        "number": "01",
        "title": "철학"
      },
      {
        "id": "focus",
        "navLabel": "분야",
        "number": "02",
        "title": "핵심 집중 분야"
      },
      {
        "id": "team",
        "navLabel": "팀",
        "number": "03",
        "title": "구성원",
        "hidden": true
      },
      {
        "id": "business",
        "navLabel": "사업",
        "number": "04",
        "title": "사업 프로세스",
        "titleLines": [
          "사업",
          "프로세스"
        ]
      },
      {
        "id": "network",
        "navLabel": "네트워크",
        "number": "05",
        "title": "글로벌 네트워크",
        "hidden": false
      },
      {
        "id": "portfolio",
        "navLabel": "포트폴리오",
        "number": "06",
        "title": "포트폴리오"
      },
      {
        "id": "news",
        "navLabel": "뉴스",
        "number": "07",
        "title": "뉴스룸"
      },
      {
        "id": "contact",
        "navLabel": "문의",
        "number": "08",
        "title": "문의"
      }
    ],
    "hero": {
      "titleLines": [
        "ARCHITECTS",
        "OF BIO",
        "ECOSYSTEM"
      ],
      "subtitleLines": [
        "“Global growth doesn’t happen by accident. It’s engineered.”"
      ],
      "card": {
        "iconKey": "Dna",
        "lines": [
          {
            "text": "STATUS: OPERATIONAL"
          },
          {
            "text": "LOC: SEOUL / BOSTON"
          },
          {
            "text": "TARGET: SERIES A-B"
          },
          {
            "text": "/// SYSTEM_READY",
            "accent": true
          }
        ]
      }
    },
    "marquee": {
      "primary": "STRATEGY • INVESTMENT • ACCELERATION • GLOBAL GROWTH",
      "secondary": "PARTNERSHIP • INNOVATION • SCALABILITY • TRUST"
    },
    "about": {
      "headlineLine": "We do not just invest.",
      "headlineHighlight": "We architect the future of medicine.",
      "leader": {
        "eyebrow": "CEO MESSAGE",
        "name": "Joosik Choi",
        "role": "Chief Executive Officer",
        "photo": "/images/team/ceo-photo-v1.png",
        "photoAlt": "Sample CEO portrait",
        "greetingTitle": "Building a disciplined bridge between science, capital, and global healthcare markets.",
        "greetingBody": [
          "DWD Healthcare exists to help promising bio-healthcare innovation move beyond technical potential and become globally credible business value.",
          "We combine scientific review, strategic capital thinking, and market execution experience so founders, investors, and partners can make better decisions at each stage of growth.",
          "This message uses sample content until the official CEO greeting is provided."
        ],
        "bio": [
          "Sample biography item for global healthcare strategy leadership.",
          "Sample biography item for bio-pharmaceutical investment and commercialization.",
          "Sample biography item for cross-border business development and partnership execution.",
          "Sample biography item for advising growth-stage healthcare companies."
        ],
        "tags": [
          "Strategy",
          "Investment",
          "Global BD",
          "Healthcare"
        ]
      },
      "philosophy": {
        "eyebrow": "PHILOSOPHY",
        "title": "From scientific evidence to global healthcare value.",
        "body": "DWD Healthcare connects research-grade insight, strategic capital, and cross-border execution so bio-healthcare innovation can meet global standards.",
        "principles": [
          {
            "title": "Scientific Rigor",
            "text": "We start with disciplined review of evidence, unmet need, differentiation, and development risk."
          },
          {
            "title": "Commercial Translation",
            "text": "We convert technical potential into investment, partnership, and market-entry narratives that can be tested."
          },
          {
            "title": "Global Standard",
            "text": "We prepare companies for the expectations of global partners, regulators, customers, and capital markets."
          }
        ]
      },
      "footprint": {
        "hidden": true,
        "eyebrow": "GLOBAL OPERATING FOOTPRINT",
        "title": "Headquartered in South Korea, connected through Shanghai and Texas.",
        "body": "DWD Healthcare operates from South Korea with branch offices positioned for China and US healthcare market execution.",
        "offices": [
          {
            "id": "south-korea-hq",
            "type": "hq",
            "label": "South Korea",
            "shortLabel": "HQ",
            "description": "Headquarters",
            "x": 78,
            "y": 42
          },
          {
            "id": "shanghai-branch",
            "type": "branch",
            "label": "Shanghai",
            "shortLabel": "SH",
            "description": "China Branch Office",
            "x": 73,
            "y": 48
          },
          {
            "id": "texas-branch",
            "type": "branch",
            "label": "Texas",
            "shortLabel": "TX",
            "description": "US Branch Office",
            "x": 18,
            "y": 43
          }
        ]
      }
    },
    "focus": {
      "categories": [
        {
          "id": "pharmaceuticals-biotech",
          "code": "PB-01",
          "title": "의약품 및 바이오",
          "summaryKo": "의약품·바이오신약·합성신약",
          "iconKey": "Dna",
          "subcategories": [
            "바이오의약품",
            "세포·유전자치료제",
            "ADC, 개량신약",
            "AI 신약개발"
          ]
        },
        {
          "id": "medical-devices-diagnostics",
          "code": "MD-02",
          "title": "의료기기 및 진단",
          "summaryKo": "의료기기·진단",
          "iconKey": "Activity",
          "subcategories": [
            "체외진단",
            "진단장비",
            "치료기기",
            "의료영상",
            "SaMD",
            "의료 AI 진단보조"
          ]
        },
        {
          "id": "digital-healthcare",
          "code": "DH-03",
          "title": "디지털 헬스케어",
          "summaryKo": "디지털 헬스케어",
          "iconKey": "Cpu",
          "subcategories": [
            "디지털 치료제",
            "환자관리, 병원 솔루션",
            "의료데이터, 원격 모니터링",
            "헬스케어 플랫폼"
          ]
        },
        {
          "id": "consumer-health-wellness",
          "code": "CW-04",
          "title": "컨슈머 헬스 및 웰니스",
          "summaryKo": "컨슈머헬스·웰니스",
          "iconKey": "Leaf",
          "subcategories": [
            "건강기능식품",
            "기능성 원료",
            "일반의약품",
            "이너뷰티",
            "약국·리테일 헬스케어 제품"
          ]
        }
      ]
    },
    "team": {
      "members": [
        {
          "id": 1,
          "name": "Joosik Choi",
          "role": "Managing Partner",
          "bio": "Former VP at Global Pharma. Expert in Oncology.",
          "image": "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "MD",
            "PhD",
            "Strategy"
          ]
        },
        {
          "id": 2,
          "name": "Kai Kim",
          "role": "Investment Director",
          "bio": "15+ years in Bio-Healthcare VC.",
          "image": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "M&A",
            "IPO",
            "Valuation"
          ]
        },
        {
          "id": 3,
          "name": "Martin Hyun",
          "role": "Scientific Advisor",
          "bio": "Professor of Immunology, Seoul Nat'l Univ.",
          "image": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "R&D",
            "Immunology"
          ]
        },
        {
          "id": 4,
          "name": "Jinyeob Park",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 5,
          "name": "Yong Jeong",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 6,
          "name": "Jun Jang",
          "role": "Global Operation",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        },
        {
          "id": 7,
          "name": "Steve Kim",
          "role": "",
          "bio": "Specialist in Cross-border licensing.",
          "image": "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&q=80&w=800",
          "tags": [
            "BD",
            "Global"
          ]
        }
      ]
    },
    "business": {
      "steps": [
        {
          "id": "01",
          "title": "Technology-Analytics",
          "desc": "Scientific diligence meets market intelligence. We de-risk early-stage assets through rigorous analysis.",
          "iconKey": "Microscope"
        },
        {
          "id": "02",
          "title": "Strategic Acceleration",
          "desc": "Hands-on company building. We bridge the gap between bench and bedside with operational support.",
          "iconKey": "Layers"
        },
        {
          "id": "03",
          "title": "Global Expansion",
          "desc": "Smart capital injection. We fuel growth for promising biotech startups targeting global markets.",
          "iconKey": "TrendingUp"
        }
      ]
    },
    "network": {
      "eyebrow": "AGGREGATED GLOBAL ACCESS",
      "intro": "Representative market coverage across US, EU, Japan, China, Asia-Pacific, MENA, and ROW, expressed only as aggregate category counts.",
      "privacyNote": "Representative network scale by market. Institution names are intentionally undisclosed.",
      "hubLabel": "GLOBAL NETWORK",
      "totalLabel": "Aggregate Category Count",
      "regionSummaryLabel": "Selected Market",
      "regions": [
        {
          "id": "us",
          "label": "US",
          "shortLabel": "US",
          "x": 18,
          "y": 42,
          "summary": "Representative aggregate coverage for the US market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 4
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 3
            },
            {
              "id": "enterprise-healthcare-channels",
              "code": "MNC",
              "label": "Enterprise Healthcare Channels",
              "count": 5
            }
          ]
        },
        {
          "id": "eu",
          "label": "EU",
          "shortLabel": "EU",
          "x": 45,
          "y": 32,
          "summary": "Representative aggregate coverage for the EU market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 4
            },
            {
              "id": "enterprise-healthcare-channels",
              "code": "MNC",
              "label": "Enterprise Healthcare Channels",
              "count": 4
            }
          ]
        },
        {
          "id": "japan",
          "label": "Japan",
          "shortLabel": "JP",
          "x": 91,
          "y": 38,
          "summary": "Representative aggregate coverage for the Japan market across approved healthcare access categories.",
          "stats": [
            {
              "id": "major-medical-centers",
              "code": "MED",
              "label": "Major Medical Centers",
              "count": 2
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 2
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 1
            }
          ]
        },
        {
          "id": "china",
          "label": "China",
          "shortLabel": "CN",
          "x": 74,
          "y": 40,
          "summary": "Representative aggregate coverage for the China market across approved healthcare access categories.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 2
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 2
            }
          ]
        },
        {
          "id": "asia-pacific",
          "label": "Asia-Pacific",
          "shortLabel": "APAC",
          "x": 82,
          "y": 84,
          "summary": "Representative aggregate coverage for Asia-Pacific markets excluding Japan and China.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 3
            }
          ]
        },
        {
          "id": "mena",
          "label": "MENA",
          "shortLabel": "MENA",
          "x": 46,
          "y": 68,
          "summary": "Representative aggregate coverage for Middle East and North Africa markets.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 3
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 1
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 3
            }
          ]
        },
        {
          "id": "row",
          "label": "ROW (Rest of World)",
          "shortLabel": "ROW",
          "x": 22,
          "y": 88,
          "summary": "Representative aggregate coverage for rest-of-world markets outside the named regions.",
          "stats": [
            {
              "id": "clinical-networks",
              "code": "CLN",
              "label": "Clinical Networks",
              "count": 4
            },
            {
              "id": "research-organizations",
              "code": "R&D",
              "label": "Research Organizations",
              "count": 3
            },
            {
              "id": "business-development-channels",
              "code": "BD",
              "label": "Business Development Channels",
              "count": 4
            }
          ]
        }
      ]
    },
    "portfolio": {
      "tableHeaders": {
        "no": "번호",
        "company": "기업",
        "category": "분야",
        "year": "연도",
        "info": "정보"
      },
      "investmentLabel": "투자 논리",
      "milestonesLabel": "주요 이정표",
      "visitLabel": "웹사이트 보기",
      "items": [
        {
          "id": 1,
          "name": "OncoMatrix",
          "category": "Therapeutics",
          "year": "2024",
          "image": "https://images.unsplash.com/photo-1579165466741-7f35a4755657?auto=format&fit=crop&q=80&w=1000",
          "description": "Developing next-generation ADC platforms for solid tumors. Their proprietary linker technology significantly reduces off-target toxicity.",
          "highlights": [
            "Series A Lead Investor",
            "FDA IND Cleared (Phase 1)",
            "Strategic Partnership with Big Pharma"
          ]
        },
        {
          "id": 2,
          "name": "NeuroGen",
          "category": "Digital Health",
          "year": "2023",
          "image": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=1000",
          "description": "AI-driven diagnostic platform for early detection of neurodegenerative diseases using non-invasive retinal imaging.",
          "highlights": [
            "Seed to Series A Follow-on",
            "CE Mark Obtained",
            "Deployed in 50+ Hospitals"
          ]
        },
        {
          "id": 3,
          "name": "BioSentry",
          "category": "Diagnostics",
          "year": "2023",
          "image": "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=1000",
          "description": "Real-time pathogen detection system for critical care environments. Reduces sepsis diagnosis time from days to hours.",
          "highlights": [
            "Series B Participant",
            "Awarded 'Innovation of the Year'",
            "Successful Pilot in Mayo Clinic"
          ]
        },
        {
          "id": 4,
          "name": "CellCore",
          "category": "MedTech",
          "year": "2022",
          "image": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=1000",
          "description": "Automated cell culture manufacturing systems for CGT (Cell & Gene Therapy) mass production.",
          "highlights": [
            "Series A Lead",
            "5 Patents Registered",
            "Global Distribution Deal Signed",
            "Series A Lead"
          ]
        }
      ]
    },
    "news": {
      "eyebrow": "CURATED UPDATES",
      "intro": "DWD Healthcare와 포트폴리오 관련 주요 소식을 모아 제공합니다.",
      "allFilterLabel": "전체",
      "featuredLabel": "주요 소식",
      "readMoreLabel": "원문 보기",
      "emptyState": "게시된 뉴스가 없습니다.",
      "emptyFilterState": "선택한 카테고리의 뉴스가 없습니다.",
      "categoryOptions": [
        {
          "id": "portfolio",
          "label": "포트폴리오"
        },
        {
          "id": "dwd-healthcare",
          "label": "DWD Healthcare"
        }
      ],
      "items": [
        {
          "id": 1,
          "title": "NeuroXT and BIDMC Expand Collaboration to Advance AI-Driven Precision Treatment in Alzheimer's Disease",
          "summary": "BOSTON, May 26, 2026 /PRNewswire/ -- NeuroXT, a leading biotechnology company specializing in AI-driven neuroimaging biomarkers, today announced the successful completion of its initial collaborative research with Beth Israel Deaconess Medical Center (BIDMC), and the signing of a new agreement to further expand their research into the precision treatment of Alzheimer's disease.",
          "company": "NeuroXT",
          "source": "PR Newswire",
          "sourceUrl": "https://www.prnewswire.com/news-releases/neuroxt-and-bidmc-expand-collaboration-to-advance-ai-driven-precision-treatment-in-alzheimers-disease-302780888.html",
          "publishedAt": "2026-05-26",
          "image": "https://www.prnewswire.com/news-releases/neuroxt-and-bidmc-expand-collaboration-to-advance-ai-driven-precision-treatment-in-alzheimers-disease-302780888.html#",
          "imageAlt": "",
          "tags": [
            "MRI기반AI",
            "PET바이오마커"
          ],
          "featured": true,
          "visible": true,
          "categoryId": "portfolio"
        },
        {
          "id": 2,
          "title": "엑소퍼트 \"엑소좀으로 암 조기진단, 美 FDA 기기 등록 완료\"",
          "summary": "엑소퍼트는 엑소좀 기반 다중암 조기진단 플랫폼을 개발하고 있다. 한 번의 혈액 검사만으로 여러 암의 발병 여부를 한꺼번에 진단할 수 있는 기술을 보유했다.\n\n혈액 속 엑소좀을 분리한 뒤 엑소좀 고유의 라만 신호(분자지문)를 검출해 인공지능(AI) 기반 엑소좀 신호를 포괄적으로 분석하는 방식으로 진단 속도를 높이고 있다.\n\n폐암, 대장암, 위암, 간암, 췌장암, 유방암 등 6개 암종에 대해선 민감도 90.2%와 특이도 94.4%의 정확도를 확인해 국제학술지 네이처커뮤니케이션에 공개했다.",
          "company": "ExoPERT",
          "source": "한경 바이오 인사이트",
          "sourceUrl": "https://www.hankyung.com/article/202602281221i",
          "publishedAt": "2026-02-28",
          "image": "",
          "imageAlt": "",
          "tags": [],
          "featured": false,
          "visible": true,
          "categoryId": "portfolio"
        }
      ]
    },
    "contact": {
      "pretitle": "-",
      "titleLines": [
        "문의하기"
      ],
      "contactNote": "DWD Healthcare와의 협업, 투자, 글로벌 시장 진출 논의는 아래 연락처로 문의해 주세요.",
      "headquartersLabel": "본사",
      "headquartersAddressLines": [
        "Teheran-ro 152, Gangnam-gu",
        "Seoul, South Korea"
      ],
      "mapLinkLabel": "지도 보기",
      "mapHref": "https://maps.google.com/?q=Teheran-ro%20152%2C%20Gangnam-gu%2C%20Seoul%2C%20South%20Korea",
      "contactLabel": "대표 문의",
      "phoneLabel": "전화",
      "phone": "+82-2-1234-5678",
      "phoneHref": "tel:+82212345678",
      "emailLabel": "이메일",
      "email": "sample@example.com",
      "emailHref": "mailto:sample@example.com"
    },
    "footer": {
      "copyright": "© 2026 DWD HEALTHCARE. ALL RIGHTS RESERVED.",
      "links": []
    },
    "metadata": {
      "title": "DWD Healthcare",
      "description": "DWD Healthcare는 과학적 검토, 전략적 자본, 글로벌 헬스케어 시장 실행을 연결합니다.",
      "ogLocale": "ko_KR",
      "canonicalPath": "/ko"
    },
    "ui": {
      "homeAriaLabel": "DWD Healthcare 홈",
      "languageNavAriaLabel": "언어",
      "switchLanguageLabel": "{language}로 전환",
      "newsFilterAriaLabel": "뉴스 카테고리 필터",
      "newsResultSummary": "{category} 기준 뉴스 {count}개 표시",
      "newsResultItemSingular": "개",
      "newsResultItemPlural": "개",
      "readSourceAriaLabel": "출처 읽기: {title} (새 탭에서 열림)",
      "networkAggregateCountLabel": "집계 카테고리 수",
      "networkAggregateCategoriesLabel": "집계 카테고리",
      "networkApproxMapLabel": "시장 개략 지도",
      "aboutProfileLabel": "프로필",
      "focusEmptyState": "핵심 분야를 준비 중입니다.",
      "focusTablistAriaLabel": "핵심 분야 카테고리",
      "footerLinksAriaLabel": "푸터 링크"
    }
  }
};

const SUPPORTED_LOCALE_IDS = new Set(SUPPORTED_LOCALES.map((locale) => locale.id));

const getRuntimeLocale = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const [pathLocale] = window.location.pathname.split("/").filter(Boolean);
  return SUPPORTED_LOCALE_IDS.has(pathLocale) ? pathLocale : DEFAULT_LOCALE;
};

export const ACTIVE_LOCALE = getRuntimeLocale();
export const ACTIVE_LOCALE_META = SUPPORTED_LOCALES.find((locale) => locale.id === ACTIVE_LOCALE) ?? SUPPORTED_LOCALES[0];
export const ACTIVE_CONTENT = CONTENT_BY_LOCALE[ACTIVE_LOCALE] ?? CONTENT_BY_LOCALE[DEFAULT_LOCALE];
export const ACTIVE_METADATA = ACTIVE_CONTENT.metadata;
export const METADATA = ACTIVE_METADATA;
export const UI = ACTIVE_CONTENT.ui;

export const BRAND = ACTIVE_CONTENT.brand;

export const ICON_KEYS = ACTIVE_CONTENT.iconKeys;

export const SECTIONS = ACTIVE_CONTENT.sections;

export const HERO = ACTIVE_CONTENT.hero;

export const MARQUEE = ACTIVE_CONTENT.marquee;

export const ABOUT = ACTIVE_CONTENT.about;

export const FOCUS = ACTIVE_CONTENT.focus;

export const TEAM = ACTIVE_CONTENT.team;

export const BUSINESS = ACTIVE_CONTENT.business;

export const NETWORK = ACTIVE_CONTENT.network;

export const PORTFOLIO = ACTIVE_CONTENT.portfolio;

export const NEWS = ACTIVE_CONTENT.news;

export const CONTACT = ACTIVE_CONTENT.contact;

export const FOOTER = ACTIVE_CONTENT.footer;
