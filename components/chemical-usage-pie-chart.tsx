"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "@/components/ui/chart"
import { useDashboard } from "@/contexts/DashboardContext"

const COLORS = [
  "rgba(59, 130, 246, 0.7)", // blue
  "rgba(16, 185, 129, 0.7)", // green
  "rgba(245, 158, 11, 0.7)", // amber
  "rgba(239, 68, 68, 0.7)", // red
  "rgba(139, 92, 246, 0.7)", // purple
  "rgba(236, 72, 153, 0.7)", // pink
  "rgba(20, 184, 166, 0.7)", // teal
  "rgba(249, 115, 22, 0.7)", // orange
  "rgba(99, 102, 241, 0.7)", // indigo
]

interface ChemicalUsagePieChartProps {
  type: "spray" | "fog"
}

export function ChemicalUsagePieChart({ type }: ChemicalUsagePieChartProps) {
  const { applications } = useDashboard()

  // Count chemical usage based on type
  const chemicalCounts = new Map<string, number>()

  applications.forEach((app) => {
    const chemicals = type === "spray" ? app.sprayChemicals : app.fogChemicals
    chemicals
      .filter((chem): chem is string => chem !== null && chem !== "")
      .forEach((chemical) => {
        chemicalCounts.set(chemical, (chemicalCounts.get(chemical) || 0) + 1)
      })
  })

  // Convert to array and sort by usage
  const data = Array.from(chemicalCounts.entries())
    .map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-center h-[150px] text-gray-500">No {type} chemicals recorded</div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg p-4 overflow-hidden">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie data={data} cx="35%" cy="50%" labelLine={false} outerRadius={50} fill="#8884d8" dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [`${value} uses`, name]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            wrapperStyle={{
              paddingLeft: "10px",
              fontSize: "11px",
              width: "110px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

