-- AlterTable
ALTER TABLE "Run" ADD COLUMN     "public" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoPublishRuns" BOOLEAN NOT NULL DEFAULT false;
