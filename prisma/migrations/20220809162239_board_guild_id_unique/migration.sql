/*
  Warnings:

  - A unique constraint covering the columns `[guildId]` on the table `Board` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Board_guildId_key" ON "Board"("guildId");
