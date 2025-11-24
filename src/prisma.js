import { PrismaClient } from "@prisma/client"; // Prisma Client 라이브러리 가져오기

const prisma = new PrismaClient(); // Prisma Client 인스턴스 생성

export default prisma; // 다른 파일에서 사용할 수 있게 내보내기
