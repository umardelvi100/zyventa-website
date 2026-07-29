-- AlterTable
ALTER TABLE "Product" ADD COLUMN "subcategory" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "zip" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'United Arab Emirates',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "country", "createdAt", "fullName", "id", "isDefault", "label", "line1", "state", "userId", "zip") SELECT "city", "country", "createdAt", "fullName", "id", "isDefault", "label", "line1", "state", "userId", "zip" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_Seller" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "storeName" TEXT NOT NULL,
    "description" TEXT,
    "codAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "legalName" TEXT,
    "businessName" TEXT,
    "businessRegNumber" TEXT,
    "idDocumentUrl" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'pending',
    "verificationNotes" TEXT,
    "submittedAt" DATETIME,
    "reviewedAt" DATETIME,
    CONSTRAINT "Seller_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Seller" ("codAvailable", "createdAt", "description", "id", "storeName", "userId") SELECT "codAvailable", "createdAt", "description", "id", "storeName", "userId" FROM "Seller";
DROP TABLE "Seller";
ALTER TABLE "new_Seller" RENAME TO "Seller";
CREATE UNIQUE INDEX "Seller_userId_key" ON "Seller"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("createdAt", "email", "id", "name", "passwordHash") SELECT "createdAt", "email", "id", "name", "passwordHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
