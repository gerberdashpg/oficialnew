import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { WeeklyReportsView } from "@/components/client/weekly-reports-view"
import { Card, CardContent } from "@/components/ui/card"
import { Info } from "lucide-react"

export const dynamic = "force-dynamic"

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getWeeklyReports(clientId: string) {
  return sql`
    SELECT 
      id,
      report_date,
      status,
      summary,
      actions_taken,
      data_analysis,
      decisions_made,
      next_week_guidance,
      created_at
    FROM weekly_reports
    WHERE client_id = ${clientId}
    ORDER BY report_date DESC
  `
}

export default async function LeituraSemanalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const client = await getClientBySlug(slug)

  if (!client) {
    notFound()
  }

  // Check access
  if (session.role === "CLIENTE" && session.client?.slug !== slug) {
    redirect(`/dashboards/${session.client?.slug}/leitura-semanal`)
  }

  const reports = await getWeeklyReports(client.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Leitura Semanal da Operação"
        subtitle="Acompanhe os relatórios semanais da sua operação"
      />

      {/* Texto educativo fixo no topo */}
      <Card className="bg-[#0D0D12] border-purple-500/20 rounded-2xl mb-6">
        <CardContent className="p-5">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(168,85,247,0.1)] flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-[#A855F7]" />
            </div>
            <div className="space-y-2">
              <p className="text-[rgba(245,245,247,0.85)] leading-relaxed">
                Aqui você acompanha as leituras semanais da sua operação.
              </p>
              <p className="text-[rgba(245,245,247,0.72)] leading-relaxed">
                Cada relatório traz o contexto das decisões tomadas, o status
                atual e a orientação para a próxima semana.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de relatorios */}
      <WeeklyReportsView reports={reports} />
    </div>
  )
}
