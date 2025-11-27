import prisma from "../prisma.js"; // Prisma Client 불러오기

// 😉 특정 스터디의 이모지 목록 조회 함수
export async function getEmojisByStudyId(studyId) {
  const emojis = await prisma.emoji.findMany({
    where: { studyId },
    orderBy: { count: "desc" }, // 클릭 많은 순으로!
  });

  return emojis;
}

// 😉 이모지 추가 or count 증가 함수
export async function upsertEmoji(studyId, emojiCode) {
  const emoji = await prisma.emoji.upsert({
    where: {
      studyId_emojiCode: {
        studyId,
        emojiCode,
      }, // @@unique([studyId, emojiCode])로 만들어진 복합 유니크 키 이름
    },
    update: {
      count: {
        increment: 1,
      },
    },
    create: {
      studyId,
      emojiCode,
      count: 1,
    },
  }); // upsert는 UPDATE와 INSERT 작업을 결합한 메서드

  return emoji;
}
