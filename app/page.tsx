"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PesticideUsageChart } from "@/components/pesticide-usage-chart"
import { PesticideUsageTable } from "@/components/pesticide-usage-table"
import { ArrowTrendingUpIcon, BeakerIcon, SprayCanIcon, StarIcon, SquareIcon, DollarSignIcon } from "@/components/icons"
import { useDashboard } from "@/contexts/DashboardContext"
import { ChemicalUsagePieChart } from "@/components/chemical-usage-pie-chart"
import { DataInputButtons } from "@/components/data-input-buttons"
import { MonthSelector } from "@/components/month-selector"
import { WelcomeModal } from "@/components/welcome-modal"
import { GenerateReport } from "@/components/generate-report"

export default function DashboardPage() {
  const { totalUsage, mostUsedChemicals, monthlySpending, totalAreaTreated, averagePricePerAcre, averagePricePerBay } =
    useDashboard()
  const latestMonthData = monthlySpending[0] || { month: "No Data", spent: 0, budget: 0 }

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeModal />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col items-center justify-center w-full bg-white p-4 md:p-6 rounded-lg shadow-md mb-6 space-y-4">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Spray Application Dashboard
          </h1>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <DataInputButtons />
            <MonthSelector />
            <GenerateReport />
          </div>
        </div>

        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">Latest Monthly Budget Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-sm text-gray-600">Month</p>
                <p className="text-2xl font-bold text-gray-800">{latestMonthData.month}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Budget</p>
                <p className="text-2xl font-bold text-gray-800">${latestMonthData.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Spent This Month</p>
                <p className="text-2xl font-bold text-gray-800">${latestMonthData.spent.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remaining Budget</p>
                <p
                  className={`text-2xl font-bold ${
                    latestMonthData.budget - latestMonthData.spent < 0
                      ? "text-rose-700"
                      : (latestMonthData.budget - latestMonthData.spent) / latestMonthData.budget < 0.15
                        ? "text-amber-600"
                        : "text-emerald-700"
                  }`}
                >
                  ${(latestMonthData.budget - latestMonthData.spent).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              icon={<ArrowTrendingUpIcon className="w-6 h-6 text-blue-400" />}
              title="Total Applications"
              value={totalUsage.sprayCount + totalUsage.fogCount}
              subtext={`${totalUsage.sprayCount} sprays, ${totalUsage.fogCount} fogs`}
            />
            <StatCard
              icon={<SprayCanIcon className="w-6 h-6 text-green-400" />}
              title="Total Bays Treated"
              value={totalUsage.totalBays}
              subtext={`${totalUsage.fullRangeApplications} full range applications`}
            />
            <StatCard
              icon={<SquareIcon className="w-6 h-6 text-indigo-400" />}
              title="Total Area Treated"
              value={`${totalAreaTreated.acres.toFixed(2)} acres`}
              subtext={`${totalAreaTreated.squareMeters.toLocaleString()} m²`}
            />
            <StatCard
              icon={<BeakerIcon className="w-6 h-6 text-purple-400" />}
              title="Most Used Chemicals"
              value={
                <div className="space-y-1">
                  <div className="text-lg flex justify-between">
                    <span>{mostUsedChemicals[0]?.chemical || "N/A"}</span>
                    <span className="text-purple-600">{mostUsedChemicals[0]?.count || 0}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>{mostUsedChemicals[1]?.chemical || "N/A"}</span>
                    <span>{mostUsedChemicals[1]?.count || 0}</span>
                  </div>
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>{mostUsedChemicals[2]?.chemical || "N/A"}</span>
                    <span>{mostUsedChemicals[2]?.count || 0}</span>
                  </div>
                </div>
              }
              subtext="Total uses shown"
            />
            <StatCard
              icon={<StarIcon className="w-6 h-6 text-yellow-400" />}
              title="Total Spending"
              value={`$${latestMonthData.spent.toLocaleString()}`}
              subtext="Spent this month"
            />
            <StatCard
              icon={<DollarSignIcon className="w-6 h-6 text-red-400" />}
              title="Average Price per Bay"
              value={`$${averagePricePerBay.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtext="Cost per bay treated"
            />
          </div>

          <div className="space-y-6">
            <ChartCard title="Recent Applications">
              <div className="overflow-auto">
                <PesticideUsageTable />
              </div>
            </ChartCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Monthly Spending vs Budget">
                <div className="overflow-hidden">
                  <PesticideUsageChart />
                </div>
              </ChartCard>
              <div className="space-y-6">
                <ChartCard title="Spray Chemical Usage">
                  <div className="overflow-hidden">
                    <ChemicalUsagePieChart type="spray" />
                  </div>
                </ChartCard>
                <ChartCard title="Fog Chemical Usage">
                  <div className="overflow-hidden">
                    <ChemicalUsagePieChart type="fog" />
                  </div>
                </ChartCard>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, subtext }) {
  return (
    <Card className="bg-white/50 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow rounded-xl border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="p-2 bg-gray-50/50 rounded-lg">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="font-bold text-gray-800">{value}</div>
        <div className="mt-1 text-gray-400">{subtext}</div>
      </CardContent>
    </Card>
  )
}

function ChartCard({ title, children }) {
  return (
    <Card className="bg-gradient-to-br from-white to-gray-50/50 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

