/*
  Warnings:

  - You are about to drop the column `cart_uud` on the `cartItems` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `cartItems` table. All the data in the column will be lost.
  - You are about to drop the `orderItems` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `cart_uuid` to the `cartItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_uuid` to the `cartItems` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cartItems" DROP CONSTRAINT "cartItems_cart_uud_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_cartItemUuid_fkey";

-- DropForeignKey
ALTER TABLE "orderItems" DROP CONSTRAINT "orderItems_order_uuid_fkey";

-- AlterTable
ALTER TABLE "cartItems" DROP COLUMN "cart_uud",
DROP COLUMN "unit_price",
ADD COLUMN     "cart_uuid" TEXT NOT NULL,
ADD COLUMN     "order_uuid" TEXT NOT NULL;

-- DropTable
DROP TABLE "orderItems";

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_cart_uuid_fkey" FOREIGN KEY ("cart_uuid") REFERENCES "carts"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cartItems" ADD CONSTRAINT "cartItems_order_uuid_fkey" FOREIGN KEY ("order_uuid") REFERENCES "orders"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
