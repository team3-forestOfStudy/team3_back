import express from "express"; // Express 모듈 불러오기
import { getEmojis, addEmoji } from "../controllers/emoji.controller.js"; // 이모지 관련 처리 함수 (컨트롤러) 불러오기

const router = express.Router(); // 라우터 객체 생성

// 😉 이모지 목록 조회 - GET /api/studies/:studyId/emojis 요청을 받아 getEmojis 컨트롤러와 연결
router.get("/:studyId/emojis", getEmojis);

// 😉 이모지 등록 / 카운트 증가 - POST /api/studies/:studyId/emojis 요청을 받아 addEmoji 컨트롤러와 연결
router.post("/:studyId/emojis", addEmoji);

export default router;
