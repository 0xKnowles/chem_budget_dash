"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "@/components/ui/chart"
import { useDashboard } from "@/contexts/DashboardContext"

export function PesticideUsageChart() {
  const { monthlySpending } = useDashboard()

  // Sort the data by month
  const chartData = [...monthlySpending]
    .sort((a, b) => new Date(a.month + " 1, 2000").getTime() - new Date(b.month + " 1, 2000").getTime())
    .map((item) => ({
      month: item.month,
      "Monthly Spend": Number(item.spent.toFixed(2)),
      "Monthly Budget": Number(item.budget.toFixed(2)),
    }))

  return (
    <div className="border rounded-lg p-4 overflow-hidden">
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#6b7280" />
          <YAxis tick={{ fontSize: 11 }} stroke="#6b7280" tickFormatter={(value) => `$${value / 1000}k`} />
          <Tooltip
            formatter={(value) => [`$${Number(value).toLocaleString()}`, undefined]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="Monthly Spend" fill="rgba(59, 130, 246, 0.7)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="Monthly Budget" fill="rgba(16, 185, 129, 0.7)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

