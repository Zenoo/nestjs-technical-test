-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN');

-- CreateEnum
CREATE TYPE "RunType" AS ENUM ('TRAINING', 'RACE', 'LEISURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "UserRole"[] DEFAULT ARRAY[]::"UserRole"[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Run" (
    "id" TEXT NOT NULL,
    "type" "RunType" NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "duration" INTEGER NOT NULL,
    "averageSpeed" DOUBLE PRECISION NOT NULL,
    "averagePace" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "Run_type_idx" ON "Run"("type");

-- CreateIndex
CREATE INDEX "Run_start_idx" ON "Run"("start");

-- CreateIndex
CREATE INDEX "Run_userId_idx" ON "Run"("userId");

-- CreateIndex
CREATE INDEX "Run_distance_idx" ON "Run"("distance");

-- CreateIndex
CREATE INDEX "Run_duration_idx" ON "Run"("duration");

-- CreateIndex
CREATE INDEX "Run_averageSpeed_idx" ON "Run"("averageSpeed");

-- CreateIndex
CREATE INDEX "Run_averagePace_idx" ON "Run"("averagePace");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
