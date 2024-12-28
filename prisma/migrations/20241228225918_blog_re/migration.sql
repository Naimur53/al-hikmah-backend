/*
  Warnings:

  - The `status` column on the `Blog` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `content` to the `Blog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EBlogStatus" AS ENUM ('approved', 'pending', 'denied');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "thumbnail" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "EBlogStatus" NOT NULL DEFAULT 'pending';
