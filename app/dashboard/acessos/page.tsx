import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { AccessCard } from "@/components/dashboard/access-card"
import { Card, CardContent } from "@/components/ui/card"
import { Key } from "lucide-react"

async function getAccesses(clientId: string) {
  return sql`
    SELECT * FROM accesses 
    WHERE client_id = ${clientId} 
    ORDER BY service_name ASC
  `
}

export default async function AcessosPage() {
  const session = await getSession()

  if (!session || !session.client_id) {
    redirect("/login")
  }

  const accesses = await getAccesses(session.client_id)

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title="Acessos"
        subtitle="Credenciais e logins dos seus serviços"
        user={session}
      />

      <div className="p-6">
        {accesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accesses.map((access: {
              id: string
              service_name: string
              service_url: string | null
              login: string
              password: string
              created_at: string
            }) => (
              <AccessCard key={access.id} access={access} />
            ))}
          </div>
        ) : (
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-[#141424] flex items-center justify-center mb-4">
                <Key className="w-8 h-8 text-[rgba(245,245,247,0.42)]" />
              </div>
              <h3 className="text-lg font-medium text-[#F5F5F7] mb-2">Nenhum acesso cadastrado</h3>
              <p className="text-[rgba(245,245,247,0.52)] text-center max-w-md">
                Os acessos dos seus serviços aparecerão aqui quando forem cadastrados pelo administrador.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
