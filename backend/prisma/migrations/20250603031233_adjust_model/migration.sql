/*
  Warnings:

  - You are about to drop the column `clientId` on the `Asset` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Asset` DROP FOREIGN KEY `Asset_clientId_fkey`;

-- DropIndex
DROP INDEX `Asset_clientId_fkey` ON `Asset`;

-- AlterTable
ALTER TABLE `Asset` DROP COLUMN `clientId`;
