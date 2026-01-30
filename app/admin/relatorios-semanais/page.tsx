import { Suspense } from "react"
import { sql } from "@/lib/db"
import { WeeklyReportsTable } from "@/components/admin/weekly-reports-table"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { FileText } from "lucide-react"

async function getReportsAndClients() {
  try {
    const [reports, clients] = await Promise.all([
      sql`
        SELECT 
          wr.*,
          c.name as client_name,
          c.slug as client_slug
        FROM weekly_reports wr
        JOIN clients c ON wr.client_id = c.id
        ORDER BY wr.report_date DESC
      `,
      sql`SELECT id, name FROM clients ORDER BY name`
    ])

    return { reports, clients }
  } catch (error) {
    console.error("Error fetching data:", error)
    return { reports: [], clients: [] }
  }
}

export default async function RelatoriosSemanaisPage() {
  const { reports, clients } = await getReportsAndClients()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Relatórios Semanais</h1>
        <p className="text-zinc-400 mt-1">
          Gerencie os relatórios de leitura semanal da operação de cada cliente
        </p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-white">Todos os Relatórios</CardTitle>
              <CardDescription className="text-zinc-400">
                {reports.length} relatório{reports.length !== 1 ? "s" : ""} cadastrado{reports.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<div className="p-8 text-center text-zinc-400">Carregando...</div>}>
            <WeeklyReportsTable reports={reports} clients={clients} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
