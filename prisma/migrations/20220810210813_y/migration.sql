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
    CONSTRAINT "UserTile_guildBoardId_fkey" FOREIGN KEY ("guildBoardId") REFERENCES "GuildBoard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserTile" ("color", "createdAt", "guildBoardId", "id", "updatedAt", "userId", "x", "y") SELECT "color", "createdAt", "guildBoardId", "id", "updatedAt", "userId", "x", "y" FROM "UserTile";
DROP TABLE "UserTile";
ALTER TABLE "new_UserTile" RENAME TO "UserTile";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
