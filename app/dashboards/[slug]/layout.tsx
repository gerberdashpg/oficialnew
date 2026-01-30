import React from "react"
import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import Link from "next/link"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`
    SELECT * FROM clients WHERE slug = ${slug}
  `
  return result[0] || null
}

async function clientHasWeeklyReports(clientId: string) {
  const result = await sql`
    SELECT COUNT(*) as count FROM weekly_reports WHERE client_id = ${clientId}
  `
  return parseInt(result[0]?.count || '0') > 0
}

export default async function DashboardSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  // Get the client by slug
  const client = await getClientBySlug(slug)

  if (!client) {
    notFound()
  }

  // Check access: ADMIN can access any slug, CLIENTE can only access their own
  if (session.role === "CLIENTE") {
    if (session.client?.slug !== slug) {
      // Return 403 Forbidden page
      return (
        <div className="min-h-screen bg-[#07070A] flex items-center justify-center p-4">
          <div className="text-center p-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
              <span className="text-4xl text-white font-bold">403</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F5F5F7] mb-2">Acesso Negado</h1>
            <p className="text-[rgba(245,245,247,0.52)] max-w-md">
              Você não tem permissão para acessar este dashboard. 
              Por favor, acesse o dashboard da sua conta.
            </p>
            <Link 
              href={`/dashboards/${session.client?.slug}`}
              className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Ir para meu Dashboard
            </Link>
          </div>
        </div>
      )
    }
  }

  // Check if client has weekly reports
  const hasWeeklyReports = await clientHasWeeklyReports(client.id)

  // Create enhanced session with current client data
  const enhancedSession = {
    ...session,
    client: {
      id: client.id,
      name: client.name,
      slug: client.slug,
      plan: client.plan,
      status: client.status,
      drive_link: client.drive_link,
    }
  }

  return (
    <DashboardShell user={enhancedSession} slug={slug} hasWeeklyReports={hasWeeklyReports}>
      {children}
    </DashboardShell>
  )
}
