/*
  Warnings:

  - You are about to drop the column `merchant_ref` on the `payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "merchant_ref",
ADD COLUMN     "pdf_url" TEXT;
