-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'tailor', 'admin');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'accepted', 'in_progress', 'completed', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'user',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tailor" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "skills" TEXT[],
    "experience" DOUBLE PRECISION,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tailor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "tailorId" INTEGER,
    "serviceType" TEXT NOT NULL,
    "garmentType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "measurements" JSONB NOT NULL,
    "fabricProfile" TEXT,
    "status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "jobType" TEXT NOT NULL DEFAULT 'standard',
    "latitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "longitude" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tailor_userId_key" ON "Tailor"("userId");

-- AddForeignKey
ALTER TABLE "Tailor" ADD CONSTRAINT "Tailor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tailorId_fkey" FOREIGN KEY ("tailorId") REFERENCES "Tailor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
