import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { NoticesList } from "@/components/client/notices-list"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getNotices(clientId: string) {
  return sql`
    SELECT id, title, message, priority, created_at 
    FROM notices 
    WHERE client_id = ${clientId} OR client_id IS NULL
    ORDER BY created_at DESC
  `
}

export default async function AvisosPage({
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
    redirect(`/dashboards/${session.client?.slug}/avisos`)
  }

  const notices = await getNotices(client.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Avisos"
        subtitle="Comunicados e atualizações importantes"
      />
      <NoticesList notices={notices} />
    </div>
  )
}
