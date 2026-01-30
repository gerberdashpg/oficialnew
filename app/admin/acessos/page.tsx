import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { AccessesTable } from "@/components/admin/accesses-table"
import { Card } from "@/components/ui/card"

async function getAccesses() {
  return sql`
    SELECT 
      a.*,
      c.name as client_name,
      c.slug as client_slug
    FROM accesses a
    JOIN clients c ON a.client_id = c.id
    ORDER BY a.created_at DESC
  `
}

async function getClients() {
  return sql`SELECT id, name FROM clients ORDER BY name ASC`
}

export default async function AdminAccessesPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/login")
  }

  const [accesses, clients] = await Promise.all([
    getAccesses(),
    getClients(),
  ])

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Acessos"
          subtitle="Gerencie as credenciais de todos os clientes"
        />
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <Card className="bg-[#0D0D12] border-purple-500/20 overflow-hidden">
          <AccessesTable accesses={accesses} clients={clients} />
        </Card>
      </div>
    </div>
  )
}
