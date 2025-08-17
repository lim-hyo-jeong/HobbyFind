# 💟 HobbyFind - 취미 탐색 웹서비스

<div align="center">

**취미를 3가지 카테고리(운동형, 지능형, 예술형)로 탐색하고, 사용자는 이를 북마크하여 관리할 수 있는 웹 서비스 개발 프로젝트**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
 
</div>

## 🔗 링크 

데모 사이트: https://hobbyfind.vercel.app/

## 🎯 프로젝트 개요

- HobbyFind는 사용자가 운동형, 지능형, 예술형이라는 3가지 대분류를 기준으로 다양한 취미를 탐색하고, 관심 있는 취미를 북마크하여 관리할 수 있는 웹 기반 취미 추천 플랫폼입니다.


## 🛠 기술 스택

### Frontend
- Next.js, React, TypeScript, Tailwind CSS, Shadcn/ui, Framer Motion

### Backend & Database
- Supabase, NextAuth.js, bcryptjs

### State Management & Data Fetching
- Zustand, @tanstack/react-query, React Hook Form

### Development Tools
- ESLint, PostCSS, Turbopack

## 🚀 시작하기

### 1. 저장소 클론
```bash
git clone https://github.com/lim-hyo-jeong/HobbyFind.git
cd hobbyfind
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**중요**: `NEXTAUTH_SECRET`은 강력한 무작위 문자열이어야 합니다.
```bash
openssl rand -base64 32
```

### 4. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. 프로젝트 설정에서 URL과 API 키 복사
3. SQL Editor에서 마이그레이션 실행:

```sql
-- supabase/migrations/0001_create_users_table.sql 실행
-- supabase/migrations/0002_create_bookmarks_table.sql 실행
```

### 5. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인할 수 있습니다.

## 📄 라이선스

- 이 프로젝트의 라이선스는 데이원컴퍼니에 귀속됩니다.
- 본 프로젝트는 K-Digital Credit(콜로소) 과정 「개발자 커리어 확장을 위해 쉽게 배우는 최신 리액트 & 타입스크립트 – 코딩 없이도 OK! Cursor AI로 빠르게 끝내는 웹 서비스 수익화」 강의에서 '파이널 프로젝트 및 가이드'의 일환으로 제작되었습니다. 

## 🌌 피드백

- Email: lim.gadi@gmail.com
- GitHub: [@lim-hyo-jeong](https://github.com/lim-hyo-jeong)
- 참고: 저는 본 강의에서 파이널 프로젝트 기획 및 코드 베이스 개발, 수강생을 위한 가이드 제작 및 실습 코치 역할로 참여하였습니다. 