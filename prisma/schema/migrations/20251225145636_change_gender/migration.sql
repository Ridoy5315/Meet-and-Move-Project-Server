/*
  Warnings:

  - You are about to drop the column `gender` on the `user_basic_info` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "hosts" ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "super_admins" ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "user_basic_info" DROP COLUMN "gender";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" "Gender";
