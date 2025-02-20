"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Table, AlertCircle } from "lucide-react"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] h-[calc(100vh-2rem)] sm:h-auto overflow-hidden flex flex-col">
        <DialogHeader className="px-2 sm:px-6">
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center mb-2">
            Welcome to the Spray Application Dashboard
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Track your chemical applications and budget management effectively
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 sm:px-6">
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Excel File Requirements</h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Your Excel file must have these exact column headers in Row 1:
                </p>
                <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs bg-gray-50 p-2 sm:p-3 rounded-md mb-2">
                  <ul className="space-y-0.5 sm:space-y-1 text-gray-600">
                    <li>• Spray Chem 1</li>
                    <li>• Spray Chem 2</li>
                    <li>• Spray Chem 3</li>
                    <li>• Fog Chem 1</li>
                    <li>• Fog Chem 2</li>
                    <li>• Fog Chem 3</li>
                  </ul>
                  <ul className="space-y-0.5 sm:space-y-1 text-gray-600">
                    <li>• Date</li>
                    <li>• Bays</li>
                    <li>• Price</li>
                    <li>• Monthly Budget</li>
                    <li>• Month</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-amber-50 rounded-lg shrink-0">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Important Formatting Rules</h3>
                <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-500">
                  <li>• Create a separate sheet for each month (e.g., "January", "February")</li>
                  <li>• Dates must be in Week-Day format (e.g., "5-7" for Week 5, Day 7)</li>
                  <li>• Enter chemical names exactly as they appear in your records</li>
                  <li>• Leave cells empty for unused chemical slots (don't use "N/A" or "-")</li>
                  <li>• Price and Monthly Budget should be numbers only (no "$" symbol needed)</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="p-2 bg-green-50 rounded-lg shrink-0">
                <Table className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-sm sm:text-base">Data Entry Example</h3>
                <div className="text-xs sm:text-sm text-gray-500">
                  A typical row might look like:
                  <code className="block bg-gray-50 p-2 rounded-md mt-1 text-xs overflow-x-auto whitespace-nowrap">
                    Purespray | Beleaf | [empty] | Floramite | [empty] | [empty] | 6-2 | 11 | 23.65 | 13875.00 | Feb
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 border-t pt-4 px-2 sm:px-6 flex justify-end bg-white">
          <Button onClick={handleClose}>Got it, let&apos;s go</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

