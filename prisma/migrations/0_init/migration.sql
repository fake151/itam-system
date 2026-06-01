-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'IT_ADMIN', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('AVAILABLE', 'ASSIGNED', 'IN_REPAIR', 'IN_MAINTENANCE', 'RETIRED', 'LOST', 'DISPOSED', 'DAMAGED');

-- CreateEnum
CREATE TYPE "AssetCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR');

-- CreateEnum
CREATE TYPE "AssetCategory" AS ENUM ('LAPTOP', 'DESKTOP', 'SERVER', 'MONITOR', 'PRINTER', 'NETWORKING', 'MOBILE_PHONE', 'TABLET', 'PERIPHERAL', 'OTHER');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'EXPIRING_SOON', 'SUSPENDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED_BY_MANAGER', 'APPROVED_BY_IT', 'REJECTED', 'ASSIGNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('NEW_ASSET', 'REPAIR', 'REPLACEMENT', 'UPGRADE', 'RETURN');

-- CreateEnum
CREATE TYPE "ApprovalStage" AS ENUM ('MANAGER_APPROVAL', 'IT_ADMIN_APPROVAL', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "IncidentCategory" AS ENUM ('HARDWARE_FAILURE', 'SOFTWARE_ISSUE', 'NETWORK_ISSUE', 'PERFORMANCE_ISSUE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'UNASSIGN', 'STATUS_CHANGE', 'LOGIN', 'LOGOUT', 'EXPORT');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('UNREAD', 'READ', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ASSET_ASSIGNED', 'ASSET_UNASSIGNED', 'LICENSE_EXPIRING', 'LICENSE_EXPIRED', 'MAINTENANCE_SCHEDULED', 'INCIDENT_REPORTED', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'REQUEST_ASSIGNED', 'AUDIT_ALERT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "departmentId" TEXT,
    "managerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "budget" DECIMAL(19,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetCategoryModel" (
    "id" TEXT NOT NULL,
    "name" "AssetCategory" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetCategoryModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "assetTag" TEXT NOT NULL,
    "assetId" TEXT,
    "serialNumber" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "warrantyExpiry" TIMESTAMP(3),
    "cost" DECIMAL(19,2) NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "condition" "AssetCondition" NOT NULL DEFAULT 'GOOD',
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "photoUrl" TEXT,
    "qrCodeUrl" TEXT,
    "departmentId" TEXT,
    "vendorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "lastMaintenanceDate" TIMESTAMP(3),
    "depreciationRate" DECIMAL(19,2) NOT NULL DEFAULT 15,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetAssignment" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unassignmentDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoftwareLicense" (
    "id" TEXT NOT NULL,
    "softwareName" TEXT NOT NULL,
    "vendor" TEXT NOT NULL,
    "licenseKey" TEXT NOT NULL,
    "licenseType" TEXT NOT NULL,
    "numberOfSeats" INTEGER NOT NULL,
    "assignedSeats" INTEGER NOT NULL DEFAULT 0,
    "expirationDate" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(19,2) NOT NULL,
    "renewalDate" TIMESTAMP(3),
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "vendorId" TEXT,
    "assetId" TEXT,

    CONSTRAINT "SoftwareLicense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "taxId" TEXT,
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "slaTerms" TEXT,
    "paymentTerms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "vendorId" TEXT,
    "maintenanceType" "MaintenanceType" NOT NULL DEFAULT 'PREVENTIVE',
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledDate" TIMESTAMP(3) NOT NULL,
    "completedDate" TIMESTAMP(3),
    "cost" DECIMAL(19,2),
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "technician" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssetRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "requestedBy" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL DEFAULT 'NEW_ASSET',
    "assetCategoryId" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "justification" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "budget" DECIMAL(19,2),
    "approvedBy" TEXT,
    "approvalNotes" TEXT,
    "assignedBy" TEXT,
    "assetId" TEXT,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AssetRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalWorkflow" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "stage" "ApprovalStage" NOT NULL DEFAULT 'MANAGER_APPROVAL',
    "approverRole" "Role" NOT NULL,
    "approverNotes" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "actionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalWorkflow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "IncidentCategory" NOT NULL DEFAULT 'HARDWARE_FAILURE',
    "severity" "IncidentSeverity" NOT NULL DEFAULT 'MEDIUM',
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "reportedBy" TEXT NOT NULL,
    "assetId" TEXT,
    "assignedTo" TEXT,
    "resolvedBy" TEXT,
    "resolutionNotes" TEXT,
    "reportedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValues" TEXT,
    "newValues" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "status" "NotificationStatus" NOT NULL DEFAULT 'UNREAD',
    "actionUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_departmentId_idx" ON "User"("departmentId");

-- CreateIndex
CREATE INDEX "User_managerId_idx" ON "User"("managerId");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE INDEX "Department_parentId_idx" ON "Department"("parentId");

-- CreateIndex
CREATE INDEX "Department_deletedAt_idx" ON "Department"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AssetCategoryModel_name_key" ON "AssetCategoryModel"("name");

-- CreateIndex
CREATE INDEX "AssetCategoryModel_deletedAt_idx" ON "AssetCategoryModel"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetTag_key" ON "Asset"("assetTag");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_assetId_key" ON "Asset"("assetId");

-- CreateIndex
CREATE UNIQUE INDEX "Asset_serialNumber_key" ON "Asset"("serialNumber");

-- CreateIndex
CREATE INDEX "Asset_assetTag_idx" ON "Asset"("assetTag");

-- CreateIndex
CREATE INDEX "Asset_serialNumber_idx" ON "Asset"("serialNumber");

-- CreateIndex
CREATE INDEX "Asset_categoryId_idx" ON "Asset"("categoryId");

-- CreateIndex
CREATE INDEX "Asset_status_idx" ON "Asset"("status");

-- CreateIndex
CREATE INDEX "Asset_departmentId_idx" ON "Asset"("departmentId");

-- CreateIndex
CREATE INDEX "Asset_vendorId_idx" ON "Asset"("vendorId");

-- CreateIndex
CREATE INDEX "Asset_deletedAt_idx" ON "Asset"("deletedAt");

-- CreateIndex
CREATE INDEX "Asset_createdBy_idx" ON "Asset"("createdBy");

-- CreateIndex
CREATE INDEX "Asset_updatedBy_idx" ON "Asset"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "AssetAssignment_assetId_userId_unassignmentDate_key" ON "AssetAssignment"("assetId", "userId", "unassignmentDate");

-- CreateIndex
CREATE INDEX "AssetAssignment_assetId_idx" ON "AssetAssignment"("assetId");

-- CreateIndex
CREATE INDEX "AssetAssignment_userId_idx" ON "AssetAssignment"("userId");

-- CreateIndex
CREATE INDEX "AssetAssignment_assignmentDate_idx" ON "AssetAssignment"("assignmentDate");

-- CreateIndex
CREATE INDEX "AssetAssignment_deletedAt_idx" ON "AssetAssignment"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SoftwareLicense_licenseKey_key" ON "SoftwareLicense"("licenseKey");

-- CreateIndex
CREATE INDEX "SoftwareLicense_softwareName_idx" ON "SoftwareLicense"("softwareName");

-- CreateIndex
CREATE INDEX "SoftwareLicense_licenseKey_idx" ON "SoftwareLicense"("licenseKey");

-- CreateIndex
CREATE INDEX "SoftwareLicense_expirationDate_idx" ON "SoftwareLicense"("expirationDate");

-- CreateIndex
CREATE INDEX "SoftwareLicense_status_idx" ON "SoftwareLicense"("status");

-- CreateIndex
CREATE INDEX "SoftwareLicense_vendorId_idx" ON "SoftwareLicense"("vendorId");

-- CreateIndex
CREATE INDEX "SoftwareLicense_assetId_idx" ON "SoftwareLicense"("assetId");

-- CreateIndex
CREATE INDEX "SoftwareLicense_deletedAt_idx" ON "SoftwareLicense"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE INDEX "Vendor_name_idx" ON "Vendor"("name");

-- CreateIndex
CREATE INDEX "Vendor_email_idx" ON "Vendor"("email");

-- CreateIndex
CREATE INDEX "Vendor_deletedAt_idx" ON "Vendor"("deletedAt");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_assetId_idx" ON "MaintenanceRecord"("assetId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_status_idx" ON "MaintenanceRecord"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_scheduledDate_idx" ON "MaintenanceRecord"("scheduledDate");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_vendorId_idx" ON "MaintenanceRecord"("vendorId");

-- CreateIndex
CREATE INDEX "MaintenanceRecord_deletedAt_idx" ON "MaintenanceRecord"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AssetRequest_requestNumber_key" ON "AssetRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "AssetRequest_requestNumber_idx" ON "AssetRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "AssetRequest_requestedBy_idx" ON "AssetRequest"("requestedBy");

-- CreateIndex
CREATE INDEX "AssetRequest_status_idx" ON "AssetRequest"("status");

-- CreateIndex
CREATE INDEX "AssetRequest_approvedBy_idx" ON "AssetRequest"("approvedBy");

-- CreateIndex
CREATE INDEX "AssetRequest_departmentId_idx" ON "AssetRequest"("departmentId");

-- CreateIndex
CREATE INDEX "AssetRequest_createdAt_idx" ON "AssetRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AssetRequest_deletedAt_idx" ON "AssetRequest"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalWorkflow_requestId_stage_key" ON "ApprovalWorkflow"("requestId", "stage");

-- CreateIndex
CREATE INDEX "ApprovalWorkflow_requestId_idx" ON "ApprovalWorkflow"("requestId");

-- CreateIndex
CREATE INDEX "ApprovalWorkflow_stage_idx" ON "ApprovalWorkflow"("stage");

-- CreateIndex
CREATE INDEX "ApprovalWorkflow_approverRole_idx" ON "ApprovalWorkflow"("approverRole");

-- CreateIndex
CREATE UNIQUE INDEX "Incident_incidentNumber_key" ON "Incident"("incidentNumber");

-- CreateIndex
CREATE INDEX "Incident_incidentNumber_idx" ON "Incident"("incidentNumber");

-- CreateIndex
CREATE INDEX "Incident_status_idx" ON "Incident"("status");

-- CreateIndex
CREATE INDEX "Incident_severity_idx" ON "Incident"("severity");

-- CreateIndex
CREATE INDEX "Incident_reportedBy_idx" ON "Incident"("reportedBy");

-- CreateIndex
CREATE INDEX "Incident_assetId_idx" ON "Incident"("assetId");

-- CreateIndex
CREATE INDEX "Incident_assignedTo_idx" ON "Incident"("assignedTo");

-- CreateIndex
CREATE INDEX "Incident_createdAt_idx" ON "Incident"("createdAt");

-- CreateIndex
CREATE INDEX "Incident_deletedAt_idx" ON "Incident"("deletedAt");

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_idx" ON "AuditLog"("entityType");

-- CreateIndex
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_status_idx" ON "Notification"("status");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_deletedAt_idx" ON "Notification"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_provider_account_id_key" ON "Account"("provider", "provider_account_id");

-- CreateIndex
CREATE INDEX "Account_user_id_idx" ON "Account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_token_key" ON "Session"("session_token");

-- CreateIndex
CREATE INDEX "Session_user_id_idx" ON "Session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_role_permission_key" ON "RolePermission"("role", "permission");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AssetCategoryModel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetAssignment" ADD CONSTRAINT "AssetAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareLicense" ADD CONSTRAINT "SoftwareLicense_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoftwareLicense" ADD CONSTRAINT "SoftwareLicense_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRequest" ADD CONSTRAINT "AssetRequest_requestedBy_fkey" FOREIGN KEY ("requestedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRequest" ADD CONSTRAINT "AssetRequest_approvedBy_fkey" FOREIGN KEY ("approvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssetRequest" ADD CONSTRAINT "AssetRequest_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalWorkflow" ADD CONSTRAINT "ApprovalWorkflow_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "AssetRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_resolvedBy_fkey" FOREIGN KEY ("resolvedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_entityId_fkey" FOREIGN KEY ("entityId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
