/*
  Warnings:

  - You are about to drop the column `created_by` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_created_by_fkey";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "created_by";
