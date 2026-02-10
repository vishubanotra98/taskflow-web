/*
  Warnings:

  - The `email_verified` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "verificationToken" TEXT,
DROP COLUMN "email_verified",
ADD COLUMN     "email_verified" BOOLEAN;

-- DropTable
DROP TABLE "verification_tokens";
