/*
  Warnings:

  - Made the column `engine` on table `cars` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bodyType` on table `cars` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `cars` MODIFY `engine` VARCHAR(255) NOT NULL,
    MODIFY `bodyType` VARCHAR(255) NOT NULL;
