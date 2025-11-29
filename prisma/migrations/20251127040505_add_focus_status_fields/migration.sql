-- AlterTable
ALTER TABLE "focus_log" ADD COLUMN     "actual_minutes" INTEGER DEFAULT 0,
ADD COLUMN     "is_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_success" BOOLEAN NOT NULL DEFAULT false;
