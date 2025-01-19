/*
  Warnings:

  - A unique constraint covering the columns `[columnOrder]` on the table `Card` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `columnOrder` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" ADD COLUMN     "columnOrder" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Card_columnOrder_key" ON "Card"("columnOrder");
