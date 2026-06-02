-- Add assignment workflow fields to Asset and create AssetAssignmentRequest table

-- AlterTable Asset - add status tracking fields
ALTER TABLE "Asset" ADD COLUMN "assignmentStatus" TEXT DEFAULT 'UNASSIGNED';
ALTER TABLE "Asset" ADD COLUMN "lastAssignmentDate" TIMESTAMP(3);
ALTER TABLE "Asset" ADD COLUMN "lastAssignmentBy" TEXT;

-- CreateEnum for assignment request status
CREATE TYPE "AssignmentRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum for assignment action type
CREATE TYPE "AssignmentActionType" AS ENUM ('ASSIGN', 'RETURN', 'TRANSFER');

-- CreateTable AssetAssignmentRequest
CREATE TABLE "AssetAssignmentRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "currentUserId" TEXT,
    "requestedUserId" TEXT NOT NULL,
    "actionType" "AssignmentActionType" NOT NULL DEFAULT 'ASSIGN',
    "status" "AssignmentRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "approverNotes" TEXT,
    "approvedBy" TEXT,
    "rejectedBy" TEXT,
    "rejectionReason" TEXT,
    "completedAt" TIMESTAMP(3),
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetAssignmentRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable AssetAssignmentTimeline
CREATE TABLE "AssetAssignmentTimeline" (
    "id" TEXT NOT NULL,
    "assetAssignmentId" TEXT NOT NULL,
    "action" "AssignmentActionType" NOT NULL,
    "description" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "previousUserId" TEXT,
    "newUserId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssetAssignmentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for AssetAssignmentRequest
CREATE UNIQUE INDEX "AssetAssignmentRequest_requestNumber_key" ON "AssetAssignmentRequest"("requestNumber");
CREATE INDEX "AssetAssignmentRequest_requestNumber_idx" ON "AssetAssignmentRequest"("requestNumber");
CREATE INDEX "AssetAssignmentRequest_assetId_idx" ON "AssetAssignmentRequest"("assetId");
CREATE INDEX "AssetAssignmentRequest_requestedUserId_idx" ON "AssetAssignmentRequest"("requestedUserId");
CREATE INDEX "AssetAssignmentRequest_currentUserId_idx" ON "AssetAssignmentRequest"("currentUserId");
CREATE INDEX "AssetAssignmentRequest_status_idx" ON "AssetAssignmentRequest"("status");
CREATE INDEX "AssetAssignmentRequest_actionType_idx" ON "AssetAssignmentRequest"("actionType");
CREATE INDEX "AssetAssignmentRequest_createdAt_idx" ON "AssetAssignmentRequest"("createdAt");
CREATE INDEX "AssetAssignmentRequest_deletedAt_idx" ON "AssetAssignmentRequest"("deletedAt");

-- CreateIndex for AssetAssignmentTimeline
CREATE INDEX "AssetAssignmentTimeline_assetAssignmentId_idx" ON "AssetAssignmentTimeline"("assetAssignmentId");
CREATE INDEX "AssetAssignmentTimeline_action_idx" ON "AssetAssignmentTimeline"("action");
CREATE INDEX "AssetAssignmentTimeline_performedBy_idx" ON "AssetAssignmentTimeline"("performedBy");
CREATE INDEX "AssetAssignmentTimeline_createdAt_idx" ON "AssetAssignmentTimeline"("createdAt");

-- AddForeignKey for AssetAssignmentRequest
ALTER TABLE "AssetAssignmentRequest" ADD CONSTRAINT "AssetAssignmentRequest_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssetAssignmentRequest" ADD CONSTRAINT "AssetAssignmentRequest_currentUserId_fkey" FOREIGN KEY ("currentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssetAssignmentRequest" ADD CONSTRAINT "AssetAssignmentRequest_requestedUserId_fkey" FOREIGN KEY ("requestedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AssetAssignmentRequest" ADD CONSTRAINT "AssetAssignmentRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssetAssignmentRequest" ADD CONSTRAINT "AssetAssignmentRequest_rejectedBy_fkey" FOREIGN KEY ("rejectedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey for AssetAssignmentTimeline
ALTER TABLE "AssetAssignmentTimeline" ADD CONSTRAINT "AssetAssignmentTimeline_assetAssignmentId_fkey" FOREIGN KEY ("assetAssignmentId") REFERENCES "AssetAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssetAssignmentTimeline" ADD CONSTRAINT "AssetAssignmentTimeline_performedBy_fkey" FOREIGN KEY ("performedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
