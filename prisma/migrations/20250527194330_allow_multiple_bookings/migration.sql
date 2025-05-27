/*
  Warnings:

  - Added the required column `seats` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Booking_userId_eventId_key";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "seats" INTEGER NOT NULL;
