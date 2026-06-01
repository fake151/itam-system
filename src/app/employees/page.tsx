'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Plus, Search, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { cn } from '@/lib/utils';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  department?: {
    id: string;
    name: string;
    code: string;
  };
  manager?: {
    id: string;
    name: string;
  };
  activeAssetsCount: number;
}

export default function EmployeeListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const { data: employeesResponse, isLoading } = useQuery({
    queryKey: ['employees', departmentFilter, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (departmentFilter) params.append('departmentId', departmentFilter);
      if (statusFilter) params.append('status', statusFilter);

      const res = await fetch(`/api/employees?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch employees');
      return res.json();
    },
  });

  const employees: Employee[] = employeesResponse?.data || [];

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Employees</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Manage and view employee information
            </p>
          </div>
          <Link href="/employees/create">
            <Button>
              <Plus size={18} className="mr-2" />
              Add Employee
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={18} />
              <h2 className="font-semibold">Filters</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium block mb-2">Search</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <Input
                    placeholder="Name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-950"
                >
                  <option value="">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="SUSPENDED">Suspended</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Employee List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No employees found</p>
            </Card>
          ) : (
            filteredEmployees.map((employee) => (
              <Link key={employee.id} href={`/employees/${employee.id}`}>
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-700 dark:text-primary-200">
                            {employee.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{employee.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {employee.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8 mr-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
                        <p className="font-medium">{employee.department?.name || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
                        <p className="font-medium">{employee.manager?.name || 'N/A'}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Assets</p>
                        <p className="font-medium">{employee.activeAssetsCount}</p>
                      </div>

                      <div>
                        <span
                          className={cn(
                            'text-xs font-semibold px-2 py-1 rounded-full',
                            employee.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                          )}
                        >
                          {employee.status}
                        </span>
                      </div>
                    </div>

                    <ChevronRight className="text-gray-400" size={20} />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Employees</p>
            <p className="text-2xl font-bold mt-2">{employees.length}</p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            <p className="text-2xl font-bold mt-2">
              {employees.filter((e) => e.status === 'ACTIVE').length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Inactive</p>
            <p className="text-2xl font-bold mt-2">
              {employees.filter((e) => e.status === 'INACTIVE').length}
            </p>
          </Card>

          <Card className="p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">On Leave</p>
            <p className="text-2xl font-bold mt-2">
              {employees.filter((e) => e.status === 'ON_LEAVE').length}
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
