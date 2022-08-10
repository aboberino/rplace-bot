/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `GuildBoard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GuildBoard_guildId_key" ON "GuildBoard"("guildId");
