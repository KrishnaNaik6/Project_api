-- CreateTable
CREATE TABLE "login" (
    "userid" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "Password" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phNo" INTEGER NOT NULL,

    CONSTRAINT "login_pkey" PRIMARY KEY ("userid")
);

-- CreateIndex
CREATE UNIQUE INDEX "login_userid_key" ON "login"("userid");
