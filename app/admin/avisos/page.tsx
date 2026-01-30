import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { NoticesTable } from "@/components/admin/notices-table"
import { Card } from "@/components/ui/card"

async function getNotices() {
  return sql`
    SELECT 
      n.*,
      c.name as client_name,
      c.slug as client_slug
    FROM notices n
    JOIN clients c ON n.client_id = c.id
    ORDER BY n.created_at DESC
  `
}

async function getClients() {
  return sql`SELECT id, name FROM clients ORDER BY name ASC`
}

export default async function AdminNoticesPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/login")
  }

  const [notices, clients] = await Promise.all([
    getNotices(),
    getClients(),
  ])

  return (
    <div className="min-h-screen">
      <div className="p-4 sm:p-6">
        <DashboardHeader
          title="Avisos"
          subtitle="Gerencie os comunicados para os clientes"
        />
      </div>

      <div className="px-4 sm:px-6 pb-6">
        <Card className="bg-[#0D0D12] border-purple-500/20 overflow-hidden">
          <NoticesTable notices={notices} clients={clients} />
        </Card>
      </div>
    </div>
  )
}
