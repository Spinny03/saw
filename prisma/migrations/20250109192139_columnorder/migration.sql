/*
  Warnings:

  - A unique constraint covering the columns `[boardOrder]` on the table `Column` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `boardOrder` to the `Column` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "boardOrder" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Column_boardOrder_key" ON "Column"("boardOrder");
