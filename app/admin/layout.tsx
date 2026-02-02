import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Only admins and Nexus Growth can access
  if (session.role !== "ADMIN" && session.role !== "Administrador" && session.role !== "Nexus Growth") {
    redirect("/dashboard")
  }

  return (
    <DashboardShell user={session}>
      {children}
    </DashboardShell>
  )
}
