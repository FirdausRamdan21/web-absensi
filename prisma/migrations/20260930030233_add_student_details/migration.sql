/*
  Warnings:

  - A unique constraint covering the columns `[nis]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `attendanceNumber` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `className` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nis` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- Add new fields as nullable first so existing students can be backfilled.
ALTER TABLE "Student" ADD COLUMN "address" TEXT,
ADD COLUMN "attendanceNumber" INTEGER,
ADD COLUMN "className" TEXT,
ADD COLUMN "nis" TEXT,
ADD COLUMN "phone" TEXT;

-- Preserve existing identity and provide deterministic values for new required fields.
WITH numbered_students AS (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "name", "id")::INTEGER AS number
  FROM "Student"
)
UPDATE "Student" AS student
SET "nis" = student."nisn",
    "className" = 'Belum diisi',
    "attendanceNumber" = numbered_students.number
FROM numbered_students
WHERE student."id" = numbered_students."id";

ALTER TABLE "Student" ALTER COLUMN "attendanceNumber" SET NOT NULL,
ALTER COLUMN "className" SET NOT NULL,
ALTER COLUMN "nis" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_nis_key" ON "Student"("nis");
