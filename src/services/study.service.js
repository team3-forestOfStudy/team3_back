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

// 📘  스터디 목록 조회 함수 (DB 조회 및 데이터 가공 / 검색 + 정렬 + 페이지네이션(더보기))
export async function getStudyList({
  page = 1,
  pageSize = 6,
  keyword,
  sort = "recent",
}) {
  // 1. 모든 쿼리에 적용되는 기본 where 조건 설정
  const where = {
    status: {
      not: "DELETED", // 삭제된 스터디는 목록 조회에서 나타나지 않게 하기
    },
  };

  // 2. 검색어가 있으면 nickname, title, descriotion에서 검색
  let word = "";

  if (typeof keyword === "string") {
    word = keyword.normalize().trim(); // normalize() 메서드는 서로 다른 방식으로 인코딩된 문자열을 하나의 통일된 형식으로 변환하여 문자열 비교나 검색 시 오류를 방지하는 역할
  }

  if (word.length > 0) {
    where.OR = [
      { nickname: { contains: word, mode: "insensitive" } },
      { title: { contains: word, mode: "insensitive" } },
      { description: { contains: word, mode: "insensitive" } },
    ];
  }

  // 3. 정렬 옵션
  let orderBy;
  switch (sort) {
    case "oldest": // 오래된 순
      orderBy = { createdAt: "asc" };
      break;
    case "points_desc": // 많은 포인트 순
      orderBy = { totalPoints: "desc" };
      break;
    case "points_asc": // 적은 포인트 순
      orderBy = { totalPoints: "asc" };
      break;
    case "recent": // 최근 순
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // 4. Prisma의 skip 옵션에 필요한 건너뛸 스터디 수를 계산
  const skip = (page - 1) * pageSize;

  // 5. totalCount + 실제 데이터 조회
  const [totalCount, studies] = await Promise.all([
    prisma.study.count({ where }),
    prisma.study.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        emojis: {
          orderBy: { count: "desc" },
          take: 3,
        }, // 홈페이지의 스터디 카드에서 이모지 3개 보이니까!
      },
    }),
  ]); // totalCount랑 studies는 서로 독립적인 DB 작업이라서 서로의 결과를 기다릴 필요 X, 따라서 Promisa.all 사용!

  // 6. 프론트에 넘길 데이터: 비밀번호는 빼기!
  const studyList = studies.map((study) => ({
    studyId: study.studyId,
    nickname: study.nickname,
    title: study.title,
    description: study.description,
    backgroundImage: study.backgroundImage,
    totalPoints: study.totalPoints,
    createdAt: study.createdAt,
    topEmojis: study.emojis,
  }));

  return {
    studies: studyList,
    pagination: {
      totalCount,
      hasNextPage: page * pageSize < totalCount,
    },
  };
}

// 🔐 스터디 비밀번호 확인 함수
export async function checkStudyPassword(studyId, userPassword) {
  const study = await prisma.study.findUnique({
    where: { studyId },
  });

  // Service 계층에서 { ok: boolean, reason?: string, data?: T } 형태의 객체를 반환하는 것은 실패 상태와 그 원인을 명확히 전달하기 위한 매우 일반적이고 권장되는 패턴
  if (!study) {
    return {
      ok: false,
      reason: "NOT_FOUND",
      study: null,
    };
  }

  const isMatch = await bcrypt.compare(userPassword, study.encryptedPassword); // 해싱되지 않은 userPassword와 DB에 저장된 해싱된 study.encryptedPassword 비교

  if (!isMatch) {
    return {
      ok: false,
      reason: "WRONG_PASSWORD",
      study: null,
    };
  }

  return {
    ok: true,
    reason: null,
    study,
  };
}

// 📘 스터디 수정 함수
export async function updateStudy(studyId, updateData) {
  const { nickname, title, description, backgroundImage } = updateData;

  const updatedData = await prisma.study.update({
    where: { studyId },
    data: {
      ...(nickname !== undefined && { nickname }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(backgroundImage !== undefined && { backgroundImage }),
      status: "UPDATED", // status는 항상 update 되어야하니까 스프레드 문법 사용 X
    }, // 스프레드 문법을 활용하여 업데이트 할 부분만 업데이트!
  });

  return updatedData;
}

// 📘 스터디 삭제 함수 (status를 DELETED로 변경))
export async function deleteStudy(studyId) {
  const deletedData = await prisma.study.update({
    where: { studyId },
    data: {
      status: "DELETED",
    },
  });

  return deletedData;
}
