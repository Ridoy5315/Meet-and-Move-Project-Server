/*
  Warnings:

  - You are about to drop the column `location` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "location",
ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "location",
ADD COLUMN     "address" TEXT;
