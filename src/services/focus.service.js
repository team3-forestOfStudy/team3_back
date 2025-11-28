import prisma from "../prisma.js"; // Prisma Client 불러오기

// 🅿️ 포인트 계산 규칙: 목표한 집중에 성공한 경우에만 10분당 1포인트(과정 포인트) + 보너스 3포인트(성공 포인트)
function calculatePoints(plannedMinutes, actualMinutes) {
  // 1. 유효성 검사
  if (
    !Number.isFinite(plannedMinutes) ||
    !Number.isFinite(actualMinutes) ||
    plannedMinutes <= 0 ||
    actualMinutes <= 0
  ) {
    return 0;
  } // Number.isFinite() 메서드: 주어진 값이 유한(finite)한 숫자인지 확인

  // 2. 목표한 집중 시간을 채우지 못했으면 0포인트
  if (actualMinutes < plannedMinutes) {
    return 0;
  }

  // 3. 포인트 반환
  const processPoints = Math.floor(plannedMinutes / 10);
  const successPoints = 3;

  return processPoints + successPoints;
}

// 🅿️ 오늘의 집중 기록 생성 + 포인트 적립
export async function createFocusLog(
  studyId,
  { plannedMinutes, actualMinutes }
) {
  // 1. 스터디 존재 여부 확인
  const study = await prisma.study.findUnique({
    where: { studyId },
  });

  // Service 계층에서 { ok: boolean, reason?: string, data?: T } 형태의 객체를 반환하는 것은 실패 상태와 그 원인을 명확히 전달하기 위한 매우 일반적이고 권장되는 패턴
  if (!study || study.status === "DELETED") {
    return {
      ok: false,
      reason: "NOT_FOUND",
      focusLog: null,
      pointHistory: null,
      totalPointsAfter: null,
    };
  }

  // 2. 성공 여부 계산
  const isCompleted = actualMinutes > 0;
  const isSuccess =
    isCompleted &&
    Number.isFinite(plannedMinutes) &&
    Number.isFinite(actualMinutes) &&
    plannedMinutes > 0 &&
    actualMinutes >= plannedMinutes;

  // 3. FocusLog 생성
  const focusLog = await prisma.focusLog.create({
    data: {
      studyId,
      plannedMinutes,
      actualMinutes,
      isCompleted,
      isSuccess,
    },
  });

  // 4. 포인트 계산
  const pointAmount = calculatePoints(plannedMinutes, actualMinutes);

  let pointHistory = null;
  let updatedStudy = study;

  // 5. DB에 데이터 생성
  if (pointAmount > 0) {
    // 5-1. PointHistory 생성
    pointHistory = await prisma.pointHistory.create({
      data: {
        studyId,
        focusLogId: focusLog.focusLogId,
        pointAmount,
      },
    });

    // 5-2. Study.totalPoints 누적
    updatedStudy = await prisma.study.update({
      where: { studyId },
      data: {
        totalPoints: {
          increment: pointAmount,
        },
      },
    });
  }

  // Service 계층에서 { ok: boolean, reason?: string, data?: T } 형태의 객체를 반환하는 것은 실패 상태와 그 원인을 명확히 전달하기 위한 매우 일반적이고 권장되는 패턴
  return {
    ok: true,
    reason: null,
    focusLog,
    pointHistory,
    totalPointsAfter: updatedStudy.totalPoints,
    pointAmount,
  };
}
