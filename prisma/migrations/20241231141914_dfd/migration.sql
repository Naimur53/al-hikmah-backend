/*
  Warnings:

  - Made the column `bookId` on table `BookPage` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "BookPage" ALTER COLUMN "bookId" SET NOT NULL;
