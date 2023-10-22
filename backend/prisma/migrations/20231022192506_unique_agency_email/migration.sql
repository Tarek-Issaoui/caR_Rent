/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `agencies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "agencies_email_key" ON "agencies"("email");
