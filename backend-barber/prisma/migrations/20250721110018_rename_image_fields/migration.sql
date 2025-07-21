/*
  Warnings:

  - You are about to drop the column `photo_url` on the `barbers` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `services` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "barbers" DROP COLUMN "photo_url",
ADD COLUMN     "image_barber" VARCHAR;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "image_url",
ADD COLUMN     "image_product" TEXT;

-- AlterTable
ALTER TABLE "services" DROP COLUMN "image",
ADD COLUMN     "image_service" TEXT;
