/*
  Warnings:

  - You are about to drop the column `payment_url` on the `payments` table. All the data in the column will be lost.

*/
-- AlterEnum
ALTER TYPE "booking_status" ADD VALUE 'expired';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "payment_url",
ADD COLUMN     "snap_token" TEXT,
ADD COLUMN     "snap_url" TEXT;
