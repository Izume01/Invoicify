/*
  Warnings:

  - Added the required column `ClientAddress` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClientEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ClientName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FromAddress` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FromEmail` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FromName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invoiceName` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CurrencySupported" AS ENUM ('USD', 'EUR', 'GBP', 'INR');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "ClientAddress" TEXT NOT NULL,
ADD COLUMN     "ClientEmail" TEXT NOT NULL,
ADD COLUMN     "ClientName" TEXT NOT NULL,
ADD COLUMN     "FromAddress" TEXT NOT NULL,
ADD COLUMN     "FromEmail" TEXT NOT NULL,
ADD COLUMN     "FromName" TEXT NOT NULL,
ADD COLUMN     "currency" "CurrencySupported" NOT NULL,
ADD COLUMN     "invoiceName" TEXT NOT NULL;
