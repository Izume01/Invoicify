-- CreateEnum
CREATE TYPE "InvoiceDiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "Invoice"
ADD COLUMN "discountType" "InvoiceDiscountType" NOT NULL DEFAULT 'PERCENTAGE',
ADD COLUMN "discountRate" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0;
