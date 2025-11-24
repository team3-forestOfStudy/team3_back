import express from "express"; // Express 모듈 불러오기
import studyRouter from "./study.route.js";

const router = express.Router(); // 라우터 객체 생성

// 도메인 별 라우터 연결
// 도메인 별 라우터가 생기면 이 밑으로 붙이시면 됩니다:)
router.use("/studies", studyRouter); // /api/studies 로 시작하는 요청 처리

export default router; // 다른 파일에서 사용할 수 있게 내보내기
