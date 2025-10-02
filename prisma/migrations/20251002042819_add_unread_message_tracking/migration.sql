-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserSeranoteRead" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "seranoteId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSeranoteRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSeranoteRead_userEmail_seranoteId_key" ON "UserSeranoteRead"("userEmail", "seranoteId");

-- AddForeignKey
ALTER TABLE "UserSeranoteRead" ADD CONSTRAINT "UserSeranoteRead_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeranoteRead" ADD CONSTRAINT "UserSeranoteRead_seranoteId_fkey" FOREIGN KEY ("seranoteId") REFERENCES "Seranote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
