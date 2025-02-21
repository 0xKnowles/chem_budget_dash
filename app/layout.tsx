import type React from "react"
import { Toaster } from "@/components/ui/toaster"
import { DashboardProvider } from "@/contexts/DashboardContext"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    default: "Spray Application Dashboard",
    template: "%s | Spray Application Dashboard",
  },
  description: "Track chemical applications and budget management effectively",
  applicationName: "Spray Application Dashboard",
  appleWebApp: {
    title: "Spray Application Dashboard",
  },
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Spray Application Dashboard",
    description: "Track chemical applications and budget management effectively",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Spray Application Dashboard</title>
      </head>
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