import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { MaterialsView } from "@/components/client/materials-view"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

export default async function MateriaisPage({
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
  if (session.role === "CLIENTE" && session.client_id !== client.id) {
    redirect("/login")
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Materiais"
        subtitle="Acesse seus arquivos e documentos"
      />
      <MaterialsView driveLink={client.drive_link} />
    </div>
  )
}
