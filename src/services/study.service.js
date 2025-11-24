import prisma from "../prisma.js"; // Prisma Client 불러오기
import bcrypt from "bcrypt"; // Node.js 애플리케이션에서 bcrypt 라이브러리를 가져오기(비밀번호 암호화용 라이브러리)

// 📘 스터디 생성 함수
export async function createStudy(data) {
  const { nickname, title, description, password, backgroundImage } = data;

  // 1. 비밀번호 암호화
  const encryptedPassword = await bcrypt.hash(password, 10);

  // 2. DB에 STUDY 행 저장
  const newStudy = await prisma.study.create({
    data: {
      nickname,
      title,
      description,
      backgroundImage,
      encryptedPassword,
    },
  });

  return newStudy;
}

// 📘  스터디 상세 조회 함수 (DB 조회 및 데이터 가공)
export async function getStudyDetail(studyId) {
  // 스터디 기본 정보
  const study = await prisma.study.findUnique({
    where: { studyId },
    include: {
      emojis: {
        orderBy: { count: "desc" }, // 이모지 카운트 기준 내림차순 정렬
        take: 3, // 상위 3개만 가져옴 (코드잇 요구사항)
      },
      habitChecks: true, // 요일별 습관 체크 기록 모두 가져오기
      habits: true, // 스터디에 등록된 모든 습관 정보 가져오기
    },
  });

  if (!study) return null;

  // habit + habitCheck를 합쳐서 프론트에서 쓰기 쉽게 변환하기
  const habitRecords = study.habits.map((habit) => {
    const check = study.habitChecks.find(
      (check) => check.habitId === habit.habitId
    );

    return {
      habitId: habit.habitId,
      name: habit.name,
      mon: check?.mon ?? false,
      tue: check?.tue ?? false,
      wed: check?.wed ?? false,
      thur: check?.thur ?? false,
      fri: check?.fri ?? false,
      sat: check?.sat ?? false,
      sun: check?.sun ?? false,
    };
  });

  return {
    studyId: study.studyId,
    nickname: study.nickname,
    title: study.title,
    description: study.description,
    backgroundImage: study.backgroundImage,
    totalPoints: study.totalPoints,
    status: study.status,
    createdAt: study.createdAt,
    updatedAt: study.updatedAt,

    topEmojis: study.emojis,
    habitRecords: habitRecords,
  };
}

// 📘  스터디 목록 조회 함수 (DB 조회 및 데이터 가공)
export async function getStudyList() {
  const studies = await prisma.study.findMany({
    where: {
      status: {
        not: "DELETED", // 삭제된 스터디는 목록 조회에서 나타나지 않게 하기
      },
    },
    orderBy: {
      createdAt: "desc", // 최신순으로 정렬하기
    },
    select: {
      studyId: true,
      nickname: true,
      title: true,
      description: true,
      backgroundImage: true,
      totalPoints: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    }, // 비밀번호는 목록에 필요없어서 제외함
  });

  return studies;
}
