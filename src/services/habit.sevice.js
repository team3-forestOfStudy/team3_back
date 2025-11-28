// habit.service.js

import prisma from "../prisma.js"; // Prisma Client 불러오기
habit.service.js;

// 📘 스터디별 습관 목록 조회 함수
// - GET /api/studies/:studyId/habits 에서 사용
export async function getStudyHabits(studyId) {
  const habits = await prisma.habit.findMany({
    where: { studyId },
    orderBy: {
      createdAt: "asc", // 먼저 만든 습관부터 보여주기
    },
    select: {
      habitId: true,
      studyId: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return habits;
}

// 📘 습관 생성 함수
// - 특정 스터디(studyId)에 습관 추가
export async function createHabit({ studyId, name }) {
  const newHabit = await prisma.habit.create({
    data: {
      studyId,
      name,
    },
  });

  return newHabit;
}

// 📘 습관 수정 함수 (이름 변경 + 수정 일자 업데이트)
// - PATCH/api/habits/:habitId 에서 사용
export async function updateHabit({ habitId, name }) {
  // 1) 먼저 해당 habit이 존재하는지 확인
  const existingHabit = await prisma.habit.findUnique({
    where: { habitId },
  });

  if (!existingHabit) {
    // 컨트롤러에서  null 반환
    return null;
  }

  // 2) 이름 변경 + 수정 시간 갱신
  const updatedHabit = await prisma.habit.update({
    where: { habitId },
    data: {
      name,
      updatedAt: new Date(), // 수정 일자 업데이트
    },
  });

  return updatedHabit;
}
