-- CreateTable
CREATE TABLE "session" (
    "userid" INTEGER NOT NULL,
    "refreshToken" VARCHAR NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "session_refreshToken_key" ON "session"("refreshToken");
