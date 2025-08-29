# Korean Release Note App

한국어 릴리즈 노트 관리 애플리케이션입니다. Next.js와 TypeScript로 구축되었으며, JSON 파일 기반의 서버 사이드 데이터 저장을 사용합니다.

## 주요 기능

- 🚀 **앱별 릴리즈 노트 관리**: 여러 앱의 릴리즈 노트를 개별적으로 관리
- 📝 **Markdown 지원**: 풍부한 텍스트 편집을 위한 Markdown 문법 지원
- 🔒 **발행 시스템**: 릴리즈 노트 발행 후 편집 불가 기능
- 📊 **발행 이력 추적**: 발행자와 발행 시간 기록
- 🎨 **반응형 UI**: 모든 디바이스에서 최적화된 사용자 경험
- 🌙 **다크 모드**: 사용자 선호도에 따른 테마 전환

## 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide Icons
- **Backend**: Next.js API Routes
- **Data Storage**: JSON 파일 기반 (서버 사이드)
- **UUID**: 앱 및 릴리즈 노트 고유 식별자

## 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   └── apps/          # 앱 관련 API
│   ├── globals.css        # 전역 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   └── ui/               # UI 컴포넌트
├── lib/                  # 유틸리티 및 타입
│   ├── api-client.ts     # API 클라이언트
│   ├── data-utils.ts     # 데이터 관리 유틸리티
│   ├── types.ts          # TypeScript 타입 정의
│   └── utils.ts          # 공통 유틸리티
├── data/                 # JSON 데이터 저장소
│   ├── apps/            # 앱 데이터
│   └── releases/        # 릴리즈 노트 데이터
└── scripts/             # 초기화 스크립트
    └── init-data.js     # 초기 데이터 생성
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 데이터 디렉토리 경로를 설정하세요:

```bash
# 개발 환경 (기본값)
DATA_DIR=./data

# 리눅스 서버 환경 (절대 경로 권장)
DATA_DIR=/var/lib/release-notes/data
```

**환경 변수 옵션:**
- `DATA_DIR`: 데이터 저장소 경로 (기본값: `./data`)
  - 개발 환경: 상대 경로 사용 가능 (`./data`)
  - 프로덕션 환경: 절대 경로 사용 권장 (`/var/lib/release-notes/data`)

### 3. 초기 데이터 생성

```bash
npm run init-data
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## API 엔드포인트

### 앱 관리
- `GET /api/apps` - 모든 앱 목록 조회
- `POST /api/apps` - 새 앱 생성
- `GET /api/apps/[id]` - 특정 앱 조회
- `PUT /api/apps/[id]` - 앱 정보 수정
- `DELETE /api/apps/[id]` - 앱 삭제

### 릴리즈 노트 관리
- `GET /api/apps/[id]/releases` - 앱의 릴리즈 노트 목록
- `POST /api/apps/[id]/releases` - 새 릴리즈 노트 생성
- `GET /api/apps/[id]/releases/[releaseId]` - 특정 릴리즈 노트 조회
- `PUT /api/apps/[id]/releases/[releaseId]` - 릴리즈 노트 수정
- `DELETE /api/apps/[id]/releases/[releaseId]` - 릴리즈 노트 삭제
- `POST /api/apps/[id]/releases/[releaseId]` - 릴리즈 노트 발행

## 데이터 구조

### 앱 (App)
```typescript
interface App {
  id: string          // UUID
  name: string        // 앱 이름
  createdAt: string   // 생성일시
  updatedAt: string   // 수정일시
}
```

### 릴리즈 노트 (ReleaseNote)
```typescript
interface ReleaseNote {
  id: string                    // UUID
  version: string              // 버전 (예: v2.1.0)
  title: string                // 제목
  date: string                 // 날짜
  content: string              // Markdown 내용
  type: "major" | "minor" | "patch"  // 릴리즈 타입
  isPublished: boolean         // 발행 여부
  publishHistory: PublishHistory[]  // 발행 이력
}
```

## 주요 변경사항

이전 버전에서 별도 백엔드 서버를 사용하던 방식에서 **Next.js 서버의 JSON 파일 기반 저장소**로 변경되었습니다:

- ✅ 서버 사이드 데이터 저장
- ✅ UUID 기반 고유 식별자
- ✅ 앱별 디렉토리 구조
- ✅ RESTful API 설계
- ✅ 타입 안전성 보장

## 빌드 및 배포

### 프로덕션 빌드

```bash
npm run build
```

### 프로덕션 서버 실행

```bash
npm start
```

### 리눅스 서버 배포

1. **데이터 디렉토리 생성**
   ```bash
   sudo mkdir -p /var/lib/release-notes/data
   sudo chown -R $USER:$USER /var/lib/release-notes
   ```

2. **환경 변수 설정**
   ```bash
   # .env.local 파일 생성
   echo "DATA_DIR=/var/lib/release-notes/data" > .env.local
   ```

3. **초기 데이터 생성**
   ```bash
   npm run init-data
   ```

4. **프로덕션 빌드 및 실행**
   ```bash
   npm run build
   npm start
   ```

### Docker 배포 (선택사항)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 데이터 디렉토리 생성
RUN mkdir -p /var/lib/release-notes/data

# 환경 변수 설정
ENV DATA_DIR=/var/lib/release-notes/data

EXPOSE 3000

CMD ["npm", "start"]
```

## 라이선스

MIT License
