// 모듈 불러오기
import express from "express"; // Express 모듈
import cors from "cors"; // CORS 모듈
import helmet from "helmet"; // Helmet 모듈
import apiRouter from "./routes/index.js"; // 라우터 객체 가져오기

// Express 애플리케이션 객체 생성
const app = express();

// 미들웨어 적용시키기
app.use(helmet()); // 기본 보안 헤더
app.use(cors()); // CORS 허용 (나중에 프로트엔드 도메인 허용하게 추가!)
app.use(express.json()); // JSON body를 JavaScript 객체로 파싱

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
