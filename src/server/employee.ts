'use server';

import { db } from '@/lib/db';
import { User, UserStatus, Role } from '@prisma/client';

export async function getEmployees(filters?: {
  departmentId?: string;
  status?: UserStatus;
  role?: Role;
}) {
  try {
    const employees = await db.user.findMany({
      where: {
        role: Role.EMPLOYEE,
        deletedAt: null,
        ...(filters?.departmentId && { departmentId: filters.departmentId }),
        ...(filters?.status && { status: filters.status }),
      },
      include: {
        department: true,
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            name: true,
          },
        },
        assignedAssets: {
          include: {
            asset: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: employees };
  } catch (error) {
    console.error('Error fetching employees:', error);
    return { success: false, error: 'Failed to fetch employees' };
  }
}

export async function getEmployeeById(id: string) {
  try {
    const employee = await db.user.findUnique({
      where: { id },
      include: {
        department: true,
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            position: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAssets: {
          include: {
            asset: {
              include: {
                department: true,
                vendor: true,
              },
            },
          },
          orderBy: {
            assignmentDate: 'desc',
          },
        },
        createdAssets: {
          select: {
            id: true,
            assetTag: true,
            brand: true,
            model: true,
          },
        },
      },
    });

    if (!employee || employee.deletedAt) {
      return { success: false, error: 'Employee not found' };
    }

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error fetching employee:', error);
    return { success: false, error: 'Failed to fetch employee' };
  }
}

export async function createEmployee(data: {
  name: string;
  email: string;
  departmentId: string;
  position?: string;
  managerId?: string;
  password: string;
}) {
  try {
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already exists' };
    }

    const { hash } = await import('bcryptjs');
    const hashedPassword = await hash(data.password, 10);

    const employee = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: Role.EMPLOYEE,
        status: UserStatus.ACTIVE,
        departmentId: data.departmentId,
        managerId: data.managerId,
        image: null,
      },
      include: {
        department: true,
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error creating employee:', error);
    return { success: false, error: 'Failed to create employee' };
  }
}

export async function updateEmployee(
  id: string,
  data: {
    name?: string;
    email?: string;
    departmentId?: string;
    managerId?: string | null;
    status?: UserStatus;
  }
) {
  try {
    if (data.email) {
      const existingUser = await db.user.findFirst({
        where: {
          email: data.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        return { success: false, error: 'Email already exists' };
      }
    }

    const employee = await db.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.departmentId && { departmentId: data.departmentId }),
        ...(data.managerId !== undefined && { managerId: data.managerId }),
        ...(data.status && { status: data.status }),
        updatedAt: new Date(),
      },
      include: {
        department: true,
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error updating employee:', error);
    return { success: false, error: 'Failed to update employee' };
  }
}

export async function deleteEmployee(id: string) {
  try {
    const employee = await db.user.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: UserStatus.INACTIVE,
      },
    });

    return { success: true, data: employee };
  } catch (error) {
    console.error('Error deleting employee:', error);
    return { success: false, error: 'Failed to delete employee' };
  }
}

export async function getEmployeeAssetHistory(employeeId: string) {
  try {
    const assignments = await db.assetAssignment.findMany({
      where: {
        userId: employeeId,
        deletedAt: null,
      },
      include: {
        asset: {
          include: {
            department: true,
            vendor: true,
            incidents: {
              where: { deletedAt: null },
              orderBy: { reportedDate: 'desc' },
            },
            maintenanceRecords: {
              where: { deletedAt: null },
              orderBy: { scheduledDate: 'desc' },
            },
          },
        },
      },
      orderBy: {
        assignmentDate: 'desc',
      },
    });

    return { success: true, data: assignments };
  } catch (error) {
    console.error('Error fetching asset history:', error);
    return { success: false, error: 'Failed to fetch asset history' };
  }
}

export async function getEmployeeDashboardStats(employeeId: string) {
  try {
    const employee = await db.user.findUnique({
      where: { id: employeeId },
      include: {
        assignedAssets: {
          where: {
            unassignmentDate: null,
            deletedAt: null,
          },
        },
      },
    });

    if (!employee) {
      return { success: false, error: 'Employee not found' };
    }

    const activeAssets = employee.assignedAssets.length;

    const incidents = await db.incident.findMany({
      where: {
        reportedBy: employeeId,
        deletedAt: null,
      },
    });

    const openIncidents = incidents.filter(
      (i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED'
    ).length;

    const requests = await db.assetRequest.findMany({
      where: {
        requestedBy: employeeId,
        deletedAt: null,
      },
    });

    const pendingRequests = requests.filter(
      (r) => r.status === 'PENDING' || r.status === 'APPROVED_BY_MANAGER'
    ).length;

    return {
      success: true,
      data: {
        activeAssets,
        openIncidents,
        pendingRequests,
        totalIncidents: incidents.length,
        totalRequests: requests.length,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}
