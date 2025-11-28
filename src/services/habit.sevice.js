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

// 📘 습관 삭제 (habitId 삭제)
//   - DELETE /api/studies/:studyId/habits/:habitId
export async function deleteHabit({ studyId, habitId }) {
  // 해당 스터디에 속한 습관인지 확인 후 삭제
  const result = await prisma.habit.deleteMany({
    where: {
      habitId,
      studyId,
    },
  });

  // 삭제된 행이 없으면 (count = 0) → 없는 습관
  if (result.count === 0) {
    return false;
  }

  return true;
}

//  오늘의 습관 조회
export async function getTodayHabits(studyId) {
  // 스터디 + 습관 + 요일별 체크 정보 한 번에 조회
  const study = await prisma.study.findUnique({
    where: { studyId },
    include: {
      habits: true, // 습관 목록
      habitChecks: true, // 요일별 체크 기록
    },
  });

  // 스터디가 없으면 빈 배열
  if (!study) return [];

  // 오늘 요일 구하기 (0:일 ~ 6:토)
  const dayIndex = new Date().getDay();
  const dayKeyList = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
  const todayKey = dayKeyList[dayIndex]; // 예: "mon"

  // 각 습관에 대해 오늘 요일 체크 여부를 붙여서 반환
  const todayHabits = study.habits.map((habit) => {
    const check = study.habitChecks.find(
      (c) => c.habitId === habit.habitId //habitCheck에서 habitId 같은 데이터 찾기, (c) → 임의 지정
    );

    const isChecked = check ? Boolean(check[todayKey]) : false;

    return {
      habitId: habit.habitId,
      name: habit.name,
      isChecked, // 오늘 기준 체크 여부
    };
  });

  return todayHabits;
}
