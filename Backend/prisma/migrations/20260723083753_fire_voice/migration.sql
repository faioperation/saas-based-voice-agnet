-- AlterTable
ALTER TABLE "business_settings" ADD COLUMN     "offDays" TEXT[] DEFAULT ARRAY[]::TEXT[];
