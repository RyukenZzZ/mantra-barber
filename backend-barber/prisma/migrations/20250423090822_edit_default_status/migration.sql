/*
  Warnings:

  - The values [pending,confirmed] on the enum `booking_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "booking_status_new" AS ENUM ('booked', 'done', 'cancelled');
ALTER TABLE "bookings" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "bookings" ALTER COLUMN "status" TYPE "booking_status_new" USING ("status"::text::"booking_status_new");
ALTER TYPE "booking_status" RENAME TO "booking_status_old";
ALTER TYPE "booking_status_new" RENAME TO "booking_status";
DROP TYPE "booking_status_old";
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'booked';
COMMIT;

-- AlterTable
ALTER TABLE "bookings" ALTER COLUMN "status" SET DEFAULT 'booked';
