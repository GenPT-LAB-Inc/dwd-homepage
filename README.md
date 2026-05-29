# DWD Home

## 개요
DWD Healthcare의 단일 페이지 소개 사이트입니다. 모든 문구와 섹션 데이터는
locale별 콘텐츠 파일 트리에 모여 있어 레이아웃/로직을 건드리지 않고도 한국어/영어 콘텐츠를 업데이트할 수 있습니다.

## 기술 스택
- React 18 (UI)
- Vite 5 (빌드 도구)
- Tailwind CSS 3 (스타일링)
- Framer Motion (애니메이션)
- Lucide React (아이콘)
- PostCSS + Autoprefixer
- Vercel (배포)

## 아키텍처
- `src/App.jsx`가 정적 SPA를 렌더링합니다.
- 콘텐츠는 `content.data.json`의 `localeConfig`와 `contentByLocale.en`/`contentByLocale.ko`에서 관리되고 `src/content.jsx`로 생성됩니다.
- 명시적 URL은 `/en`이 영어 사이트, `/ko`가 한국어 사이트입니다.
- Vercel은 루트(`/`) 방문 시 `x-vercel-ip-country: KR`이면 `/ko`, 그 외는 기본 locale인 `/en`으로 임시 redirect합니다. IP 기반 판단은 기본값일 뿐이며 수동 언어 전환과 명시적 locale URL이 우선합니다.
- `npm run build` 후 `scripts/generate-locale-html.mjs`가 `dist/en/index.html`, `dist/ko/index.html`을 생성해 locale별 title, description, canonical, Open Graph, hreflang 메타데이터를 분리합니다.
- 네비/섹션 헤더 메타는 `SECTIONS`가 단일 소스입니다.
- About 섹션은 `about.leader`의 대표이사 메시지, `about.philosophy`의 통합 Philosophy 원칙, `about.footprint`의 본사/브랜치 오피스 풋프린트 맵을 렌더링합니다. 초기 대표이사 정보와 오피스 좌표는 샘플 값이며, 공식 정보가 확정되면 로컬 편집기에서 교체합니다.
- Focus Areas는 `focus.categories`의 고정 대분류 탭과 한국어 소분류 목록으로 렌더링됩니다.
- Global Network는 실제 협업사/기관 실명, 로고, URL 없이 `network.regions`의 시장별 집계 수치만 렌더링합니다.
- Network 시장 구분은 `US`, `EU`, `Japan`, `China`, `Asia-Pacific`, `MENA`, `ROW (Rest of World)`로 고정합니다.
- Global Network map background uses the local PNG asset `public/images/network/world-map-3.png`; no external map SDK, map tile, partner logo, institution marker, or runtime map request is used.
- News items are curated in `content.data.json` under `contentByLocale.<locale>.news.items` and rendered by the public News section.
- 아이콘은 `src/App.jsx`의 `ICONS` 맵에 키로 매핑되며 Focus, Business 등 콘텐츠 섹션에서 재사용됩니다.
- 백엔드/DB는 없습니다. 변경사항은 빌드/배포가 필요합니다.

## 업데이트 흐름 (비개발자 친화)
1. 가능하면 GUI 편집기를 사용합니다 (`npm run editor`).
2. 편집기 상단의 Locale 선택에서 English 또는 한국어를 고른 뒤 해당 locale 콘텐츠만 수정합니다.
3. 네비/섹션 타이틀 변경은 선택한 locale의 `sections`에서만 합니다. `id`와 순서는 locale 간 동일해야 합니다.
4. 객체 키나 `iconKey` 값은 `App.jsx`의 맵을 모르면 변경하지 않습니다.
5. 커밋 후 배포합니다 (Vercel이 `dist/`로 빌드).
6. 비개발자 편집 가이드는 `CONTENT_MANUAL.md`를 참고합니다.
7. 직접 수정 시 `content.data.json`을 편집 후 `npm run content:gen`을 실행합니다.
8. Use the local editor (`npm run editor`) to add, hide, reorder, and feature news items.
9. News summaries should be original short summaries with source links; do not paste full article bodies.
10. Network edits must remain aggregate-only: fixed markets, fixed category labels/codes, non-negative counts, and no logos, URLs, city nodes, or real partner/institution names.
11. About 대표이사 정보는 `about.leader`에서 관리합니다. 사진은 `public/images/team/`에 넣고 `/images/team/파일명.확장자` 경로로 연결합니다.
12. About 오피스 풋프린트는 `about.footprint`에서 관리합니다. `x`, `y`는 실제 위경도가 아니라 추상 지도 위 퍼센트 좌표입니다.
13. 한국어 운영 공개 전에는 방문자에게 보이는 한국어 본문, 이미지 alt, 뉴스 라벨, 연락처, 푸터 문구의 별도 승인 검수가 필요합니다.

## 폴더 및 파일 구조
```
.
├── content.data.json    # locale별 콘텐츠 데이터 원본 (편집기 대상)
├── content.backups/     # 자동 백업 (git 제외)
├── editor.html          # 편집기 엔트리
├── scripts/
│   ├── generate-content.mjs # JSON → content.jsx 생성
│   └── generate-locale-html.mjs # dist/en, dist/ko HTML 셸 생성
├── src/
│   ├── App.jsx          # 메인 레이아웃 및 렌더링 로직
│   ├── content.jsx      # 자동 생성된 콘텐츠 출력
│   ├── editor/          # 로컬 편집기 UI
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── main.jsx         # React 엔트리
│   └── index.css        # Tailwind 베이스 및 전역 스타일
├── index.html           # Vite HTML 셸
├── package.json         # 스크립트 및 의존성
├── vite.config.js       # Vite 설정
├── tailwind.config.cjs  # Tailwind 설정
├── postcss.config.cjs   # PostCSS 설정
├── vercel.json          # Vercel 빌드/출력 및 locale redirect 설정
└── dwd-new-home-v1.jsx  # 원본 단일 파일 초안 (참고용)
```

## 스크립트
- `npm run dev`    로컬 개발 서버 시작
- `npm run editor` 로컬 편집기 실행
- `npm run build`  프로덕션 빌드 출력(`dist/`)
- `npm run preview` 프로덕션 빌드 미리보기
- `npm run content:gen` JSON → content.jsx 생성

## Locale 검증
- `node --test scripts/generate-content.test.mjs`로 locale 구조, stable ID parity, News categoryId, Network 집계 전용 규칙을 검증합니다.
- `npm run build`는 Vite 빌드 후 `/en`과 `/ko` HTML shell까지 생성합니다.
- Vite 로컬 서버는 Vercel의 `x-vercel-ip-country` redirect를 완전히 재현하지 못합니다. 루트 IP redirect는 Vercel Preview에서 확인해야 합니다.

## 참고
- 로컬 개발은 Node 20+ 기준입니다.
- 새 아이콘을 추가하면 `src/App.jsx`의 `ICONS` 맵도 함께 갱신해야 합니다.
