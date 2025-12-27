/*
  Warnings:

  - You are about to drop the column `gender` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_email_fkey";

-- DropForeignKey
ALTER TABLE "hosts" DROP CONSTRAINT "hosts_email_fkey";

-- DropForeignKey
ALTER TABLE "super_admins" DROP CONSTRAINT "super_admins_email_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_email_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "gender",
DROP COLUMN "isVerified",
DROP COLUMN "password",
DROP COLUMN "role",
DROP COLUMN "status",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "contactNumber" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "fullName" TEXT NOT NULL,
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isProfilePublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "username" TEXT;

-- DropTable
DROP TABLE "user_profiles";

-- CreateTable
CREATE TABLE "user_basic_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "gender" "Gender",
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_basic_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_basic_info_email_key" ON "user_basic_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_email_fkey" FOREIGN KEY ("email") REFERENCES "user_basic_info"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "super_admins" ADD CONSTRAINT "super_admins_email_fkey" FOREIGN KEY ("email") REFERENCES "user_basic_info"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_email_fkey" FOREIGN KEY ("email") REFERENCES "user_basic_info"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_email_fkey" FOREIGN KEY ("email") REFERENCES "user_basic_info"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
