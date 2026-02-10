-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "isVerified" TEXT,
ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
