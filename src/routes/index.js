import express from "express"; // Express 모듈 불러오기
import studyRouter from "./study.route.js";
import emojiRouter from "./emoji.route.js";
import focusRouter from "./focus.route.js";

const router = express.Router(); // 라우터 객체 생성

// 도메인 별 라우터 연결
// 도메인 별 라우터가 생기면 이 밑으로 붙이시면 됩니다:)
router.use("/studies", studyRouter); // /api/studies 아래에 스터디(Study) 관리 라우트 연결
router.use("/studies", emojiRouter); // /api/studies 아래에 이모지(Emoji) 관련 라우트 연결
router.use("/studies", focusRouter); // /api/studies 아래에 집중 기록(Focus Log) 관련 라우트 연결

export default router; // 다른 파일에서 사용할 수 있게 내보내기
