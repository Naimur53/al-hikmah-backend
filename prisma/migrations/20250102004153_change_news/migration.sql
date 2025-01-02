/*
  Warnings:

  - You are about to drop the `NewsLatter` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NewsLatter";

-- CreateTable
CREATE TABLE "NewsLetter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_id_key" ON "NewsLetter"("id");

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_email_key" ON "NewsLetter"("email");
