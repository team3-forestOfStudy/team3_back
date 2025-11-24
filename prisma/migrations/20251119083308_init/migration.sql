-- CreateEnum
CREATE TYPE "StudyStatus" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateTable
CREATE TABLE "study" (
    "study_id" SERIAL NOT NULL,
    "nickname" VARCHAR(40) NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "background_image" VARCHAR(40),
    "encrypted_password" VARCHAR(255) NOT NULL,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "status" "StudyStatus" NOT NULL DEFAULT 'CREATED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_pkey" PRIMARY KEY ("study_id")
);

-- CreateTable
CREATE TABLE "habit" (
    "habit_id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habit_pkey" PRIMARY KEY ("habit_id")
);

-- CreateTable
CREATE TABLE "habit_check" (
    "habit_check_id" SERIAL NOT NULL,
    "habit_id" INTEGER NOT NULL,
    "study_id" INTEGER NOT NULL,
    "mon" BOOLEAN NOT NULL DEFAULT false,
    "tue" BOOLEAN NOT NULL DEFAULT false,
    "wed" BOOLEAN NOT NULL DEFAULT false,
    "thur" BOOLEAN NOT NULL DEFAULT false,
    "fri" BOOLEAN NOT NULL DEFAULT false,
    "sat" BOOLEAN NOT NULL DEFAULT false,
    "sun" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "habit_check_pkey" PRIMARY KEY ("habit_check_id")
);

-- CreateTable
CREATE TABLE "focus_log" (
    "focus_log_id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "planned_minutes" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "focus_log_pkey" PRIMARY KEY ("focus_log_id")
);

-- CreateTable
CREATE TABLE "point_history" (
    "point_history_id" SERIAL NOT NULL,
    "focus_log_id" INTEGER NOT NULL,
    "study_id" INTEGER NOT NULL,
    "point_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "point_history_pkey" PRIMARY KEY ("point_history_id")
);

-- CreateTable
CREATE TABLE "emoji" (
    "emoji_id" SERIAL NOT NULL,
    "study_id" INTEGER NOT NULL,
    "emoji_code" VARCHAR(20) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emoji_pkey" PRIMARY KEY ("emoji_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "point_history_focus_log_id_key" ON "point_history"("focus_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "emoji_study_id_emoji_code_key" ON "emoji"("study_id", "emoji_code");

-- AddForeignKey
ALTER TABLE "habit" ADD CONSTRAINT "habit_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_check" ADD CONSTRAINT "habit_check_habit_id_fkey" FOREIGN KEY ("habit_id") REFERENCES "habit"("habit_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habit_check" ADD CONSTRAINT "habit_check_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "focus_log" ADD CONSTRAINT "focus_log_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_history" ADD CONSTRAINT "point_history_focus_log_id_fkey" FOREIGN KEY ("focus_log_id") REFERENCES "focus_log"("focus_log_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "point_history" ADD CONSTRAINT "point_history_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emoji" ADD CONSTRAINT "emoji_study_id_fkey" FOREIGN KEY ("study_id") REFERENCES "study"("study_id") ON DELETE RESTRICT ON UPDATE CASCADE;
