/*
  Warnings:

  - You are about to drop the column `isVerified` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiry` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "isVerified",
DROP COLUMN "tokenExpiry";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "tokenExpiry" TIMESTAMP(3);
