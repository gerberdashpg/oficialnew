import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { AccessesList } from "@/components/client/accesses-list"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getAccesses(clientId: string) {
  return sql`
    SELECT id, service_name, service_url, login, password, icon_url 
    FROM accesses 
    WHERE client_id = ${clientId} 
    ORDER BY service_name ASC
  `
}

export default async function AcessosPage({
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
    redirect(`/dashboards/${session.client?.slug}/acessos`)
  }

  const accesses = await getAccesses(client.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Acessos"
        subtitle="Credenciais e logins dos seus serviços"
      />
      <AccessesList accesses={accesses} />
    </div>
  )
}
