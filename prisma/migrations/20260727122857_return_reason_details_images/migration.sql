-- AlterTable
ALTER TABLE "ReturnRequest" ADD COLUMN "details" TEXT;

-- CreateTable
CREATE TABLE "ReturnImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "returnRequestId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReturnImage_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "ReturnRequest" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
