/*
  Warnings:

  - You are about to drop the column `assetName` on the `Allocation` table. All the data in the column will be lost.
  - Added the required column `assetId` to the `Allocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Allocation` DROP COLUMN `assetName`,
    ADD COLUMN `assetId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Allocation` ADD CONSTRAINT `Allocation_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `Asset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
