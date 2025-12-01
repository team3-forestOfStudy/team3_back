# 🚀 공부의 숲 (Study Forest) 백엔드

코드잇 풀스택 10기 3팀의 초급 프로젝트 **공부의 숲(Study Forest)** 백엔드 레포지토리입니다.  
본 서버는 **RESTful API** 기반으로 설계되었으며, 스터디 생성부터 집중 타이머, 습관 체크까지 다양한 기능을 제공합니다.

---

## 🌟 1. 프로젝트 개요 (Overview)

**공부의 숲**은 사용자가 자신만의 스터디를 생성하고,  
습관을 관리하며, 집중 타이머를 통해 포인트를 획득하는 학습 성장 플랫폼입니다.

### 주요 기능

- 스터디 생성 및 관리
- 홈 화면: 검색 · 정렬 · 페이지네이션(더보기)
- 오늘의 집중(타이머 기반 포인트 적립)
- 이모지 기록(응원 기능)
- 오늘의 습관 체크 기능

### 배포 주소

| 구분                 | URL                                                    |
| -------------------- | ------------------------------------------------------ |
| **Backend Base URL** | https://team3-forest-study-backend.onrender.com        |
| **Swagger 문서**     | https://team3-forest-study-backend.onrender.com/docs   |
| **Health Check**     | https://team3-forest-study-backend.onrender.com/health |

---

## 🛠️ 2. 기술 스택 (Tech Stack)

| 구분        | 기술                | 설명                            |
| ----------- | ------------------- | ------------------------------- |
| 언어/런타임 | JavaScript, Node.js | 서버 개발                       |
| 프레임워크  | Express.js          | REST API 구축                   |
| ORM         | Prisma              | 타입·개발 생산성 향상           |
| DB          | PostgreSQL (Neon)   | 클라우드 기반 RDB               |
| 보안        | Bcrypt              | 비밀번호 해싱                   |
| 코드 품질   | ESLint              | 코드 스타일 및 품질 규칙 강제   |
| 코드 포맷팅 | Prettier            | 자동 코드 포맷팅 및 일관성 유지 |
| 개발 도구   | Nodemon             | 자동 리로드, 개발 편의성        |
| 배포        | Render              | 호스팅 플랫폼                   |

---

## 🗂️ 3. ERD (Database Schema)

아래는 Study Forest 프로젝트의 전체 데이터 구조(ERD)입니다.  
각 테이블 간의 관계(1:N, 1:1 등)와 필드를 한눈에 파악할 수 있습니다.

![ERD](./docs/erd.png)

---

## ⚙️ 4. 아키텍처 (Architecture)

본 프로젝트는 3계층 아키텍처(Layered Architecture) 기반으로 구축했습니다.

### 계층 구조

| 계층           | 역할                          | 파일                   |
| -------------- | ----------------------------- | ---------------------- |
| **Router**     | URL → Controller 매핑         | `src/routes/*.js`      |
| **Controller** | 요청/응답 처리, 유효성 검사   | `src/controllers/*.js` |
| **Service**    | 비즈니스 로직, Prisma DB 접근 | `src/services/*.js`    |

### 디렉토리 구조

```
📁src
├── controllers    # 요청/응답 처리
├── services       # 비즈니스 로직
├── routes         # 라우터 정의
├── middlewares    # 공통 미들웨어
├── prisma         # Prisma 스키마 및 마이그레이션
├── app.js         # Express 앱 설정
└── server.js      # 서버 실행
```

---

## 🗺️ 5. API 문서 (API Documentation)

### Swagger(OpenAPI)

- OpenAPI 스펙 파일: `openapi.yaml`

아래 두 환경에서 Swagger UI를 통해 최신 API 명세를 확인할 수 있습니다.

- **로컬 개발 환경:** http://localhost:4000/docs
- **배포 서버(Render):** https://team3-forest-study-backend.onrender.com/docs

---

## 📚 6. 주요 API 요약

### 🧭 Health Check

| 메서드 | 엔드포인트 | 설명           |
| ------ | ---------- | -------------- |
| GET    | `/health`  | 서버 상태 확인 |

---

### 📚 Study (스터디)

| 기능          | 메서드 | 엔드포인트                               | 설명                           |
| ------------- | ------ | ---------------------------------------- | ------------------------------ |
| 생성          | POST   | `/api/studies`                           | 비밀번호 해시 후 저장          |
| 목록 조회     | GET    | `/api/studies`                           | 검색/정렬/페이지네이션(더보기) |
| 상세 조회     | GET    | `/api/studies/{studyId}`                 | 습관·이모지 포함               |
| 비밀번호 확인 | POST   | `/api/studies/{studyId}/verify-password` | 수정/삭제 전 비밀번호 확인 API |
| 수정          | PATCH  | `/api/studies/{studyId}`                 | 비밀번호 인증 필요             |
| 삭제          | DELETE | `/api/studies/{studyId}`                 | 소프트 삭제(status=DELETED)    |

---

### 🔥 Focus (오늘의 집중)

| 기능                    | 메서드 | 엔드포인트                          | 설명                       |
| ----------------------- | ------ | ----------------------------------- | -------------------------- |
| 집중 기록 & 포인트 적립 | POST   | `/api/studies/{studyId}/focus-logs` | 10분당 1P + 성공 보너스 3P |

---

### 🎨 Emoji (응원 이모지)

| 기능             | 메서드 | 엔드포인트                      | 설명               |
| ---------------- | ------ | ------------------------------- | ------------------ |
| 조회             | GET    | `/api/studies/{studyId}/emojis` | count 기준 정렬    |
| 등록/카운트 증가 | POST   | `/api/studies/{studyId}/emojis` | Prisma upsert 활용 |

---

### ✏️ Habit (오늘의 습관)

| 기능             | 메서드 | 엔드포인트                                            | 설명                        |
| ---------------- | ------ | ----------------------------------------------------- | --------------------------- |
| 습관 목록 조회   | GET    | `/api/studies/{studyId}/habits`                       | 생성 순 정렬                |
| 습관 생성        | POST   | `/api/studies/{studyId}/habits`                       | 이름 필수                   |
| 습관 수정        | PATCH  | `/api/studies/{studyId}/habits/{habitId}`             | 이름 변경                   |
| 습관 삭제        | DELETE | `/api/studies/{studyId}/habits/{habitId}`             | habit + habitCheck 삭제     |
| 오늘의 습관 조회 | GET    | `/api/studies/{studyId}/habits/today`                 | 요일별 isChecked 포함       |
| 체크/해제        | PATCH  | `/api/studies/{studyId}/habits/{habitId}/check-today` | `{ isChecked: true/false }` |

---

## 🤝 7. 주요 담당자

| 역할                              | 이름   | 상세                                                                                                  |
| --------------------------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| **백엔드 설계 & 인프라 구축**     | 이수진 | ERD 설계, Prisma/DB 스키마, 미들웨어, Swagger, 배포 설정                                              |
| **스터디 · 집중 · 이모지 도메인** | 이수진 | 스터디 CRUD, 비밀번호 확인 API, 홈 목록(검색/정렬/페이지네이션), 오늘의 집중, 포인트, 이모지 API 구현 |
| **오늘의 습관 도메인**            | 손동익 | 습관 CRUD, 오늘의 습관 조회, 오늘 체크/해제 API 구현                                                  |

---

## 📝 8. 개발/협업 방식

### 브랜치 전략 (GitHub Flow)

- `main` — 배포 브랜치
- `dev` — 통합 개발 브랜치
- `feature/*` — 기능 단위 브랜치

### PR 규칙

- PR 대상: `dev`
- 제목 예시: `[feat] 스터디 수정 API 구현`
- 본문: 변경 내용 + 테스트 방법 작성

### 커밋 컨벤션

| 타입     | 설명                         |
| -------- | ---------------------------- |
| feat     | 새로운 기능 추가             |
| fix      | 버그 수정                    |
| refactor | 코드 리팩토링                |
| docs     | 문서 수정                    |
| chore    | 패키지 업데이트 및 기타 작업 |

---

## 📦 9. 실행 방법

### 1) 환경 변수 설정 (.env)

```
DATABASE_URL="YOUR_NEON_DB_URL"
```

### 2) 의존성 설치

```
npm install
```

### 3) Prisma migration

```
npx prisma migrate dev
```

### 4) 서버 실행

```
npm run dev
```

---

## 🎉 10. 백엔드 배포 정보 (Render)

| 항목                     | 값              |
| ------------------------ | --------------- |
| **Build Command**        | `npm install`   |
| **Start Command**        | `npm run start` |
| **Environment Variable** | `DATABASE_URL`  |

---

## ⛔ 11. Error Handling 정책

공통 에러 응답 규칙
| Status | 상황 | 공통 응답 형식 |
| ------ | ----------- | ----------------------------------------- |
| 400 | 잘못된 요청 | `{ result: "fail", message, data: null }` |
| 403 | 인증 실패(비밀번호) | 동일 |
| 404 | 리소스 없음 | 동일 |
| 500 | 서버 에러 | 동일 |

---

## 🔐 12. 비밀번호 처리 정책

- 비밀번호는 Bcrypt로 해싱하여 저장됩니다.
- 수정/삭제/비밀번호 검증 시 모든 비교는 Bcrypt.compare 사용
- 비밀번호는 절대 응답에 포함되지 않습니다.
