"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDashboard } from "@/contexts/DashboardContext"

export function MonthSelector() {
  const { availableMonths, selectedMonth, setSelectedMonth } = useDashboard()

  if (availableMonths.length <= 1) return null

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedMonth || undefined} onValueChange={setSelectedMonth}>
        <SelectTrigger className="w-[180px] h-10">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month} value={month}>
              {month}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

