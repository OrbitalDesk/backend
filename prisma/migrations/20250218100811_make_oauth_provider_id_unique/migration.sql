/*
  Warnings:

  - A unique constraint covering the columns `[oauthProvider]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_oauthProvider_key" ON "User"("oauthProvider");
