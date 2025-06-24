/*
  Warnings:

  - You are about to drop the column `dateRange` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `items` on the `Quote` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "dateRange",
DROP COLUMN "items",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "products" TEXT[],
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "enum" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);
