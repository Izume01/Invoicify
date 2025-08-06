/*
  Warnings:

  - Added the required column `description` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK', 'PAYPAL', 'CRYPTO');

-- CreateEnum
CREATE TYPE "PaymentTerms" AS ENUM ('NET30', 'NET45', 'NET60');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "bankAccountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bankSwiftCode" TEXT,
ADD COLUMN     "cryptoAddress" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod",
ADD COLUMN     "paymentTerms" "PaymentTerms",
ADD COLUMN     "paypalEmail" TEXT;

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "description" TEXT NOT NULL;
