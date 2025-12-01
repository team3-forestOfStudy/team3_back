import express from "express"; // Express 모듈 불러오기
import {
  createStudy,
  getStudyDetail,
  getStudyList,
  verifyStudyPassword,
  updateStudy,
  deleteStudy,
} from "../controllers/study.controller.js"; // 스터디 관련 처리 함수 (컨트롤러) 불러오기

const router = express.Router(); // 라우터 객체 생성

// 📘 스터디 목록 조회 - GET /api/studies 요청을 받아 getStudyList 컨트롤러와 연결
router.get("/", getStudyList);

// 📘 스터디 생성 - POST /api/studies 요청을 받아 createStudy 컨트롤러와 연결
router.post("/", createStudy);

// 📘 스터디 상세 조회 - GET /api/studies/:studyId 요청을 받아 getStudyDetail 컨트롤러와 연결
router.get("/:studyId", getStudyDetail);

// 🔐 비밀번호 확인 전용 - POST /api/studies/:studyId/verify-password 요청을 받아 verifyStudyPassword 컨트롤러와 연결 (상세 페이지에서 "수정/삭제 전 비밀번호 확인 모달"에서 사용하기 좋은 엔드포인트 )
router.post("/:studyId/verify-password", verifyStudyPassword);

// 📘 스터디 수정 - PATCH /api/studies/:studyId 요청을 받아 updateStudy 컨트롤러와 연결
router.patch("/:studyId", updateStudy);

// 📘 스터디 삭제 - DELETE /api/studies/:studyId 요청을 받아 deleteStudy 컨트롤러와 연결
router.delete("/:studyId", deleteStudy);

export default router;
