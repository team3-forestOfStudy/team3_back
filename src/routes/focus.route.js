import express from "express"; // Express 모듈 불러오기
import { createFocusLog } from "../controllers/focus.controller.js"; // 오늘의 집중 관련 처리 함수 (컨트롤러) 불러오기

const router = express.Router(); // 라우터 객체 생성

// 🅿️ 오늘의 집중 기록 생성 + 포인트 적립 - POST /api/studies/:studyId/focus-logs 요청을 받아 createFocusLog 컨트롤러와 연결
router.post("/:studyId/focus-logs", createFocusLog);

export default router;
