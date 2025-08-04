"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "@/components/dashboard-header";
import { OperationalMetrics } from "@/components/operational-metrics";
import { mockDataByCompany } from "@/lib/mock-data";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBarChart, RadialBar, Legend } from "recharts";

export default function OperationsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !['Company Admin', 'CEO', 'Operations Team'].includes(user.role)) {
        router.push(`/${user.company.slug}/dashboard`);
    }
  }, [user, router]);

  if (!user || !['Company Admin', 'CEO', 'Operations Team'].includes(user.role)) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading or Access Denied...</p>
        </div>
    );
  }

  const companyData = mockDataByCompany[user.company.id];

  const radialChartData = [
      { name: 'Utilization', value: companyData.operationalMetrics.utilizationRate, fill: 'var(--color-chart-1)' },
  ];

  const barChartData = [
        { name: 'Jan', value: 95 },
        { name: 'Feb', value: 96 },
        { name: 'Mar', value: 97 },
        { name: 'Apr', value: 98 },
        { name: 'May', value: 99 },
        { name: 'Jun', value: 100 },
  ]

  return (
    <>
      <DashboardHeader title="Operations Dashboard" />
      <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
        <OperationalMetrics data={companyData.operationalMetrics} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-3">
                <h3 className="text-lg font-semibold mb-4">Utilization Rate</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <RadialBarChart
                        innerRadius="80%"
                        outerRadius="100%"
                        data={radialChartData}
                        startAngle={180}
                        endAngle={0}
                    >
                        <RadialBar
                            minAngle={15}
                            label={{ position: 'insideStart', fill: '#fff' }}
                            background
                            dataKey='value'
                        />
                        <Legend iconSize={10} width={120} height={140} layout='vertical' verticalAlign='middle' align="right" />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="col-span-4">
                <h3 className="text-lg font-semibold mb-4">Project Completion Rate Trend</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={barChartData}>
                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                        <Bar dataKey="value" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </main>
    </>
  );
}
