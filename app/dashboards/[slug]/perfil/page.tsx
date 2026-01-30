import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { ProfileView } from "@/components/client/profile-view"

export const dynamic = 'force-dynamic'

async function getClientBySlug(slug: string) {
  const result = await sql`SELECT * FROM clients WHERE slug = ${slug}`
  return result[0] || null
}

async function getUserData(userId: string) {
  const result = await sql`SELECT id, name, email, role, created_at, avatar_url FROM users WHERE id = ${userId}`
  return result[0] || null
}

export default async function PerfilPage({
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
    redirect(`/dashboards/${session.client?.slug}/perfil`)
  }

  const user = await getUserData(session.id)

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <DashboardHeader
        title="Perfil"
        subtitle="Gerencie suas informações"
      />
      <ProfileView 
        user={user} 
        client={client}
        slug={slug}
      />
    </div>
  )
}
