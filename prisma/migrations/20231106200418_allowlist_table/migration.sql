-- CreateTable
CREATE TABLE "AllowList" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "adminOverride" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AllowList_pkey" PRIMARY KEY ("id")
);
