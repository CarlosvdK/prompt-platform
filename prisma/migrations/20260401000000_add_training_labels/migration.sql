-- CreateEnum
CREATE TYPE "TrainingLabelValue" AS ENUM ('GOOD', 'BAD');

-- CreateTable
CREATE TABLE "training_labels" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "label" "TrainingLabelValue" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "training_labels_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "training_labels_promptId_idx" ON "training_labels"("promptId");

-- CreateIndex
CREATE INDEX "training_labels_adminId_idx" ON "training_labels"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "training_labels_promptId_adminId_key" ON "training_labels"("promptId", "adminId");

-- AddForeignKey
ALTER TABLE "training_labels" ADD CONSTRAINT "training_labels_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "prompts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_labels" ADD CONSTRAINT "training_labels_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
