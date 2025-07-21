/*
  Warnings:

  - You are about to drop the column `tokopedia_link` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "tokopedia_link",
ADD COLUMN     "link_product" TEXT;
