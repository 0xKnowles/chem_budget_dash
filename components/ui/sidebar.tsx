"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const SIDEBAR_WIDTH_DESKTOP = 280
const SIDEBAR_WIDTH_MOBILE = 60

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm font-medium outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 active:bg-accent active:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[state=open]:hover:bg-accent data-[state=open]:hover:text-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
)

interface SidebarContextType {
  isExpanded: boolean
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    handleResize()
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <SidebarContext.Provider value={{ isExpanded, setIsExpanded, isMobile }}>{children}</SidebarContext.Provider>
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "left" | "right"
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ children, className, side = "left", ...props }, ref) => {
    const { isExpanded, setIsExpanded, isMobile } = useSidebar()

    const handleExpand = () => {
      setIsExpanded(!isExpanded)
    }

    return (
      <div
        ref={ref}
        className={cn(
          "fixed h-screen z-[999] transition-all duration-300 ease-in-out",
          side === "left" ? "left-0" : "right-0",
          isMobile ? "w-[60px]" : "w-[280px]",
          isExpanded ? "w-[280px]" : "",
          className,
        )}
        {...props}
      >
        <Sheet open={isExpanded} onOpenChange={handleExpand}>
          <SheetContent
            side={side}
            className="w-[--sidebar-width] bg-background p-0 text-foreground [&>button]:hidden"
            style={
              {
                "--sidebar-width": isMobile ? `${SIDEBAR_WIDTH_MOBILE}px` : `${SIDEBAR_WIDTH_DESKTOP}px`,
              } as React.CSSProperties
            }
          >
            {children}
          </SheetContent>
        </Sheet>
        <SidebarTrigger onClick={handleExpand} side={side} isMobile={isMobile} />
      </div>
    )
  },
)
Sidebar.displayName = "Sidebar"

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  side?: "left" | "right"
  isMobile?: boolean
}

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, SidebarTriggerProps>(
  ({ className, side = "left", isMobile = false, ...props }, ref) => (
    <SheetTrigger
      ref={ref}
      className={cn(
        sidebarMenuButtonVariants(),
        "absolute top-1/2 -translate-y-1/2 z-[999]",
        side === "left" ? "left-0" : "right-0",
        isMobile ? "ml-4 mr-4" : "ml-4",
        className,
      )}
      {...props}
    >
      <span>Menu</span>
    </SheetTrigger>
  ),
)
SidebarTrigger.displayName = "SidebarTrigger"

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col h-full", className)} {...props} />,
)
SidebarContent.displayName = "SidebarContent"

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-4 py-2", className)} {...props} />,
)
SidebarHeader.displayName = "SidebarHeader"

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("mt-auto px-4 py-2", className)} {...props} />,
)
SidebarFooter.displayName = "SidebarFooter"

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("px-2 py-2", className)} {...props} />,
)
SidebarGroup.displayName = "SidebarGroup"

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-2 py-1 text-xs font-semibold text-muted-foreground", className)} {...props} />
  ),
)
SidebarGroupLabel.displayName = "SidebarGroupLabel"

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("space-y-1", className)} {...props} />,
)
SidebarGroupContent.displayName = "SidebarGroupContent"

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => <ul ref={ref} className={cn("space-y-1", className)} {...props} />,
)
SidebarMenu.displayName = "SidebarMenu"

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("", className)} {...props} />,
)
SidebarMenuItem.displayName = "SidebarMenuItem"

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof sidebarMenuButtonVariants>
>(({ className, ...props }, ref) => (
  <button ref={ref} className={cn(sidebarMenuButtonVariants(), className)} {...props} />
))
SidebarMenuButton.displayName = "SidebarMenuButton"

