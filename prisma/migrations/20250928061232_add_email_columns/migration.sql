/*
  Warnings:

  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Reaction` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Seranote` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Seranote` table. All the data in the column will be lost.
  - Added the required column `senderEmail` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderEmail` to the `Seranote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "Seranote" DROP CONSTRAINT "Seranote_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Seranote" DROP CONSTRAINT "Seranote_senderId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "senderId",
ADD COLUMN     "senderEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reaction" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seranote" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverEmail" TEXT,
ADD COLUMN     "senderEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Seranote" ADD CONSTRAINT "Seranote_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seranote" ADD CONSTRAINT "Seranote_receiverEmail_fkey" FOREIGN KEY ("receiverEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
