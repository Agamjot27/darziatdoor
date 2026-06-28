ALTER TYPE "OrderStatus" ADD VALUE IF NOT EXISTS 'cancelled';

CREATE TYPE "ReadymadeOrderStatus" AS ENUM ('placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered', 'cancelled');

ALTER TABLE "Tailor" ADD COLUMN "bio" TEXT;
ALTER TABLE "Tailor" ADD COLUMN "priceRangeMin" INTEGER;
ALTER TABLE "Tailor" ADD COLUMN "priceRangeMax" INTEGER;
ALTER TABLE "Tailor" ADD COLUMN "profilePhoto" TEXT;

CREATE TABLE "Measurement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "label" TEXT NOT NULL DEFAULT 'My Measurements',
    "chest" DOUBLE PRECISION,
    "waist" DOUBLE PRECISION,
    "hips" DOUBLE PRECISION,
    "inseam" DOUBLE PRECISION,
    "shoulder" DOUBLE PRECISION,
    "sleeve" DOUBLE PRECISION,
    "neck" DOUBLE PRECISION,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Measurement_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Order" ADD COLUMN "measurementId" INTEGER;

CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "tailorId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "images" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isOnSale" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tailorId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ReadymadeOrder" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tailorId" INTEGER NOT NULL,
    "items" JSONB NOT NULL,
    "total" INTEGER NOT NULL,
    "status" "ReadymadeOrderStatus" NOT NULL DEFAULT 'placed',
    "deliveryAddress" JSONB NOT NULL,
    "paymentId" TEXT,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "razorpayOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ReadymadeOrder_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Review" ALTER COLUMN "orderId" DROP NOT NULL;
ALTER TABLE "Review" ADD COLUMN "readymadeOrderId" INTEGER;
ALTER TABLE "Review" ADD COLUMN "orderType" TEXT NOT NULL DEFAULT 'stitching';

CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");
CREATE UNIQUE INDEX "Review_orderType_readymadeOrderId_key" ON "Review"("orderType", "readymadeOrderId");

ALTER TABLE "Measurement" ADD CONSTRAINT "Measurement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Order" ADD CONSTRAINT "Order_measurementId_fkey" FOREIGN KEY ("measurementId") REFERENCES "Measurement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Product" ADD CONSTRAINT "Product_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "Tailor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "Tailor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadymadeOrder" ADD CONSTRAINT "ReadymadeOrder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ReadymadeOrder" ADD CONSTRAINT "ReadymadeOrder_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "Tailor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_readymadeOrderId_fkey" FOREIGN KEY ("readymadeOrderId") REFERENCES "ReadymadeOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
