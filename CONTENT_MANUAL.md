# 콘텐츠 편집 매뉴얼 (비개발자용)

이 문서는 DWD Home 콘텐츠를 안전하게 수정하는 방법을 설명합니다.
콘텐츠 원본은 `content.data.json`이며, `src/content.jsx`는 자동 생성 파일입니다.
`content.data.json`은 `contentByLocale.en`과 `contentByLocale.ko`로 나뉩니다.
가능하면 **편집기 UI를 사용하는 것을 권장**합니다.

## 기본 원칙
- 가능하면 **편집기 UI**로 수정하세요 (`npm run editor`).
- 편집기 상단의 **Locale** 선택에서 English 또는 한국어를 먼저 고른 뒤 수정하세요.
- **따옴표 안의 텍스트만 수정**하세요. 키 이름, 쉼표, 대괄호/중괄호는 유지합니다.
- 각 locale의 `sections`는 네비게이션 라벨과 섹션 헤더 메타데이터의 단일 소스입니다.
- 공개 페이지의 실제 섹션 렌더링 순서는 `src/App.jsx`에 정의되어 있으므로 섹션 추가, 삭제, 순서 변경은 개발자 작업이 필요합니다.
- `iconKey`는 **정해진 값만** 사용합니다. (아래 `ICON_KEYS` 참고)
- `id`는 **고유하고 고정**이어야 합니다. 기존 `id`는 되도록 변경하지 마세요.
- 저장 후에는 **빌드/배포가 필요**합니다. (Vercel 또는 개발자 요청)
- `/en`은 영어 사이트, `/ko`는 한국어 사이트입니다. 루트(`/`) 접속 시 한국 IP는 `/ko`, 그 외는 `/en`으로 이동하지만, 사용자가 직접 고른 언어 URL이 항상 우선합니다.
- 한국어 사이트 공개 전에는 방문자에게 보이는 한국어 본문, 이미지 alt, 메타 설명, 뉴스 라벨, 연락처, 푸터 문구의 승인 검수가 필요합니다.

## 편집기 UI 사용법 (권장)
1. `npm install` 후 `npm run editor` 실행
2. 브라우저에서 편집기 화면 확인
3. 상단 **Locale** 선택에서 수정할 언어 선택
4. 수정 후 **Save** 클릭
5. 변경 내용은 `content.data.json`과 `src/content.jsx`에 반영됨

## 직접 파일 수정이 필요할 때
1. `content.data.json`을 수정
2. `npm run content:gen` 실행
3. `src/content.jsx`가 자동 갱신됨
4. 배포 전 `npm run build`를 실행해 `dist/en/index.html`과 `dist/ko/index.html`이 생성되는지 확인

## 자동 백업
- 저장 시 `content.backups/` 폴더에 백업 파일이 생성됩니다.

## Locale 구조
- `localeConfig.defaultLocale`은 현재 `en`입니다.
- `localeConfig.countryLocaleMap.KR`은 `ko`입니다.
- `contentByLocale.en`과 `contentByLocale.ko`는 같은 top-level 키와 같은 stable ID 순서를 유지해야 합니다.
- 번역해도 되는 값: `navLabel`, `title`, 본문 문구, 뉴스 카테고리 `label`, UI 라벨, 메타 설명.
- 바꾸면 안 되는 값: locale ID, section `id`, Focus category `id`, Network market/stat `id`, News category `id`, Portfolio item `id`.
- IP 기반 언어 선택은 편의용 기본값입니다. VPN, 프록시, 해외 출장 사용자는 실제 선호 언어와 다르게 배정될 수 있으므로 화면의 언어 전환 버튼으로 변경할 수 있어야 합니다.

### Metadata / UI Labels
- 위치: `contentByLocale.<locale>.metadata`, `contentByLocale.<locale>.ui`
- `metadata.title`, `description`, `ogLocale`, `canonicalPath`는 `/en`, `/ko` HTML shell에 사용됩니다.
- `canonicalPath`는 영어 `/en`, 한국어 `/ko`를 유지합니다.
- `ui`는 화면 접근성 문구, 뉴스 결과 안내, 언어 전환 aria-label처럼 코드에 하드코딩하지 않는 방문자 노출 문구입니다.

## ICON_KEYS (허용 아이콘 목록)
`iconKey`는 아래 값 중 하나만 사용하세요.
```
Activity, Dna, Microscope, Cpu, TestTube, Leaf, Layers, TrendingUp
```

## 어디를 수정하면 되나요?

### 1) 네비/섹션 타이틀
- 위치: `contentByLocale.<locale>.sections`
- 수정 가능: `navLabel`, `title`, `titleLines`, `number`
- 주의: `id`는 수정하지 마세요.

예시:
```js
{ id: "about", navLabel: "About", number: "01", title: "Our Philosophy" }
```

### 2) 히어로 문구
- 위치: `contentByLocale.<locale>.hero`
- 수정 가능: `titleLines`, `subtitleLines`, `card.lines[].text`

### 3) 슬라이딩 문구 (마퀴)
- 위치: `contentByLocale.<locale>.marquee`
- 수정 가능: `primary`, `secondary`

### 4) About 섹션
- 위치: `contentByLocale.<locale>.about`
- 화면 구조: 상단 헤드라인, 대표이사 메시지, 대표 약력, Philosophy 원칙으로 표시됩니다.
- 수정 가능:
  - `headlineLine`, `headlineHighlight`
  - `leader.name`, `leader.role`, `leader.photo`, `leader.photoAlt`
  - `leader.greetingTitle`, `leader.greetingBody`
  - `leader.bio`
  - `philosophy.eyebrow`, `philosophy.title`, `philosophy.body`, `philosophy.principles`
  - `footprint.eyebrow`, `footprint.title`, `footprint.body`
  - `footprint.offices[].id`, `type`, `label`, `shortLabel`, `description`, `x`, `y`
- 현재 대표이사 정보는 샘플 값입니다. 공식 성명, 직함, 약력, 인사말, 사진이 확정되면 같은 필드만 교체합니다.
- `leader.photo`는 `/images/team/파일명.확장자` 또는 `https://` 이미지 URL을 사용합니다.
- `leader.greetingBody`와 `leader.bio`는 편집기에서 한 줄에 하나씩 입력합니다.
- `leader.tags`는 데이터 호환용으로 남겨두되, 현재 공개 About 프로필에는 표시하지 않고 편집기 입력도 비활성화합니다.
- 기존 분리형 사명/비전 필드는 사용하지 않습니다. 해당 메시지는 `philosophy` 아래의 제목, 본문, 3개 원칙으로 통합합니다.
- `footprint`는 About 섹션 안의 Global Operating Footprint 맵으로 표시됩니다.
- `type: "hq"`는 본사 1곳에만 사용하고, 브랜치 오피스는 `type: "branch"`를 사용합니다.
- `x`와 `y`는 `0`부터 `100`까지의 추상 지도 퍼센트 좌표입니다. 실제 GPS 좌표가 아닙니다.
- 정확한 주소는 공개 승인 전까지 입력하지 말고, `South Korea`, `Shanghai`, `Texas`처럼 지역 수준 라벨을 사용합니다.

예시:
```json
{
  "leader": {
    "name": "Sample CEO",
    "role": "Chief Executive Officer",
    "photo": "/images/team/sample-ceo-placeholder.svg"
  },
  "philosophy": {
    "title": "From scientific evidence to global healthcare value.",
    "principles": [
      { "title": "Scientific Rigor", "text": "We start with disciplined review of evidence." },
      { "title": "Commercial Translation", "text": "We convert technical potential into market narratives." },
      { "title": "Global Standard", "text": "We prepare companies for global expectations." }
    ]
  },
  "footprint": {
    "eyebrow": "GLOBAL OPERATING FOOTPRINT",
    "title": "Headquartered in South Korea, connected through Shanghai and Texas.",
    "offices": [
      { "id": "south-korea-hq", "type": "hq", "label": "South Korea", "shortLabel": "HQ", "x": 78, "y": 42 },
      { "id": "shanghai-branch", "type": "branch", "label": "Shanghai", "shortLabel": "SH", "x": 73, "y": 48 },
      { "id": "texas-branch", "type": "branch", "label": "Texas", "shortLabel": "TX", "x": 18, "y": 43 }
    ]
  }
}
```

### 5) Focus Areas
- 위치: `contentByLocale.<locale>.focus.categories`
- 화면 구조: 대분류는 탭으로 표시되고, 선택된 탭의 한국어 소분류가 상세 패널에 표시됩니다.
- 수정 가능: `summaryKo`, `code`, `iconKey`, `subcategories`; 한국어 locale에서는 `title`도 번역할 수 있습니다.
- `id`는 고정된 대분류 값입니다. 영어 locale의 `title`은 검증 기준이므로 변경이 필요하면 개발자에게 요청하세요.
- `summaryKo`는 선택된 탭 상단에 크게 보이는 한국어 대표 라벨입니다.
- `subcategories`는 상세 패널에 칩 형태로 표시되는 한국어 소분류 목록입니다.
- `iconKey`는 반드시 `ICON_KEYS` 중 하나를 사용합니다.
- 편집기 UI에서는 Focus Areas 탭에서 각 대분류 카드를 열고, 소분류는 한 줄에 하나씩 입력합니다.
- 편집기에서 대분류 순서는 바꿀 수 있지만, 대분류 추가/삭제나 `id`/`title` 변경은 개발자에게 요청하세요.

예시:
```js
{
  id: "digital-healthcare",
  code: "DH-03",
  title: "Digital Healthcare",
  summaryKo: "디지털 헬스케어",
  iconKey: "Cpu",
  subcategories: [
    "디지털 치료제",
    "환자관리, 병원 솔루션",
    "의료데이터, 원격 모니터링",
    "헬스케어 플랫폼"
  ]
}
```

### 6) Team
- 위치: `contentByLocale.<locale>.team.members`
- 수정 가능: `name`, `role`, `bio`, `tags`
- 새로운 멤버 추가 시 **id는 중복 없이 새 번호**로 추가하세요.

### 7) Business
- 위치: `contentByLocale.<locale>.business.steps`
- 수정 가능: `title`, `desc`, `iconKey`

### 8) Network
- 위치: `contentByLocale.<locale>.network`
- 화면 목적: 실제 협업사, 의료기관, 연구기관의 실명이나 로고를 노출하지 않고, 시장별 네트워크 규모를 집계 수치로만 보여줍니다.
- 수정 가능: `eyebrow`, `intro`, `privacyNote`, `hubLabel`, `totalLabel`, `regionSummaryLabel`, `regions[].label`, `regions[].summary`, `regions[].x`, `regions[].y`, `regions[].stats[].label`, `regions[].stats[].count`
- 고정 시장 ID: `us`, `eu`, `japan`, `china`, `asia-pacific`, `mena`, `row`
- `Asia-Pacific`은 `Japan`, `China`를 제외한 아시아·태평양 시장으로 해석합니다.
- `ROW (Rest of World)`는 위 6개 시장에 포함되지 않는 기타 시장입니다.
- 고정 집계 카테고리 ID: `major-medical-centers`, `research-organizations`, `clinical-networks`, `business-development-channels`, `enterprise-healthcare-channels`
- 영어 locale의 Network 라벨/요약은 승인된 영문 문구를 유지합니다. 한국어 locale에서는 라벨과 요약을 번역할 수 있지만, 실명/URL/파트너 관계 암시 금지 규칙은 동일하게 적용됩니다.
- `regions[].x`, `regions[].y`는 지도 위 마커 위치이며 **5~95 사이의 숫자**만 사용합니다.
- `count`는 음수가 아닌 정수만 사용합니다.
- 금지: 실제 기업명, 의료기관명, 연구기관명, 협력사명, 도시명, 로고, 이미지 URL, 웹사이트 URL, 파트너십/고객 관계를 암시하는 문구
- 지도 배경은 외부 지도 서비스가 아니라 `/images/network/world-map-3.png` 로컬 PNG 월드맵입니다.
- 마커 좌표는 실제 주소, 도시, 사무소, 병원, 파트너 위치가 아니라 근사 시장 앵커입니다.
- `ROW (Rest of World)`는 `US`, `EU`, `Japan`, `China`, `Asia-Pacific`, `MENA` 밖의 시장을 분산 집계로 표현합니다.
- 금지: 실제 기업명, 의료기관명, 연구기관명, 사람 이름, 협력사명, 도시명, 로고, 이미지 URL, 웹사이트 URL, 이메일, 사례명, 파트너십/고객 관계를 암시하는 문구
- 지도 이미지 변경은 `public/images/network/world-map-3.png` 교체와 브라우저 좌표 QA가 필요한 개발자 작업입니다.
- 편집기 UI에서는 시장/카테고리 추가·삭제가 제한됩니다. 새로운 시장이나 집계 카테고리가 필요하면 개발자 검토 후 추가하세요.

예시:
```js
{
  id: "us",
  label: "US",
  shortLabel: "US",
  x: 18,
  y: 42,
  summary: "Representative aggregate coverage for the US market across approved healthcare access categories.",
  stats: [
    { id: "major-medical-centers", code: "MED", label: "Major Medical Centers", count: 4 },
    { id: "research-organizations", code: "R&D", label: "Research Organizations", count: 3 }
  ]
}
```

### 9) Portfolio
- 위치: `contentByLocale.<locale>.portfolio.items`
- 수정 가능: `name`, `category`, `year`, `image`, `description`, `highlights`
- `image`는 `https://`로 시작하는 URL을 사용하세요.
- 항목 순서가 화면 순서입니다.

### 10) News
- 위치: `contentByLocale.<locale>.news.items` (`src/content.jsx`의 `NEWS`는 자동 생성 결과)
- 수정 가능: `title`, `summary`, `categoryId`, `company`, `source`, `sourceUrl`, `publishedAt`, `image`, `imageAlt`, `tags`, `featured`, `visible`
- 카테고리 ID는 `portfolio`, `dwd-healthcare`만 사용합니다. 화면 표시 라벨은 `news.categoryOptions[].label`에서 locale별로 번역합니다. `market` 카테고리는 비활성화되어 사용하지 않습니다.
- `visible`이 꺼진 항목은 공개 사이트에 표시되지 않습니다.
- `featured`가 켜진 공개 항목 중 첫 번째 항목은 크게 표시됩니다.
- 기사 전문을 복사하지 말고, 직접 작성한 짧은 요약과 원문 링크만 사용하세요.
- `sourceUrl`은 실제 기사 또는 공식 발표 페이지의 `https://` URL을 사용하세요.
- `publishedAt`은 `YYYY-MM-DD` 형식으로 입력하세요.
- `image`는 직접 보유했거나 사용 허가를 받은 이미지, 또는 공식적으로 재사용 가능한 보도자료/미디어 이미지 URL만 사용하세요. 언론사 기사 이미지를 임의로 복사하거나 핫링크하지 마세요.
- `imageAlt`는 이미지가 전달하는 내용이 있을 때 짧게 작성하세요. 단순 장식용 썸네일이면 비워둘 수 있습니다.

게시 절차:
1. 새 항목은 숨김 상태(`visible: false`)의 초안으로 추가합니다.
2. 제목, 직접 작성한 요약, 카테고리, 날짜, 출처명 또는 회사명, 원문 링크를 입력합니다.
3. 기사 본문, 유료 기사 문구, 차트, 언론사 이미지는 복사하지 않습니다.
4. 숨김 상태로 먼저 저장합니다.
5. 출처와 이미지 권리를 확인한 뒤에만 `visible`을 켭니다.
6. 저장 후 `npm run build`와 배포가 필요합니다. 편집기 저장만으로 운영 사이트가 자동 게시되지는 않습니다.

### 11) Contact / Footer
- 위치: `contentByLocale.<locale>.contact`, `contentByLocale.<locale>.footer`
- 대표전화, 대표이메일, 주소, 지도 링크는 `CONTACT`에서 수정합니다.
- Contact 섹션과 Footer의 대표 연락처는 같은 `CONTACT` 값을 사용합니다.
- `FOOTER.links`는 LinkedIn, Privacy Policy 같은 추가 푸터 링크만 관리합니다.
- `CONTACT.phone`은 화면 표시용 전화번호입니다.
- `CONTACT.phoneHref`는 클릭용 전화 링크이며 `tel:+82200000000` 형식을 사용합니다.
- `CONTACT.email`은 화면 표시용 이메일입니다.
- `CONTACT.emailHref`는 클릭용 메일 링크이며 `mailto:hello@dwdhc.com` 형식을 사용합니다.
- `CONTACT.mapHref`에는 실제 지도 URL을 입력하고 `#`는 사용하지 않습니다.
- 실제 URL이 확정되지 않은 푸터 링크는 `FOOTER.links`에서 제거합니다.

## 안전하게 수정하는 방법
1. 수정할 항목을 찾습니다.
2. **따옴표 안 텍스트만** 변경합니다.
3. 줄 끝의 **쉼표를 유지**합니다.
4. 저장 후 개발자에게 배포를 요청합니다.

## 자주 발생하는 실수
- 쉼표 삭제 → 파일이 깨짐
- `iconKey` 오타 → 아이콘이 안 보임
- `id` 변경 → 애니메이션/토글 불안정

## 섹션 추가/삭제는?
새 섹션 추가/삭제는 `App.jsx` 수정이 필요합니다.  
이 경우 개발자에게 요청하세요.
