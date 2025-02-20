import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { DashboardProvider } from "@/contexts/DashboardContext"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <DashboardProvider>
          <main className="flex-1 w-full max-w-[100vw] overflow-auto">
            <div className="container mx-auto p-2 md:p-4 lg:max-w-7xl">{children}</div>
          </main>
          <Toaster />
        </DashboardProvider>
      </body>
    </html>
  )
}



import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
