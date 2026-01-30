import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { ClientsTable } from "@/components/admin/clients-table"
import { Card } from "@/components/ui/card"

async function getClients() {
  return sql`
    SELECT 
      c.*,
      (SELECT COUNT(*) FROM users WHERE client_id = c.id) as user_count,
      (SELECT COUNT(*) FROM accesses WHERE client_id = c.id) as access_count
    FROM clients c
    ORDER BY c.created_at DESC
  `
}

export default async function AdminClientsPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/login")
  }

  const clients = await getClients()

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Clientes"
          subtitle="Gerencie todos os clientes da plataforma"
        />
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <Card className="bg-[#0D0D12] border-purple-500/20 overflow-hidden">
          <ClientsTable clients={clients} />
        </Card>
      </div>
    </div>
  )
}
