import * as emojiService from "../services/emoji.service.js";
import * as studyService from "../services/study.service.js";

// 😉 이모지 목록 조회 컨트롤러 (GET /api/studies/:studyId/emojis)
export async function getEmojis(req, res, next) {
  try {
    const { studyId } = req.params;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // study 존재 여부 확인
    const study = await studyService.findActiveStudyById(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 2. service 호출 → studyId로 DB 조회
    const emojis = await emojiService.getEmojisByStudyId(id);

    // 3. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "이모지 목록이 성공적으로 조회되었습니다!",
      data: emojis.map((emoji) => ({
        emojiId: emoji.emojiId,
        emojiCode: emoji.emojiCode,
        count: emoji.count,
        createdAt: emoji.createdAt,
      })),
    }); // 이모지 목록 조회에서까지 스터디 id를 중복으로 반환할 필요 없으니까 map 사용
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}

// 😉 이모지 등록 / 카운트 증가 컨트롤러 (POST /api/studies/:studyId/emojis)
export async function addEmoji(req, res, next) {
  try {
    const { studyId } = req.params;
    const { emojiCode } = req.body;

    // 1. 유효성 검사
    // studyId 검사 및 숫자 변환
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다.",
        data: null,
      });
    }

    // emojiCode 확인
    if (!emojiCode || typeof emojiCode !== "string" || !emojiCode.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "emojiCode는 필수로 작성해야하는 문자열입니다.",
        data: null,
      });
    }

    // study 존재 여부 확인
    const study = await studyService.findActiveStudyById(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 2. service 호출 → DB에 upsert
    const emoji = await emojiService.upsertEmoji(id, emojiCode.trim());

    // 3. 응답 반환
    return res.status(200).send({
      result: "success",
      message: "이모지가 성공적으로 추가되었습니다!",
      data: {
        emojiId: emoji.emojiId,
        emojiCode: emoji.emojiCode,
        count: emoji.count,
        createdAt: emoji.createdAt,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}
