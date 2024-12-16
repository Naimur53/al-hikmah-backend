/*
  Warnings:

  - Added the required column `updatedAt` to the `BookCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SubChapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookCategory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SubChapter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
