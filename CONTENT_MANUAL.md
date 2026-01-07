# content.jsx 편집 매뉴얼 (비개발자용)

이 문서는 `src/content.jsx` 파일을 안전하게 수정하는 방법을 설명합니다.  
본문 문구와 데이터만 바꾸면 사이트가 업데이트됩니다.

## 기본 원칙
- **따옴표 안의 텍스트만 수정**하세요. 키 이름, 쉼표, 대괄호/중괄호는 유지합니다.
- `SECTIONS`는 **네비와 섹션 헤더의 단일 소스**입니다. 순서를 바꾸면 네비/섹션 순서가 같이 바뀝니다.
- `iconKey`는 **정해진 값만** 사용합니다. (아래 `ICON_KEYS` 참고)
- `id`는 **고유하고 고정**이어야 합니다. 기존 `id`는 되도록 변경하지 마세요.
- 저장 후에는 **빌드/배포가 필요**합니다. (Vercel 또는 개발자 요청)

## ICON_KEYS (허용 아이콘 목록)
`iconKey`는 아래 값 중 하나만 사용하세요.
```
Activity, Dna, Microscope, Cpu, TestTube, Leaf, Layers, TrendingUp
```

## 어디를 수정하면 되나요?

### 1) 네비/섹션 타이틀
- 위치: `SECTIONS`
- 수정 가능: `navLabel`, `title`, `titleLines`, `number`
- 주의: `id`는 수정하지 마세요.

예시:
```js
{ id: "about", navLabel: "About", number: "01", title: "Our Philosophy" }
```

### 2) 히어로 문구
- 위치: `HERO`
- 수정 가능: `titleLines`, `subtitleLines`, `card.lines[].text`

### 3) 슬라이딩 문구 (마퀴)
- 위치: `MARQUEE`
- 수정 가능: `primary`, `secondary`

### 4) About 섹션
- 위치: `ABOUT`
- 수정 가능: `headlineLine`, `headlineHighlight`, `missionText`, `visionText`

### 5) Focus Areas
- 위치: `FOCUS.areas`
- 수정 가능: `title`, `kor`, `desc`, `code`, `iconKey`
- `iconKey`는 반드시 `ICON_KEYS` 중 하나.

### 6) Team
- 위치: `TEAM.members`
- 수정 가능: `name`, `role`, `bio`, `tags`
- 새로운 멤버 추가 시 **id는 중복 없이 새 번호**로 추가하세요.

### 7) Business
- 위치: `BUSINESS.steps`
- 수정 가능: `title`, `desc`, `iconKey`

### 8) Network
- 위치: `NETWORK`
- 수정 가능: `statusLabel`, `statusLines`, `nodes`
- `nodes`의 `x`, `y`는 **0~100 사이의 숫자**입니다.

### 9) Portfolio
- 위치: `PORTFOLIO.items`
- 수정 가능: `name`, `category`, `year`, `image`, `description`, `highlights`
- `image`는 `https://`로 시작하는 URL을 사용하세요.
- 항목 순서가 화면 순서입니다.

### 10) Contact / Footer
- 위치: `CONTACT`, `FOOTER`
- 수정 가능: 문구/이메일/링크 텍스트

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
