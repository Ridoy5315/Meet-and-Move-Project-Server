/*
  Warnings:

  - You are about to drop the column `status` on the `events` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EventApprovalStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EventLifecycleStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "events" DROP COLUMN "status",
ADD COLUMN     "approvalStatus" "EventApprovalStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "lifecycleStatus" "EventLifecycleStatus";

-- DropEnum
DROP TYPE "EventStatus";
