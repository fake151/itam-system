import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { UserStatus, Role } from '@prisma/client';
import { hash } from 'bcryptjs';
import { z } from 'zod';

const CreateEmployeeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  departmentId: z.string().min(1, 'Department is required'),
  position: z.string().optional(),
  managerId: z.string().optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const UpdateEmployeeSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  departmentId: z.string().optional(),
  position: z.string().optional(),
  managerId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'ON_LEAVE']).optional(),
});

// GET /api/employees
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only IT Admin and Super Admin can view all employees
    if (session.user.role !== Role.IT_ADMIN && session.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const status = searchParams.get('status');

    const employees = await db.user.findMany({
      where: {
        role: Role.EMPLOYEE,
        deletedAt: null,
        ...(departmentId && { departmentId }),
        ...(status && { status: status as UserStatus }),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assignedAssets: {
          where: {
            unassignmentDate: null,
            deletedAt: null,
          },
          select: {
            assetId: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: employees.map((emp) => ({
        ...emp,
        activeAssetsCount: emp.assignedAssets.length,
        assignedAssets: undefined,
      })),
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST /api/employees
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== Role.IT_ADMIN && session.user.role !== Role.SUPER_ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = CreateEmployeeSchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(validatedData.password, 10);

    const employee = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: Role.EMPLOYEE,
        status: UserStatus.ACTIVE,
        departmentId: validatedData.departmentId,
        managerId: validatedData.managerId || null,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: employee,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: 'Failed to create employee' },
      { status: 500 }
    );
  }
}
