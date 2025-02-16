-- CreateTable
CREATE TABLE "Freelancer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "oauthProvider" TEXT NOT NULL,
    "oauthProviderId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatarUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Freelancer_email_key" ON "Freelancer"("email");

-- CreateIndex
CREATE INDEX "Freelancer_email_idx" ON "Freelancer"("email");
