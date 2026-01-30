import React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Admins should go to admin panel
  if (session.role === "ADMIN" && !session.client_id) {
    redirect("/admin")
  }

  // Redirect clients to the new multi-tenant route
  if (session.client?.slug) {
    redirect(`/dashboards/${session.client.slug}`)
  }

  return (
    <DashboardShell user={session}>
      {children}
    </DashboardShell>
  )
}
