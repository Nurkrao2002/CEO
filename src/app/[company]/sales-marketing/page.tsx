"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { DashboardHeader } from "@/components/dashboard-header";
import { SalesMarketingMetrics } from "@/components/sales-marketing-metrics";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Funnel, FunnelChart, Tooltip, LabelList } from "recharts";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SalesMarketingDataEntryForm } from "@/components/sales-marketing-data-entry-form";
import { SalesMarketingDataProvider, useSalesMarketingData } from "@/context/sales-marketing-data-context";
import { getSalesMarketingStats } from "@/lib/sales-marketing-aggregator";

function SalesMarketingDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [showDataEntry, setShowDataEntry] = useState(false);
  const { data } = useSalesMarketingData();
  const stats = getSalesMarketingStats(data);

  useEffect(() => {
    if (user && !['Company Admin', 'CEO', 'Sales & Marketing'].includes(user.role)) {
        router.push(`/${user.company.slug}/dashboard`);
    }
  }, [user, router]);

  if (!user || !['Company Admin', 'CEO', 'Sales & Marketing'].includes(user.role)) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading or Access Denied...</p>
        </div>
    );
  }

  const funnelData = [
      { name: 'Leads', value: 1200, fill: 'var(--color-chart-1)' },
      { name: 'MQLs', value: 800, fill: 'var(--color-chart-2)' },
      { name: 'SQLs', value: 500, fill: 'var(--color-chart-3)' },
      { name: 'Deals', value: 200, fill: 'var(--color-chart-4)' },
  ]

  const leadSourceData = [
      { name: 'Organic', value: 400 },
      { name: 'Referral', value: 300 },
      { name: 'Paid', value: 200 },
      { name: 'Social', value: 278 },
  ]

  return (
    <>
      <DashboardHeader
        title="Sales & Marketing Dashboard"
        description="Key metrics and analytics for sales and marketing performance."
      >
        <Button onClick={() => setShowDataEntry(!showDataEntry)}>
          <Plus className="mr-2 h-4 w-4" />
          {showDataEntry ? "Hide Form" : "Add Sales & Marketing Data"}
        </Button>
      </DashboardHeader>
      <main className="flex-1 space-y-6 p-4 sm:px-6 lg:px-8">
        {showDataEntry ? (
          <SalesMarketingDataEntryForm />
        ) : (
          <>
            <SalesMarketingMetrics data={stats} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <h3 className="text-lg font-semibold mb-4">Sales Pipeline</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <FunnelChart data={funnelData}>
                            <Tooltip />
                            <Funnel dataKey="value" nameKey="name" isAnimationActive>
                                <LabelList position="right" fill="#fff" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </div>
                <div className="col-span-3">
                    <h3 className="text-lg font-semibold mb-4">Lead Generation by Source</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={leadSourceData}>
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
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

export default function SalesMarketingDashboardPage() {
  return (
    <SalesMarketingDataProvider>
      <SalesMarketingDashboard />
    </SalesMarketingDataProvider>
  )
}
