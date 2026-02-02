import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect, notFound } from "next/navigation"

export const dynamic = 'force-dynamic'
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Building2, Users, Key, Bell, ExternalLink, Edit, 
  Clock, FolderOpen, Mail, ArrowLeft 
} from "lucide-react"
import Link from "next/link"

async function getClient(id: string) {
  const result = await sql`SELECT * FROM clients WHERE id = ${id}`
  return result[0]
}

async function getClientData(clientId: string) {
  const [users, accesses, notices] = await Promise.all([
    sql`SELECT * FROM users WHERE client_id = ${clientId} ORDER BY created_at DESC`,
    sql`SELECT * FROM accesses WHERE client_id = ${clientId} ORDER BY service_name ASC`,
    sql`SELECT * FROM notices WHERE client_id = ${clientId} ORDER BY created_at DESC`,
  ])

  return { users, accesses, notices }
}

const planColors: Record<string, string> = {
  START: "bg-slate-500 text-white",
  PRO: "bg-blue-500 text-white",
  SCALE: "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500 text-white",
  PAUSED: "bg-yellow-500 text-black",
  ONBOARDING: "bg-blue-500 text-white",
}

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await getSession()

  const adminRoles = ["ADMIN", "Administrador", "Nexus Growth"]
  if (!session || !adminRoles.includes(session.role)) {
    redirect("/login")
  }

  const client = await getClient(id)

  if (!client) {
    notFound()
  }

  const data = await getClientData(id)

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title={client.name}
        subtitle="Detalhes do cliente"
      />

      <div className="p-6 space-y-6">
        {/* Back button */}
        <Link href="/admin/clientes">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para clientes
          </Button>
        </Link>

        {/* Client Info Card */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{client.name}</CardTitle>
                  <CardDescription className="text-slate-400 text-base">@{client.slug}</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={planColors[client.plan]}>{client.plan}</Badge>
                <Badge className={statusColors[client.status]}>{client.status}</Badge>
                <Link href={`/admin/clientes/${client.id}/editar`}>
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white bg-transparent">
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Criado em</p>
                    <p className="text-sm text-white">
                      {new Date(client.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-500">Google Drive</p>
                    {client.drive_link ? (
                      <a
                        href={client.drive_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        Acessar <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-slate-400">Não configurado</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Notas</p>
                    <p className="text-sm text-white truncate">
                      {client.notes || "Sem notas"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0D0D12] border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Usuários</p>
                  <p className="text-3xl font-bold text-white">{data.users.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D12] border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Acessos</p>
                  <p className="text-3xl font-bold text-white">{data.accesses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <Key className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0D0D12] border-purple-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Avisos</p>
                  <p className="text-3xl font-bold text-white">{data.notices.length}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Usuários ({data.users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.users.length > 0 ? (
              <div className="space-y-3">
                {data.users.map((user: { id: string; name: string; email: string; created_at: string }) => (
                  <div key={user.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(user.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Nenhum usuário cadastrado</p>
            )}
          </CardContent>
        </Card>

        {/* Accesses List */}
        <Card className="bg-[#0D0D12] border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              Acessos ({data.accesses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.accesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.accesses.map((access: { 
                  id: string; 
                  service_name: string; 
                  service_url: string | null;
                  login: string;
                }) => (
                  <div key={access.id} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <span className="text-emerald-400 font-bold">{access.service_name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{access.service_name}</p>
                        <p className="text-sm text-slate-400">{access.login}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">Nenhum acesso cadastrado</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
