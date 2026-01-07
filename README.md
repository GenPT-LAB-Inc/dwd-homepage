# DWD Home

## 개요
DWD Healthcare의 단일 페이지 소개 사이트입니다. 모든 문구와 섹션 데이터는
단일 콘텐츠 파일에 모여 있어 레이아웃/로직을 건드리지 않고도 업데이트할 수 있습니다.

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
- 콘텐츠는 `src/content.jsx`의 데이터로 구성됩니다.
- 네비/섹션 헤더 메타는 `SECTIONS`가 단일 소스입니다.
- 아이콘은 `src/App.jsx`의 `ICONS` 맵에 키로 매핑됩니다.
- 백엔드/DB는 없습니다. 변경사항은 빌드/배포가 필요합니다.

## 업데이트 흐름 (비개발자 친화)
1. `src/content.jsx`만 수정합니다.
2. 네비/섹션 타이틀 변경은 `SECTIONS`에서만 합니다.
3. 객체 키나 `iconKey` 값은 `App.jsx`의 맵을 모르면 변경하지 않습니다.
4. 커밋 후 배포합니다 (Vercel이 `dist/`로 빌드).
5. 비개발자 편집 가이드는 `CONTENT_MANUAL.md`를 참고합니다.

## 폴더 및 파일 구조
```
.
├── src/
│   ├── App.jsx          # 메인 레이아웃 및 렌더링 로직
│   ├── content.jsx      # 모든 문구/섹션 데이터 (SECTIONS 포함)
│   ├── main.jsx         # React 엔트리
│   └── index.css        # Tailwind 베이스 및 전역 스타일
├── index.html           # Vite HTML 셸
├── package.json         # 스크립트 및 의존성
├── vite.config.js       # Vite 설정
├── tailwind.config.cjs  # Tailwind 설정
├── postcss.config.cjs   # PostCSS 설정
├── vercel.json          # Vercel 빌드/출력 설정
└── dwd-new-home-v1.jsx  # 원본 단일 파일 초안 (참고용)
```

## 스크립트
- `npm run dev`    로컬 개발 서버 시작
- `npm run build`  프로덕션 빌드 출력(`dist/`)
- `npm run preview` 프로덕션 빌드 미리보기

## 참고
- 로컬 개발은 Node 20+ 기준입니다.
- 새 아이콘을 추가하면 `src/App.jsx`의 `ICONS` 맵도 함께 갱신해야 합니다.
