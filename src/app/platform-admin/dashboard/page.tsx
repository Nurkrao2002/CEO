"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { StatCard } from "@/components/stat-card";
import { mockUsers } from "@/lib/mock-users";
import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function PlatformAdminDashboardPage() {
  const platformMetrics = useMemo(() => {
    const companies = new Set(mockUsers.filter(u => u.company.id !== 'platform').map(u => u.company.id));
    const totalUsers = mockUsers.filter(u => u.company.id !== 'platform').length;
    const subscriptions = {
        free: 0,
        paid: 0,
    };
    companies.forEach(c => {
        // In a real app, this would come from the company document
        subscriptions.free += 1;
    });

    return {
        totalCompanies: companies.size,
        totalUsers,
        subscriptions,
    }
  }, []);

  const subscriptionChartData = [
      { name: 'Free', value: platformMetrics.subscriptions.free },
      { name: 'Paid', value: platformMetrics.subscriptions.paid },
  ]

  return (
    <>
      <DashboardHeader
        title="Platform Dashboard"
        description="An overview of the entire platform."
      />
      <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Total Companies" value={platformMetrics.totalCompanies} />
            <StatCard title="Total Users" value={platformMetrics.totalUsers} />
            <StatCard title="Active Subscriptions" value={platformMetrics.subscriptions.free + platformMetrics.subscriptions.paid} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4">
                <h3 className="text-lg font-semibold mb-4">Subscription Plan Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={subscriptionChartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>
    </>
  );
}
