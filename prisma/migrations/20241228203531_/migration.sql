/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Book` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "docLink" TEXT,
ADD COLUMN     "keywords" TEXT[],
ADD COLUMN     "pdfLink" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Book_name_key" ON "Book"("name");
