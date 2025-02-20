"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useDashboard } from "@/contexts/DashboardContext"

const ITEMS_PER_PAGE = 5

export function PesticideUsageTable() {
  const { applications } = useDashboard()
  const [currentPage, setCurrentPage] = useState(0)

  // Show most recent applications first
  const sortedApplications = [...applications].sort((a, b) => {
    const aWeek = a.date.week
    const bWeek = b.date.week
    if (aWeek === bWeek) {
      return b.date.day - a.date.day
    }
    return bWeek - aWeek
  })

  const totalPages = Math.max(1, Math.ceil(sortedApplications.length / ITEMS_PER_PAGE))
  const startIndex = currentPage * ITEMS_PER_PAGE
  const displayedApplications = sortedApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-4">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-2 text-xs font-medium">Date</TableHead>
                <TableHead className="p-2 text-xs font-medium">Chemicals</TableHead>
                <TableHead className="p-2 text-xs font-medium">Method</TableHead>
                <TableHead className="p-2 text-xs font-medium">Bays</TableHead>
                <TableHead className="p-2 text-xs font-medium">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedApplications.map((app, index) => {
                const chemicals = [...app.sprayChemicals, ...app.fogChemicals].filter(Boolean).join(", ")
                const hasSpray = app.sprayChemicals.some(Boolean)
                const hasFog = app.fogChemicals.some(Boolean)

                let methodText = "N/A"
                if (hasSpray && hasFog) {
                  methodText = "Spray & Fog"
                } else if (hasSpray) {
                  methodText = "Spray"
                } else if (hasFog) {
                  methodText = "Fog"
                }

                return (
                  <TableRow key={index} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="p-2 text-xs whitespace-nowrap">{app.date.formatted}</TableCell>
                    <TableCell className="p-2 text-xs max-w-[200px] truncate">{chemicals}</TableCell>
                    <TableCell className="p-2 text-xs whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          hasFog ? "bg-secondary/20 text-secondary-foreground" : "bg-primary/20 text-primary-foreground"
                        }`}
                      >
                        {methodText}
                      </span>
                    </TableCell>
                    <TableCell className="p-2 text-xs text-center">{app.bays.count}</TableCell>
                    <TableCell className="p-2 text-xs">${app.price.toFixed(2)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-gray-500">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
            disabled={currentPage === totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

