-- AlterEnum
ALTER TYPE "ModuleType" ADD VALUE 'TEXT';

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "completedLessonIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastActiveDate" TIMESTAMP(3),
ADD COLUMN     "totalLearningMinutes" INTEGER NOT NULL DEFAULT 0;
