"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { SidebarProvider, useSidebar } from "./sidebar-context"
import { DashboardSidebar } from "./sidebar"

interface DashboardShellProps {
  children: ReactNode
  user: {
    name: string
    email: string
    role: "ADMIN" | "CLIENTE" | "Nexus Growth"
    client?: {
      name: string
      slug: string
      plan: string
    }
  }
  slug?: string
  hasWeeklyReports?: boolean
}

function MainContent({ children }: { children: ReactNode }) {
  const { collapsed } = useSidebar()

  return (
    <main
      className={cn(
        "min-h-screen transition-all duration-300",
        // Mobile: no margin, full width
        "pt-16 lg:pt-0",
        // Desktop: margin based on sidebar state
        collapsed ? "lg:ml-20" : "lg:ml-64"
      )}
    >
      {children}
    </main>
  )
}

export function DashboardShell({ children, user, slug, hasWeeklyReports }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#07070A]">
        <DashboardSidebar user={user} slug={slug} hasWeeklyReports={hasWeeklyReports} />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
}
