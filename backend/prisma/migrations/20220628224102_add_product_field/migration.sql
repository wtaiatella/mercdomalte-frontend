-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "description" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "headline" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "priceWithDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN     "slug" TEXT NOT NULL DEFAULT E'';