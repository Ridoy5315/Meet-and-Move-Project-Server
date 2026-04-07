-- AlterEnum
ALTER TYPE "EventLifecycleStatus" ADD VALUE 'REGISTRATION_CLOSED';

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "registrationStartDate" TIMESTAMP(3);
