/*
  Warnings:

  - You are about to drop the column `order_uuid` on the `cartItems` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cartItems" DROP CONSTRAINT "cartItems_order_uuid_fkey";

-- AlterTable
ALTER TABLE "cartItems" DROP COLUMN "order_uuid";

-- CreateTable
CREATE TABLE "orderItems" (
    "uuid" TEXT NOT NULL,
    "order_uuid" TEXT NOT NULL,
    "cartItemUuid" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "orderItems_uuid_key" ON "orderItems"("uuid");

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_order_uuid_fkey" FOREIGN KEY ("order_uuid") REFERENCES "orders"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderItems" ADD CONSTRAINT "orderItems_cartItemUuid_fkey" FOREIGN KEY ("cartItemUuid") REFERENCES "cartItems"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
