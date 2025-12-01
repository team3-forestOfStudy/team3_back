// habit.controller.js

import * as habitService from "../services/habit.service.js";
import * as studyService from "../services/study.service.js";

// 📘 스터디별 습관 목록 조회 컨트롤러 (GET /api/studies/:studyId/habits)
export async function getStudyHabits(req, res, next) {
  try {
    const { studyId } = req.params;

    // 1. 유효성 검사 - studyId가 숫자인지 확인
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다!",
        data: null,
      });
    }

    // 2. 스터디 존재 여부 + 삭제 여부 체크
    const study = await studyService.findActiveStudyById(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 3. service 호출 → 해당 스터디에 속한 습관 목록 조회
    const habits = await habitService.getStudyHabits(id);

    // 4. 응답
    return res.status(200).send({
      result: "success",
      message: "습관 목록이 성공적으로 조회되었습니다!",
      data: habits,
    });
  } catch (error) {
    next(error); // 예상하지 못한 에러는 에러 미들웨어로 넘기기
  }
}

// 📘 습관 생성 컨트롤러 (POST /api/studies/:studyId/habits)
export async function createHabit(req, res, next) {
  try {
    const { studyId } = req.params;
    const { name } = req.body;

    // 1. 유효성 검사 - studyId 숫자 체크
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다!",
        data: null,
      });
    }

    // 2. 스터디 존재 여부 + 삭제 여부 체크
    const study = await studyService.findActiveStudyById(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 3. 유효성 검사 - 습관 이름 필수
    if (!name?.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "습관 이름은 필수로 작성해야 합니다.",
        data: null,
      });
    }

    // 4. service 호출 → DB에 습관 생성
    const newHabit = await habitService.createHabit({
      studyId: id,
      name: name.trim(),
    });

    // 5. 응답
    return res.status(201).send({
      result: "success",
      message: "습관이 성공적으로 생성되었습니다!",
      data: newHabit,
    });
  } catch (error) {
    next(error);
  }
}

// 📘 습관 수정 컨트롤러 (PATCH /api/studies/:studyId/habits/:habitId)
export async function updateHabit(req, res, next) {
  try {
    const { habitId } = req.params;
    const { name } = req.body;

    // 1. 유효성 검사 - habitId 숫자 체크
    const id = Number(habitId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. habitId는 숫자여야 합니다!",
        data: null,
      });
    }

    // 2. 유효성 검사 - 수정할 이름 필수
    if (!name?.trim()) {
      return res.status(400).send({
        result: "fail",
        message: "습관 이름은 필수로 작성해야 합니다.",
        data: null,
      });
    }

    // 3. service 호출 → DB에서 습관 수정
    const updatedHabit = await habitService.updateHabit({
      habitId: id,
      name: name.trim(),
    });

    // 4. 습관이 없는 경우
    if (!updatedHabit) {
      return res.status(404).send({
        result: "fail",
        message: "해당 습관을 찾을 수 없습니다.",
        data: null,
      });
    }

    // 5. 응답
    return res.status(200).send({
      result: "success",
      message: "습관이 성공적으로 수정되었습니다!",
      data: updatedHabit,
    });
  } catch (error) {
    next(error);
  }
}

// 📘 습관 삭제 컨트롤러 (DELETE /api/studies/:studyId/habits/:habitId)
export async function deleteHabit(req, res, next) {
  try {
    const { studyId, habitId } = req.params;

    const parsedStudyId = Number(studyId);
    const parsedHabitId = Number(habitId);

    // 1. 유효성 검사 - studyId, habitId 숫자 체크
    if (Number.isNaN(parsedStudyId) || Number.isNaN(parsedHabitId)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId와 habitId는 숫자여야 합니다!",
        data: null,
      });
    }

    // 2. service 호출 → 해당 스터디에 속한 습관 삭제
    const deleted = await habitService.deleteHabit({
      studyId: parsedStudyId,
      habitId: parsedHabitId,
    });

    // 3. 삭제 대상이 없을 때
    if (!deleted) {
      return res.status(404).send({
        result: "fail",
        message: "해당 습관을 찾을 수 없습니다.",
        data: null,
      });
    }

    // 4. 응답
    return res.status(200).send({
      result: "success",
      message: "습관이 성공적으로 삭제되었습니다!",
      data: { habitId: parsedHabitId },
    });
  } catch (error) {
    next(error);
  }
}

// 📘 오늘의 습관 조회 컨트롤러 (GET /api/studies/:studyId/habits/today)
export async function getTodayHabits(req, res, next) {
  try {
    const { studyId } = req.params;

    // 1. studyId 숫자 유효성 검사
    const id = Number(studyId);
    if (Number.isNaN(id)) {
      return res.status(400).send({
        result: "fail",
        message: "잘못된 요청입니다. studyId는 숫자여야 합니다!",
        data: null,
      });
    }

    // 2. 스터디 존재 여부 + 삭제 여부 체크
    const study = await studyService.findActiveStudyById(id);

    if (!study || study.status === "DELETED") {
      return res.status(404).send({
        result: "fail",
        message: "해당 스터디를 찾을 수 없습니다.",
        data: null,
      });
    }

    // 3. Service 호출 → 오늘 요일 기준 습관 + 체크 상태 조회
    const todayHabits = await habitService.getTodayHabits(id);

    // 4. 응답
    return res.status(200).send({
      result: "success",
      message: "오늘의 습관 상태가 성공적으로 조회되었습니다!",
      data: todayHabits,
    });
  } catch (error) {
    next(error);
  }
}

// 📘 오늘의 습관 체크/체크 해제 컨트롤러 (PATCH /api/studies/:studyId/habits/:habitId/check-today)
export async function updateTodayHabitCheck(req, res, next) {
  try {
    const { studyId, habitId } = req.params;
    const { isChecked } = req.body;

    // studyId와 habitId 모두 숫자로 변환 후 변수 선언
    const parsedStudyId = Number(studyId);
    const parsedHabitId = Number(habitId);

    // 1. studyId, habitId 숫자 유효성 검사 (두 ID 모두)
    if (Number.isNaN(parsedStudyId) || Number.isNaN(parsedHabitId)) {
      return res.status(400).send({
        result: "fail",
        message: "studyId와 habitId는 숫자여야 합니다.",
        data: null,
      });
    }

    // 2. isChecked 타입 검사
    if (typeof isChecked !== "boolean") {
      return res.status(400).send({
        result: "fail",
        message: "isChecked는 true 또는 false여야 합니다.",
        data: null,
      });
    }

    // 3. 오늘 체크 상태 업데이트 (✅ 선언된 변수 사용)
    const updatedCheck = await habitService.updateTodayHabitCheck({
      studyId: parsedStudyId,
      habitId: parsedHabitId,
      isChecked,
    });

    // 4. 응답
    return res.status(200).send({
      result: "success",
      message: "오늘의 습관 체크 상태가 업데이트되었습니다!",
      data: updatedCheck,
    });
  } catch (error) {
    next(error);
  }
}
