-- CreateEnum
CREATE TYPE "EVerificationOtp" AS ENUM ('createUser', 'forgotPassword', 'deleteUser', 'adminLogin');

-- CreateTable
CREATE TABLE "VerificationOtp" (
    "id" TEXT NOT NULL,
    "type" "EVerificationOtp" NOT NULL,
    "otp" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownById" TEXT NOT NULL,

    CONSTRAINT "VerificationOtp_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerificationOtp" ADD CONSTRAINT "VerificationOtp_ownById_fkey" FOREIGN KEY ("ownById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
