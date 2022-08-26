/*
  Warnings:

  - Added the required column `was_bought` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "was_bought" BOOLEAN NOT NULL;
