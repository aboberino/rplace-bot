/*
  Warnings:

  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `bordId` on the `UserTile` table. All the data in the column will be lost.
  - Added the required column `guildBoardId` to the `UserTile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Board_guildId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Board";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "GuildBoard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "guildId" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "boardPixel" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserTile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "guildBoardId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserTile_guildBoardId_fkey" FOREIGN KEY ("guildBoardId") REFERENCES "GuildBoard" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserTile" ("color", "createdAt", "id", "updatedAt", "userId", "x", "y") SELECT "color", "createdAt", "id", "updatedAt", "userId", "x", "y" FROM "UserTile";
DROP TABLE "UserTile";
ALTER TABLE "new_UserTile" RENAME TO "UserTile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "GuildBoard_guildId_key" ON "GuildBoard"("guildId");
