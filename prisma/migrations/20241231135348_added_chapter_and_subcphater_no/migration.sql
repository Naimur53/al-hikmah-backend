/*
  Warnings:

  - Added the required column `chapterNo` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subChapterNo` to the `SubChapter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "chapterNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubChapter" ADD COLUMN     "subChapterNo" INTEGER NOT NULL;
