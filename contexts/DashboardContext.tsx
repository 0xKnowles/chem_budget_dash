"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import {
  type ChemicalApplication,
  calculateTotalUsage,
  calculateMonthlySpending,
  getMostUsedChemicals,
} from "@/utils/excel-parser"

interface DashboardContextType {
  applications: ChemicalApplication[]
  setApplications: (apps: ChemicalApplication[]) => void
  monthlyData: Record<string, ChemicalApplication[]>
  setMonthlyData: (data: Record<string, ChemicalApplication[]>) => void
  selectedMonth: string | null
  setSelectedMonth: (month: string | null) => void
  availableMonths: string[]
  totalUsage: ReturnType<typeof calculateTotalUsage>
  monthlySpending: ReturnType<typeof calculateMonthlySpending>
  mostUsedChemicals: ReturnType<typeof getMostUsedChemicals>
  totalAreaTreated: { squareMeters: number; acres: number }
  averagePricePerAcre: number
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [monthlyData, setMonthlyData] = useState<Record<string, ChemicalApplication[]>>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("monthlyData")
      return savedData ? JSON.parse(savedData) : {}
    }
    return {}
  })

  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [availableMonths, setAvailableMonths] = useState<string[]>([])

  // Add new useEffect to update availableMonths
  useEffect(() => {
    setAvailableMonths(Object.keys(monthlyData))
  }, [monthlyData])

  // Set applications based on selected month
  const [applications, setApplicationsState] = useState<ChemicalApplication[]>([])

  const setApplications = (apps: ChemicalApplication[]) => {
    setApplicationsState(apps)
  }

  // Update applications when monthly data or selected month changes
  useEffect(() => {
    if (selectedMonth && monthlyData[selectedMonth]) {
      setApplicationsState(monthlyData[selectedMonth])
    } else if (availableMonths.length > 0 && !selectedMonth) {
      // If no month is selected but data is available, select the first month
      setSelectedMonth(availableMonths[0])
    } else if (availableMonths.length === 0) {
      setApplicationsState([])
      setSelectedMonth(null)
    }
  }, [monthlyData, selectedMonth, availableMonths.length, availableMonths[0]]) // Remove availableMonths from dependencies as it's derived from monthlyData

  // Save monthly data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("monthlyData", JSON.stringify(monthlyData))
    }
  }, [monthlyData])

  const [totalUsage, setTotalUsage] = useState(calculateTotalUsage([]))
  const [monthlySpending, setMonthlySpending] = useState(calculateMonthlySpending([]))
  const [mostUsedChemicals, setMostUsedChemicals] = useState(getMostUsedChemicals([]))
  const [totalAreaTreated, setTotalAreaTreated] = useState({ squareMeters: 0, acres: 0 })
  const [averagePricePerAcre, setAveragePricePerAcre] = useState(0)

  // Update calculations when applications change
  useEffect(() => {
    if (applications.length === 0) {
      setTotalUsage(calculateTotalUsage([]))
      setMonthlySpending(calculateMonthlySpending([]))
      setMostUsedChemicals(getMostUsedChemicals([]))
      setTotalAreaTreated({ squareMeters: 0, acres: 0 })
      setAveragePricePerAcre(0)
      return
    }

    const newTotalUsage = calculateTotalUsage(applications)
    const newMonthlySpending = calculateMonthlySpending(applications)
    const newMostUsedChemicals = getMostUsedChemicals(applications)
    const newTotalAreaTreatedSqM = newTotalUsage.totalBays * 480
    const newTotalAreaTreatedAcres = newTotalAreaTreatedSqM * 0.000247105

    setTotalAreaTreated({
      squareMeters: newTotalAreaTreatedSqM,
      acres: newTotalAreaTreatedAcres,
    })

    const totalSpent = applications.reduce((sum, app) => sum + app.price, 0)
    const newAveragePricePerAcre = newTotalAreaTreatedAcres > 0 ? totalSpent / newTotalAreaTreatedAcres : 0

    setTotalUsage(newTotalUsage)
    setMonthlySpending(newMonthlySpending)
    setMostUsedChemicals(newMostUsedChemicals)
    setAveragePricePerAcre(newAveragePricePerAcre)
  }, [applications]) // Only depend on applications

  return (
    <DashboardContext.Provider
      value={{
        applications,
        setApplications,
        monthlyData,
        setMonthlyData,
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        totalUsage,
        monthlySpending,
        mostUsedChemicals,
        totalAreaTreated,
        averagePricePerAcre,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

