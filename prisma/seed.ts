import { PrismaClient, Role, UserStatus, AssetStatus, RequestStatus, IncidentStatus } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Clear existing data (in order of dependencies)
    console.log('Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.incident.deleteMany();
    await prisma.approvalWorkflow.deleteMany();
    await prisma.assetRequest.deleteMany();
    await prisma.maintenanceRecord.deleteMany();
    await prisma.assetAssignment.deleteMany();
    await prisma.softwareLicense.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.assetCategoryModel.deleteMany();
    await prisma.vendor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.department.deleteMany();
    await prisma.rolePermission.deleteMany();

    // ============================================================================
    // SEED DEPARTMENTS
    // ============================================================================
    console.log('\n📁 Creating departments...');
    const departments = await Promise.all([
      prisma.department.create({
        data: {
          name: 'Engineering',
          code: 'ENG',
          description: 'Software Engineering Department',
          budget: 500000,
        },
      }),
      prisma.department.create({
        data: {
          name: 'Finance',
          code: 'FIN',
          description: 'Finance & Accounting Department',
          budget: 250000,
        },
      }),
      prisma.department.create({
        data: {
          name: 'Human Resources',
          code: 'HR',
          description: 'Human Resources Department',
          budget: 150000,
        },
      }),
      prisma.department.create({
        data: {
          name: 'Operations',
          code: 'OPS',
          description: 'Operations & Management',
          budget: 300000,
        },
      }),
      prisma.department.create({
        data: {
          name: 'Sales',
          code: 'SAL',
          description: 'Sales & Business Development',
          budget: 400000,
        },
      }),
    ]);

    console.log(`✅ Created ${departments.length} departments`);

    // ============================================================================
    // SEED VENDORS
    // ============================================================================
    console.log('\n🏢 Creating vendors...');
    const vendors = await Promise.all([
      prisma.vendor.create({
        data: {
          name: 'Dell Technologies',
          contactPerson: 'John Smith',
          email: 'sales@dell.com',
          phone: '+1-512-338-4400',
          website: 'https://www.dell.com',
          address: '1 Dell Way',
          city: 'Round Rock',
          country: 'USA',
          taxId: 'DEL123456',
          supportEmail: 'support@dell.com',
          supportPhone: '+1-800-WWW-DELL',
          slaTerms: '24/7 Support, 48-hour response time',
          paymentTerms: 'Net 30',
        },
      }),
      prisma.vendor.create({
        data: {
          name: 'HP Inc.',
          contactPerson: 'Sarah Johnson',
          email: 'sales@hp.com',
          phone: '+1-650-857-1501',
          website: 'https://www.hp.com',
          address: 'Hewlett-Packard Company',
          city: 'Palo Alto',
          country: 'USA',
          taxId: 'HP1234567',
          supportEmail: 'support@hp.com',
          supportPhone: '+1-800-HP-INVENT',
          slaTerms: '24/7 Support, Next Business Day',
          paymentTerms: 'Net 45',
        },
      }),
      prisma.vendor.create({
        data: {
          name: 'Microsoft',
          contactPerson: 'Bob Wilson',
          email: 'enterprise@microsoft.com',
          phone: '+1-425-882-8080',
          website: 'https://www.microsoft.com',
          address: 'One Microsoft Way',
          city: 'Redmond',
          country: 'USA',
          taxId: 'MSFT123',
          supportEmail: 'support@microsoft.com',
          supportPhone: '+1-800-MICROSOFT',
          slaTerms: '24/7 Premier Support',
          paymentTerms: 'Net 60',
        },
      }),
      prisma.vendor.create({
        data: {
          name: 'Apple Business',
          contactPerson: 'Emma Davis',
          email: 'business@apple.com',
          phone: '+1-408-996-1010',
          website: 'https://www.apple.com/business',
          address: 'One Apple Park Way',
          city: 'Cupertino',
          country: 'USA',
          taxId: 'APPL123',
          supportEmail: 'enterprise@apple.com',
          supportPhone: '+1-800-MY-APPLE',
          slaTerms: '24/5 Support, Next Business Day',
          paymentTerms: 'Net 30',
        },
      }),
    ]);

    console.log(`✅ Created ${vendors.length} vendors`);

    // ============================================================================
    // SEED ASSET CATEGORIES
    // ============================================================================
    console.log('\n📦 Creating asset categories...');
    const categories = await Promise.all([
      prisma.assetCategoryModel.create({
        data: {
          name: 'LAPTOP',
          description: 'Laptop computers and notebooks',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'DESKTOP',
          description: 'Desktop computers and workstations',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'SERVER',
          description: 'Server computers and infrastructure',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'MONITOR',
          description: 'Display monitors and screens',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'PRINTER',
          description: 'Printers and multifunction devices',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'NETWORKING',
          description: 'Network equipment and switches',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'MOBILE_PHONE',
          description: 'Mobile phones and smartphones',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'TABLET',
          description: 'Tablets and iPad devices',
        },
      }),
      prisma.assetCategoryModel.create({
        data: {
          name: 'PERIPHERAL',
          description: 'Peripherals and accessories',
        },
      }),
    ]);

    console.log(`✅ Created ${categories.length} asset categories`);

    // ============================================================================
    // SEED USERS
    // ============================================================================
    console.log('\n👥 Creating users...');
    const hashedPassword = await hash('password123', 10);

    const superAdmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@itam.local',
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
      },
    });

    const itAdmin = await prisma.user.create({
      data: {
        name: 'IT Administrator',
        email: 'itadmin@itam.local',
        password: hashedPassword,
        role: Role.IT_ADMIN,
        status: UserStatus.ACTIVE,
        departmentId: departments[0].id,
      },
    });

    const engManager = await prisma.user.create({
      data: {
        name: 'Engineering Manager',
        email: 'eng.manager@itam.local',
        password: hashedPassword,
        role: Role.MANAGER,
        status: UserStatus.ACTIVE,
        departmentId: departments[0].id,
      },
    });

    const finManager = await prisma.user.create({
      data: {
        name: 'Finance Manager',
        email: 'fin.manager@itam.local',
        password: hashedPassword,
        role: Role.MANAGER,
        status: UserStatus.ACTIVE,
        departmentId: departments[1].id,
      },
    });

    const employees = await Promise.all([
      prisma.user.create({
        data: {
          name: 'John Developer',
          email: 'john@itam.local',
          password: hashedPassword,
          role: Role.EMPLOYEE,
          status: UserStatus.ACTIVE,
          departmentId: departments[0].id,
          managerId: engManager.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Sarah Designer',
          email: 'sarah@itam.local',
          password: hashedPassword,
          role: Role.EMPLOYEE,
          status: UserStatus.ACTIVE,
          departmentId: departments[0].id,
          managerId: engManager.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Mike Accountant',
          email: 'mike@itam.local',
          password: hashedPassword,
          role: Role.EMPLOYEE,
          status: UserStatus.ACTIVE,
          departmentId: departments[1].id,
          managerId: finManager.id,
        },
      }),
      prisma.user.create({
        data: {
          name: 'Lisa HR',
          email: 'lisa@itam.local',
          password: hashedPassword,
          role: Role.EMPLOYEE,
          status: UserStatus.ACTIVE,
          departmentId: departments[2].id,
        },
      }),
    ]);

    console.log(`✅ Created 4 managers + ${employees.length} employees`);

    // ============================================================================
    // SEED ASSETS
    // ============================================================================
    console.log('\n💻 Creating assets...');
    const assets = await Promise.all([
      prisma.asset.create({
        data: {
          assetTag: 'LAPTOP-001',
          assetId: 'AST-2024-001',
          serialNumber: 'SN123456789',
          categoryId: 'LAPTOP',
          brand: 'Dell',
          model: 'XPS 15',
          purchaseDate: new Date('2024-01-15'),
          warrantyExpiry: new Date('2027-01-15'),
          cost: 2500,
          status: AssetStatus.ASSIGNED,
          condition: 'GOOD',
          location: 'Engineering Department, Building A',
          departmentId: departments[0].id,
          vendorId: vendors[0].id,
          createdBy: itAdmin.id,
          updatedBy: itAdmin.id,
          notes: 'High-performance development machine',
        },
      }),
      prisma.asset.create({
        data: {
          assetTag: 'LAPTOP-002',
          assetId: 'AST-2024-002',
          serialNumber: 'SN123456790',
          categoryId: 'LAPTOP',
          brand: 'HP',
          model: 'EliteBook 850',
          purchaseDate: new Date('2023-06-20'),
          warrantyExpiry: new Date('2026-06-20'),
          cost: 1800,
          status: AssetStatus.AVAILABLE,
          condition: 'EXCELLENT',
          location: 'IT Storage, Building B',
          departmentId: departments[0].id,
          vendorId: vendors[1].id,
          createdBy: itAdmin.id,
          updatedBy: itAdmin.id,
          notes: 'Backup laptop for developer team',
        },
      }),
      prisma.asset.create({
        data: {
          assetTag: 'DESKTOP-001',
          assetId: 'AST-2024-003',
          serialNumber: 'SN123456791',
          categoryId: 'DESKTOP',
          brand: 'Dell',
          model: 'OptiPlex 7090',
          purchaseDate: new Date('2023-03-10'),
          warrantyExpiry: new Date('2026-03-10'),
          cost: 1200,
          status: AssetStatus.ASSIGNED,
          condition: 'GOOD',
          location: 'Finance Department, Building A',
          departmentId: departments[1].id,
          vendorId: vendors[0].id,
          createdBy: itAdmin.id,
          updatedBy: itAdmin.id,
          notes: 'Finance team workstation',
        },
      }),
      prisma.asset.create({
        data: {
          assetTag: 'MONITOR-001',
          assetId: 'AST-2024-004',
          serialNumber: 'SN123456792',
          categoryId: 'MONITOR',
          brand: 'Dell',
          model: 'UltraSharp 27',
          purchaseDate: new Date('2024-02-01'),
          warrantyExpiry: new Date('2027-02-01'),
          cost: 450,
          status: AssetStatus.AVAILABLE,
          condition: 'EXCELLENT',
          location: 'IT Storage, Building B',
          departmentId: departments[0].id,
          vendorId: vendors[0].id,
          createdBy: itAdmin.id,
          updatedBy: itAdmin.id,
        },
      }),
      prisma.asset.create({
        data: {
          assetTag: 'PRINTER-001',
          assetId: 'AST-2024-005',
          serialNumber: 'SN123456793',
          categoryId: 'PRINTER',
          brand: 'HP',
          model: 'LaserJet Pro M479',
          purchaseDate: new Date('2023-11-15'),
          warrantyExpiry: new Date('2025-11-15'),
          cost: 600,
          status: AssetStatus.IN_MAINTENANCE,
          condition: 'FAIR',
          location: 'Finance Department, Building A',
          departmentId: departments[1].id,
          vendorId: vendors[1].id,
          createdBy: itAdmin.id,
          updatedBy: itAdmin.id,
          notes: 'Needs toner cartridge replacement',
        },
      }),
    ]);

    console.log(`✅ Created ${assets.length} assets`);

    // ============================================================================
    // SEED ASSET ASSIGNMENTS
    // ============================================================================
    console.log('\n📋 Creating asset assignments...');
    const assignments = await Promise.all([
      prisma.assetAssignment.create({
        data: {
          assetId: assets[0].id,
          userId: employees[0].id,
          notes: 'Assigned for development work',
        },
      }),
      prisma.assetAssignment.create({
        data: {
          assetId: assets[2].id,
          userId: employees[2].id,
          notes: 'Assigned to finance team',
        },
      }),
    ]);

    console.log(`✅ Created ${assignments.length} asset assignments`);

    // ============================================================================
    // SEED SOFTWARE LICENSES
    // ============================================================================
    console.log('\n📜 Creating software licenses...');
    const licenses = await Promise.all([
      prisma.softwareLicense.create({
        data: {
          softwareName: 'Microsoft Office 365',
          vendor: 'Microsoft',
          licenseKey: 'OFFICE365-KEY-001',
          licenseType: 'Per User',
          numberOfSeats: 50,
          assignedSeats: 35,
          expirationDate: new Date('2025-12-31'),
          cost: 12500,
          status: 'ACTIVE',
          vendorId: vendors[2].id,
          notes: 'Enterprise subscription',
        },
      }),
      prisma.softwareLicense.create({
        data: {
          softwareName: 'Adobe Creative Cloud',
          vendor: 'Adobe',
          licenseKey: 'ADOBE-CC-001',
          licenseType: 'Per Seat',
          numberOfSeats: 20,
          assignedSeats: 18,
          expirationDate: new Date('2025-06-30'),
          cost: 8000,
          status: 'EXPIRING_SOON',
          assetId: assets[0].id,
          notes: 'Creative team licenses',
        },
      }),
      prisma.softwareLicense.create({
        data: {
          softwareName: 'JetBrains IDE Suite',
          vendor: 'JetBrains',
          licenseKey: 'JETBRAINS-001',
          licenseType: 'Per Developer',
          numberOfSeats: 15,
          assignedSeats: 12,
          expirationDate: new Date('2024-12-31'),
          cost: 3000,
          status: 'EXPIRED',
          notes: 'Developer tools - needs renewal',
        },
      }),
    ]);

    console.log(`✅ Created ${licenses.length} software licenses`);

    // ============================================================================
    // SEED MAINTENANCE RECORDS
    // ============================================================================
    console.log('\n🔧 Creating maintenance records...');
    const maintenance = await Promise.all([
      prisma.maintenanceRecord.create({
        data: {
          assetId: assets[0].id,
          vendorId: vendors[0].id,
          maintenanceType: 'PREVENTIVE',
          status: 'SCHEDULED',
          scheduledDate: new Date('2026-06-15'),
          description: 'Quarterly preventive maintenance',
          cost: 150,
          technician: 'John Doe',
        },
      }),
      prisma.maintenanceRecord.create({
        data: {
          assetId: assets[4].id,
          vendorId: vendors[1].id,
          maintenanceType: 'CORRECTIVE',
          status: 'IN_PROGRESS',
          scheduledDate: new Date('2026-06-01'),
          description: 'Printer fixing and calibration',
          cost: 300,
          technician: 'Jane Smith',
        },
      }),
    ]);

    console.log(`✅ Created ${maintenance.length} maintenance records`);

    // ============================================================================
    // SEED ASSET REQUESTS
    // ============================================================================
    console.log('\n📨 Creating asset requests...');
    const requests = await Promise.all([
      prisma.assetRequest.create({
        data: {
          requestNumber: 'REQ-2024-001',
          requestedBy: employees[0].id,
          requestType: 'NEW_ASSET',
          assetCategoryId: 'MONITOR',
          status: RequestStatus.PENDING,
          description: 'Need additional monitor for dual setup',
          justification: 'Dual monitor setup increases productivity',
          priority: 'NORMAL',
          budget: 500,
          dueDate: new Date('2026-06-30'),
        },
      }),
      prisma.assetRequest.create({
        data: {
          requestNumber: 'REQ-2024-002',
          requestedBy: employees[1].id,
          requestType: 'REPLACEMENT',
          assetCategoryId: 'LAPTOP',
          status: RequestStatus.APPROVED_BY_MANAGER,
          description: 'Laptop needs replacement due to age',
          justification: 'Current laptop is 4 years old and running slowly',
          priority: 'HIGH',
          budget: 2000,
          approvedBy: engManager.id,
          approvalNotes: 'Approved - budget allocation available',
          dueDate: new Date('2026-07-15'),
        },
      }),
    ]);

    console.log(`✅ Created ${requests.length} asset requests`);

    // ============================================================================
    // SEED APPROVAL WORKFLOWS
    // ============================================================================
    console.log('\n✅ Creating approval workflows...');
    const workflows = await Promise.all([
      prisma.approvalWorkflow.create({
        data: {
          requestId: requests[0].id,
          stage: 'MANAGER_APPROVAL',
          approverRole: 'MANAGER',
          status: 'PENDING',
        },
      }),
      prisma.approvalWorkflow.create({
        data: {
          requestId: requests[0].id,
          stage: 'IT_ADMIN_APPROVAL',
          approverRole: 'IT_ADMIN',
          status: 'PENDING',
        },
      }),
      prisma.approvalWorkflow.create({
        data: {
          requestId: requests[1].id,
          stage: 'MANAGER_APPROVAL',
          approverRole: 'MANAGER',
          status: 'COMPLETED',
          actionDate: new Date(),
          approverNotes: 'Approved',
        },
      }),
    ]);

    console.log(`✅ Created ${workflows.length} approval workflows`);

    // ============================================================================
    // SEED INCIDENTS
    // ============================================================================
    console.log('\n⚠️ Creating incidents...');
    const incidents = await Promise.all([
      prisma.incident.create({
        data: {
          incidentNumber: 'INC-2024-001',
          title: 'Laptop not starting',
          description: 'Developer laptop fails to boot after system update',
          category: 'HARDWARE_FAILURE',
          severity: 'HIGH',
          status: IncidentStatus.IN_PROGRESS,
          reportedBy: employees[0].id,
          assetId: assets[0].id,
          assignedTo: itAdmin.id,
        },
      }),
      prisma.incident.create({
        data: {
          incidentNumber: 'INC-2024-002',
          title: 'Printer connectivity issue',
          description: 'Network printer not responding to print jobs',
          category: 'NETWORK_ISSUE',
          severity: 'MEDIUM',
          status: IncidentStatus.OPEN,
          reportedBy: employees[2].id,
          assetId: assets[4].id,
        },
      }),
      prisma.incident.create({
        data: {
          incidentNumber: 'INC-2024-003',
          title: 'Slow desktop performance',
          description: 'Finance workstation running extremely slow',
          category: 'PERFORMANCE_ISSUE',
          severity: 'MEDIUM',
          status: IncidentStatus.RESOLVED,
          reportedBy: employees[2].id,
          assetId: assets[2].id,
          assignedTo: itAdmin.id,
          resolvedBy: itAdmin.id,
          resolutionNotes: 'Cleared cache and removed malware',
          resolvedDate: new Date(),
        },
      }),
    ]);

    console.log(`✅ Created ${incidents.length} incidents`);

    // ============================================================================
    // SEED AUDIT LOGS
    // ============================================================================
    console.log('\n📊 Creating audit logs...');
    const auditLogs = await Promise.all([
      prisma.auditLog.create({
        data: {
          userId: itAdmin.id,
          action: 'CREATE',
          entityType: 'Asset',
          entityId: assets[0].id,
          description: 'Created new laptop asset',
          newValues: JSON.stringify({ assetTag: 'LAPTOP-001', brand: 'Dell' }),
        },
      }),
      prisma.auditLog.create({
        data: {
          userId: itAdmin.id,
          action: 'ASSIGN',
          entityType: 'Asset',
          entityId: assets[0].id,
          description: 'Assigned laptop to John Developer',
          newValues: JSON.stringify({ userId: employees[0].id }),
        },
      }),
    ]);

    console.log(`✅ Created ${auditLogs.length} audit logs`);

    // ============================================================================
    // SEED NOTIFICATIONS
    // ============================================================================
    console.log('\n🔔 Creating notifications...');
    const notifications = await Promise.all([
      prisma.notification.create({
        data: {
          userId: employees[0].id,
          type: 'ASSET_ASSIGNED',
          title: 'Asset Assigned',
          message: 'A new Dell XPS 15 laptop has been assigned to you',
          relatedEntityType: 'Asset',
          relatedEntityId: assets[0].id,
          status: 'UNREAD',
        },
      }),
      prisma.notification.create({
        data: {
          userId: engManager.id,
          type: 'REQUEST_APPROVED',
          title: 'Asset Request Approved',
          message: 'Your asset request for replacement laptop has been approved',
          relatedEntityType: 'AssetRequest',
          relatedEntityId: requests[1].id,
          status: 'READ',
          readAt: new Date(),
        },
      }),
      prisma.notification.create({
        data: {
          userId: itAdmin.id,
          type: 'LICENSE_EXPIRING',
          title: 'License Expiring Soon',
          message: 'Adobe Creative Cloud license expires in 30 days',
          relatedEntityType: 'SoftwareLicense',
          relatedEntityId: licenses[1].id,
          status: 'UNREAD',
        },
      }),
    ]);

    console.log(`✅ Created ${notifications.length} notifications`);

    // ============================================================================
    // SEED ROLE PERMISSIONS
    // ============================================================================
    console.log('\n🔐 Creating role permissions...');
    const permissions = await Promise.all([
      prisma.rolePermission.create({
        data: {
          role: 'SUPER_ADMIN',
          permission: 'manage_all_organizations',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'SUPER_ADMIN',
          permission: 'manage_users',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'IT_ADMIN',
          permission: 'manage_assets',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'IT_ADMIN',
          permission: 'manage_licenses',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'MANAGER',
          permission: 'approve_requests',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'MANAGER',
          permission: 'view_department_assets',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'EMPLOYEE',
          permission: 'view_assigned_assets',
        },
      }),
      prisma.rolePermission.create({
        data: {
          role: 'EMPLOYEE',
          permission: 'create_requests',
        },
      }),
    ]);

    console.log(`✅ Created ${permissions.length} role permissions`);

    console.log('\n✨ Database seeding completed successfully!\n');

    // Print demo credentials
    console.log('📝 Demo Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Super Admin:');
    console.log('   Email: admin@itam.local');
    console.log('   Password: password123');

    console.log('\n🔐 IT Administrator:');
    console.log('   Email: itadmin@itam.local');
    console.log('   Password: password123');

    console.log('\n🔐 Engineering Manager:');
    console.log('   Email: eng.manager@itam.local');
    console.log('   Password: password123');

    console.log('\n🔐 Employees:');
    console.log('   Email: john@itam.local | Password: password123');
    console.log('   Email: sarah@itam.local | Password: password123');
    console.log('   Email: mike@itam.local | Password: password123');
    console.log('   Email: lisa@itam.local | Password: password123');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Seeding Summary:');
    console.log(`   • ${departments.length} Departments`);
    console.log(`   • ${vendors.length} Vendors`);
    console.log(`   • ${categories.length} Asset Categories`);
    console.log(`   • 1 Super Admin + 4 Managers + ${employees.length} Employees`);
    console.log(`   • ${assets.length} Assets`);
    console.log(`   • ${assignments.length} Asset Assignments`);
    console.log(`   • ${licenses.length} Software Licenses`);
    console.log(`   • ${maintenance.length} Maintenance Records`);
    console.log(`   • ${requests.length} Asset Requests`);
    console.log(`   • ${workflows.length} Approval Workflows`);
    console.log(`   • ${incidents.length} Incidents`);
    console.log(`   • ${auditLogs.length} Audit Logs`);
    console.log(`   • ${notifications.length} Notifications\n`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
