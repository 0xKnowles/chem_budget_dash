import * as XLSX from "xlsx"

export interface ChemicalApplication {
  sprayChemicals: (string | null)[]
  fogChemicals: (string | null)[]
  date: {
    week: number
    day: number
    formatted: string
  }
  bays: {
    count: number
    isFull: boolean
  }
  price: number
  monthlyBudget: number
  month: string
}

export interface ParsedData {
  applications: ChemicalApplication[]
  sheetName: string
}

export function parseWeekDayDate(value: string): { week: number; day: number; formatted: string } {
  if (!value) {
    throw new Error("Date is empty")
  }
  const parts = value.split("-")
  if (parts.length !== 2) {
    throw new Error(`Invalid date format: ${value}. Expected format: Week-Day (e.g., 1-5)`)
  }
  const [week, day] = parts.map(Number)
  if (isNaN(week) || isNaN(day) || week < 1 || week > 52 || day < 1 || day > 7) {
    throw new Error(`Invalid date values: Week ${week}, Day ${day}. Week should be 1-52, Day should be 1-7`)
  }
  const formatted = `Week ${week}, Day ${day}`
  return { week, day, formatted }
}

function hasFogging(fogChemicals: (string | null)[]): boolean {
  return fogChemicals.some((chemical) => chemical !== null && chemical !== "")
}

function parseSheet(worksheet: XLSX.WorkSheet, sheetName: string): ChemicalApplication[] {
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[]

  if (jsonData.length < 2) {
    throw new Error(`Sheet "${sheetName}" is empty or contains only headers`)
  }

  // Skip header row
  const applications = jsonData
    .slice(1)
    .map((row, index) => {
      try {
        // Check if the row is completely empty
        if (row.every((cell: any) => cell === null)) {
          return null // Skip completely empty rows
        }

        const sprayChemicals = [row[0] || null, row[1] || null, row[2] || null]
        const fogChemicals = [row[3] || null, row[4] || null, row[5] || null]
        const containsFogging = hasFogging(fogChemicals)

        const dateValue = row[6]
        if (!dateValue) {
          throw new Error(`Missing date in row ${index + 2}`)
        }
        const date = parseWeekDayDate(dateValue.toString())

        const baysCount = row[7] === null ? 0 : Number(row[7])
        if (isNaN(baysCount)) {
          throw new Error(`Invalid bays count in row ${index + 2}: ${row[7]}`)
        }

        const price = row[8] === null ? 0 : Number(row[8]?.toString().replace("$", "").trim())
        if (isNaN(price)) {
          throw new Error(`Invalid price in row ${index + 2}: ${row[8]}`)
        }

        const monthlyBudget = row[9] === null ? 0 : Number(row[9]?.toString().replace("$", "").trim())
        if (isNaN(monthlyBudget)) {
          throw new Error(`Invalid monthly budget in row ${index + 2}: ${row[9]}`)
        }

        return {
          sprayChemicals,
          fogChemicals,
          date,
          bays: {
            count: baysCount,
            isFull: containsFogging,
          },
          price,
          monthlyBudget,
          month: sheetName,
        }
      } catch (error) {
        console.error(`Error processing row ${index + 2} in sheet "${sheetName}":`, error)
        throw error
      }
    })
    .filter((row): row is ChemicalApplication => row !== null) // Filter out null rows (completely empty)

  return applications
}

export async function parseExcelFile(file: File): Promise<Record<string, ChemicalApplication[]>> {
  // Check if we're in a browser environment
  if (typeof window === "undefined" || !window.FileReader) {
    throw new Error("FileReader is not supported in this environment")
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error("Failed to read file")
        }

        console.log("File read successfully")
        const data = new Uint8Array(e.target.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        console.log("Workbook read successfully, sheets:", workbook.SheetNames)

        const monthlyData: Record<string, ChemicalApplication[]> = {}

        workbook.SheetNames.forEach((sheetName) => {
          try {
            const worksheet = workbook.Sheets[sheetName]
            const applications = parseSheet(worksheet, sheetName)
            monthlyData[sheetName] = applications
            console.log(`Parsed ${applications.length} applications from sheet "${sheetName}"`)
          } catch (error) {
            console.error(`Error parsing sheet "${sheetName}":`, error)
            throw error
          }
        })

        resolve(monthlyData)
      } catch (error) {
        console.error("Error parsing Excel file:", error)
        reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : String(error)}`))
      }
    }

    reader.onerror = () => {
      console.error("FileReader error:", reader.error)
      reject(new Error("Failed to read file"))
    }

    reader.readAsArrayBuffer(file)
  })
}

// Utility functions remain unchanged...
export function calculateTotalUsage(applications: ChemicalApplication[]): {
  sprayCount: number
  fogCount: number
  totalBays: number
  fullRangeApplications: number
} {
  return applications.reduce(
    (acc, curr) => {
      const hasSpray = curr.sprayChemicals.some((chem) => chem !== null)
      const hasFog = curr.fogChemicals.some((chem) => chem !== null)

      return {
        sprayCount: acc.sprayCount + (hasSpray ? 1 : 0),
        fogCount: acc.fogCount + (hasFog ? 1 : 0),
        totalBays: acc.totalBays + (hasSpray ? curr.bays.count : 0),
        fullRangeApplications: acc.fullRangeApplications + (curr.bays.isFull ? 1 : 0),
      }
    },
    {
      sprayCount: 0,
      fogCount: 0,
      totalBays: 0,
      fullRangeApplications: 0,
    },
  )
}

export function calculateMonthlySpending(applications: ChemicalApplication[]): {
  month: string
  spent: number
  budget: number
}[] {
  const monthlyData = new Map<string, { spent: number; budget: number }>()

  for (const app of applications) {
    const month = app.month
    if (!monthlyData.has(month)) {
      monthlyData.set(month, {
        spent: 0,
        budget: app.monthlyBudget,
      })
    }

    const currentData = monthlyData.get(month)!
    currentData.spent += app.price
  }

  const result = Array.from(monthlyData.entries()).map(([month, data]) => ({
    month,
    spent: Number(data.spent.toFixed(2)),
    budget: Number(data.budget.toFixed(2)),
  }))

  return result
}

export function getMostUsedChemicals(applications: ChemicalApplication[]): {
  chemical: string
  count: number
}[] {
  const chemicalCounts = new Map<string, number>()

  applications.forEach((app) => {
    ;[...app.sprayChemicals, ...app.fogChemicals]
      .filter((chem): chem is string => chem !== null)
      .forEach((chemical) => {
        chemicalCounts.set(chemical, (chemicalCounts.get(chemical) || 0) + 1)
      })
  })

  return Array.from(chemicalCounts.entries())
    .map(([chemical, count]) => ({ chemical, count }))
    .sort((a, b) => b.count - a.count)
}

