/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Publisher` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Publisher_name_key" ON "Publisher"("name");
