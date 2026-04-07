/*
  Warnings:

  - Made the column `registrationStartDate` on table `events` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "registrationStartDate" SET NOT NULL;
