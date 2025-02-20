"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileSpreadsheet } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useDashboard } from "@/contexts/DashboardContext"
import { parseExcelFile } from "@/utils/excel-parser"

export function DataInputButtons() {
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { setMonthlyData, setSelectedMonth } = useDashboard()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      toast({
        title: "Upload failed",
        description: "No file selected",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)

      // Parse the file on the client side
      const monthlyData = await parseExcelFile(file)

      // Update the context with the parsed data
      setMonthlyData(monthlyData)
      const months = Object.keys(monthlyData)
      if (months.length > 0) {
        setSelectedMonth(months[0]) // Select the first month by default
      }

      console.log("File uploaded successfully. Sheets:", months)
      toast({
        title: "File uploaded successfully",
        description: `Processed ${months.length} month${months.length === 1 ? "" : "s"} of data`,
      })
    } catch (error) {
      console.error("Upload failed:", error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset the file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    }
  }

  return (
    <div className="flex items-center">
      <Button
        onClick={() => document.getElementById("file-upload")?.click()}
        size="lg"
        variant="outline"
        className="bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-300 w-[280px] h-10"
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-gray-600" />
        ) : (
          <div className="flex items-center">
            <Upload className="h-4 w-4 mr-2 text-blue-600" />
            <span className="flex-1">Upload Excel File</span>
            <FileSpreadsheet className="h-4 w-4 ml-2 text-blue-600" />
          </div>
        )}
      </Button>
      <input id="file-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
    </div>
  )
}

