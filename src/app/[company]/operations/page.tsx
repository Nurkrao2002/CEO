"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "@/components/dashboard-header";
import { OperationalMetrics } from "@/components/operational-metrics";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, RadialBarChart, RadialBar, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { OperationsDataEntryForm } from "@/components/operations-data-entry-form";
import { OperationsDataProvider, useOperationsData } from "@/context/operations-data-context";
import { useFinancialData } from "@/context/financial-data-context";
import { getOperationsStats } from "@/lib/operations-aggregator";

function OperationsDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDataEntry, setShowDataEntry] = useState(false);
  const { data: operationsData } = useOperationsData();
  const { data: financialData } = useFinancialData();
  const stats = getOperationsStats(operationsData, financialData);

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

  const radialChartData = [
      { name: 'Utilization', value: stats.utilizationRate, fill: 'var(--color-chart-1)' },
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
      <DashboardHeader title="Operations Dashboard">
        <Button onClick={() => setShowDataEntry(!showDataEntry)}>
          <Plus className="mr-2 h-4 w-4" />
          {showDataEntry ? "Hide Form" : "Add Operations Data"}
        </Button>
      </DashboardHeader>
      <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
        {showDataEntry ? (
          <OperationsDataEntryForm />
        ) : (
          <>
            <OperationalMetrics data={stats} />
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
          </>
        )}
      </main>
    </>
  );
}

export default function OperationsPage() {
  return (
    <OperationsDataProvider>
      <OperationsDashboard />
    </OperationsDataProvider>
  )
}
