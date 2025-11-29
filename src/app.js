// 모듈 불러오기
import express from "express"; // Express 모듈
import cors from "cors"; // CORS 모듈
import helmet from "helmet"; // Helmet 모듈
import apiRouter from "./routes/index.js"; // 라우터 객체 가져오기

// 🔗 Swagger/OpenAPI 관련 모듈
import swaggerUi from "swagger-ui-express"; // 생성된 OpenAPI 문서를 기반으로 사용자 친화적인 Swagger UI를 웹 페이지로 제공하는 Express 미들웨어
import fs from "fs"; // File System 모듈 (openapi.yaml 파일과 같은 로컬 파일을 읽어오기 위해 사용)
import path from "path"; // 경로 관련 유틸리티 모듈
import YAML from "yaml"; // YAML 파일 파싱을 위한 모듈 (YAML 형식으로 작성된 OpenAPI 문서를 JavaScript 객체로 파싱하기 위해 사용)
import { fileURLToPath } from "url"; // ES Modules 환경에서 파일 URL을 경로로 변환하는 유틸리티

// Express 애플리케이션 객체 생성
const app = express();

// 🔗 __dirname 대체 (ESM 환경)
const __filename = fileURLToPath(import.meta.url); // 현재 모듈의 파일 URL을 파일 시스템 경로로 변환
const __dirname = path.dirname(__filename); // 변환된 경로에서 디렉토리 이름(경로)만 추출 (CommonJS의 __dirname 역할)

// 🔗 루트에 있는 openapi.yaml 파일 읽기
const openapiPath = path.join(__dirname, "..", "openapi.yaml"); // 현재 디렉토리 상위 폴더의 openapi.yaml 파일 경로를 안전하게 구성
const openapiFile = fs.readFileSync(openapiPath, "utf-8"); // 구성된 경로에서 openapi.yaml 파일 내용을 UTF-8로 동기적으로 읽기
const swaggerSpec = YAML.parse(openapiFile); // 읽어온 YAML 문자열 데이터를 JavaScript 객체(Swagger Specification)로 파싱

// 미들웨어 적용시키기
app.use(helmet()); // 기본 보안 헤더
app.use(cors()); // CORS 허용 (나중에 프로트엔드 도메인 허용하게 추가!)
app.use(express.json()); // JSON body를 JavaScript 객체로 파싱

// 🔗 Swagger 문서 UI 라우트
// http://localhost:4000/docs 로 접속하면 Swagger UI 확인 가능
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 헬스 체크용 기본 라우터
app.get("/health", (req, res) => {
  res.json({
    result: "success",
    message: "공부의 숲 백엔드 잘 돌아갑니다~~!",
  });
});

// 앞으로 여기에 라우터들 붙이기!
app.use("/api", apiRouter);

// 공통 에러 핸들러 미들웨어
app.use((error, req, res, _next) => {
  console.error(error); // 서버 콘솔에 에러 기록

  res.status(500).send({
    result: "fail",
    message: "서버 내부 오류가 발생했습니다.",
    data: null,
  });
});

// app 객체를 다른 파일에서 사용할 수 있도록 export
export default app;
