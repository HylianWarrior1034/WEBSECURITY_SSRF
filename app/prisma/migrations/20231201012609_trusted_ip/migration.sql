/*
  Warnings:

  - You are about to drop the column `adminOverride` on the `AllowList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AllowList" DROP COLUMN "adminOverride",
ADD COLUMN     "trustedIp" BOOLEAN NOT NULL DEFAULT false;
