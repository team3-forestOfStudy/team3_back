import * as focusService from "../services/focus.service.js";

// 🅿️ 오늘의 집중 기록 생성 + 포인트 적립 컨트롤러 (POST /api/studies/:studyId/focus-logs)
export async function createFocusLog(req, res, next) {
  try {
    const { studyId } = req.params;
    const { plannedMinutes, actualMinutes } = req.body;

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

    // minutes 검사
    if (
      plannedMinutes === undefined ||
      actualMinutes === undefined ||
      !Number.isFinite(Number(plannedMinutes)) ||
      !Number.isFinite(Number(actualMinutes))
    ) {
      return res.status(400).send({
        result: "fail",
        message:
          "잘못된 요청입니다. plannedMinutes와 actualMinutes는 숫자여야 합니다.",
        data: null,
      });
    }

    const planned = Number(plannedMinutes);
    const actual = Number(actualMinutes);

    if (planned <= 0 || actual <= 0) {
      return res.status(400).send({
        result: "fail",
        message: "plannedMinutes와 actualMinutes는 1 이상이어야 합니다.",
        data: null,
      });
    }

    // 3. service 호출 → DB에 포인트 기록 생성
    const log = await focusService.createFocusLog(id, {
      plannedMinutes: planned,
      actualMinutes: actual,
    });

    if (!log.ok && log.reason === "NOT_FOUND") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 4. 응답 반환
    return res.status(201).send({
      result: "success",
      message: "오늘의 집중 기록이 성공적으로 저장되었습니다!",
      data: {
        studyId: id,
        focusLogId: log.focusLog.focusLogId,
        plannedMinutes: log.focusLog.plannedMinutes,
        actualMinutes: log.focusLog.actualMinutes,
        isCompleted: log.focusLog.isCompleted,
        isSuccess: log.focusLog.isSuccess,
        pointAmount: log.pointAmount,
        totalPointsAfter: log.totalPointsAfter,
        createdAt: log.focusLog.createdAt,
      },
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 미들웨어에 넘기기!
  }
}
