/*
  Warnings:

  - Made the column `profilePhoto` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactNumber` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dateOfBirth` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `admins` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dateOfBirth` to the `hosts` table without a default value. This is not possible if the table is not empty.
  - Made the column `profilePhoto` on table `hosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contactNumber` on table `hosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bio` on table `hosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `hosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `hostStatus` on table `hosts` required. This step will fail if there are existing NULL values in that column.
  - Made the column `gender` on table `hosts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "profilePhoto" SET NOT NULL,
ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "dateOfBirth" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "profilePhoto" SET NOT NULL,
ALTER COLUMN "contactNumber" SET NOT NULL,
ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "hostStatus" SET NOT NULL,
ALTER COLUMN "gender" SET NOT NULL;
