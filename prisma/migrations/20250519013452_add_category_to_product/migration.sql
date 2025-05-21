/*
  Warnings:

  - Added the required column `category` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('MICROPHONES', 'MIXERS', 'PAS', 'DJ', 'HEADPHONES', 'CABLES', 'ACCESOSORIES');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "Category" NOT NULL;
