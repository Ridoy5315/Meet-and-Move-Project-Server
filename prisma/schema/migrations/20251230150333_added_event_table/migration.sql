-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('EVENT', 'ACTIVITY');

-- CreateEnum
CREATE TYPE "PriceType" AS ENUM ('FREE', 'PAID');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PENDING', 'PUBLISHED', 'REJECTED');

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "priceType" "PriceType" NOT NULL,
    "price" DOUBLE PRECISION,
    "capacity" INTEGER NOT NULL,
    "tags" TEXT[],
    "imageUrl" TEXT NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'PENDING',
    "hostId" TEXT NOT NULL,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;
