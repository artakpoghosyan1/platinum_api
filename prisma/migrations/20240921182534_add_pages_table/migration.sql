/*
  Warnings:

  - You are about to alter the column `content` on the `Pages` table. The data in that column could be lost. The data in that column will be cast from `LongText` to `Json`.

*/
-- AlterTable
ALTER TABLE `Pages` MODIFY `content` JSON NOT NULL;
