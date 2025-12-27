/*
  Warnings:

  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `hosts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "username" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "fullName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- CreateIndex
CREATE UNIQUE INDEX "hosts_username_key" ON "hosts"("username");
