import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Key, Bell, TrendingUp, BarChart3 } from "lucide-react"
import Link from "next/link"

async function getAdminStats() {
  const [clients, users, accesses, notices] = await Promise.all([
    sql`SELECT COUNT(*) as total, 
        COUNT(*) FILTER (WHERE status = 'ACTIVE') as active,
        COUNT(*) FILTER (WHERE plan = 'SCALE') as scale,
        COUNT(*) FILTER (WHERE plan = 'PRO') as pro,
        COUNT(*) FILTER (WHERE plan = 'START') as start
        FROM clients`,
    sql`SELECT COUNT(*) as total FROM users WHERE role = 'CLIENTE'`,
    sql`SELECT COUNT(*) as total FROM accesses`,
    sql`SELECT COUNT(*) as total FROM notices`,
  ])

  const recentClients = await sql`
    SELECT id, name, slug, plan, status, logo_url, created_at FROM clients 
    ORDER BY created_at DESC 
    LIMIT 5
  `

  return {
    clients: clients[0],
    users: Number(users[0]?.total) || 0,
    accesses: Number(accesses[0]?.total) || 0,
    notices: Number(notices[0]?.total) || 0,
    recentClients,
  }
}

const planColors: Record<string, string> = {
  START: "bg-[rgba(245,245,247,0.1)] text-[rgba(245,245,247,0.72)] border-[rgba(255,255,255,0.1)]",
  PRO: "bg-[rgba(168,85,247,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.3)]",
  SCALE: "bg-gradient-to-r from-[rgba(168,85,247,0.2)] to-[rgba(124,58,237,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.4)]",
}

const statusColors: Record<string, string> = {
  ACTIVE: "bg-[rgba(34,197,94,0.15)] text-[#22C55E] border-[rgba(34,197,94,0.3)]",
  PAUSED: "bg-[rgba(245,158,11,0.15)] text-[#F59E0B] border-[rgba(245,158,11,0.3)]",
  ONBOARDING: "bg-[rgba(168,85,247,0.15)] text-[#A855F7] border-[rgba(168,85,247,0.3)]",
}

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== "ADMIN") {
    redirect("/login")
  }

  const stats = await getAdminStats()

  const statCards = [
    {
      label: "Total Clientes",
      value: Number(stats.clients?.total) || 0,
      subtext: `${stats.clients?.active || 0} ativos`,
      icon: Building2,
      href: "/admin/clientes",
    },
    {
      label: "Usuários",
      value: stats.users,
      subtext: "Usuários de clientes",
      icon: Users,
      href: "/admin/usuarios",
    },
    {
      label: "Acessos",
      value: stats.accesses,
      subtext: "Credenciais cadastradas",
      icon: Key,
      href: "/admin/acessos",
    },
    {
      label: "Avisos",
      value: stats.notices,
      subtext: "Comunicados enviados",
      icon: Bell,
      href: "/admin/avisos",
    },
  ]

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title="Painel Administrativo"
        subtitle="Gerencie todos os clientes e recursos"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018] cursor-pointer h-full group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[rgba(245,245,247,0.52)]">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#F5F5F7] mt-1">{stat.value}</p>
                      <p className="text-xs text-[rgba(245,245,247,0.42)] mt-1">{stat.subtext}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-[rgba(168,85,247,0.25)]">
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#A855F7]" />
                    Clientes Recentes
                  </CardTitle>
                  <CardDescription className="text-[rgba(245,245,247,0.52)]">
                    Últimos clientes cadastrados
                  </CardDescription>
                </div>
                <Link href="/admin/clientes">
                  <Badge variant="outline" className="bg-[rgba(168,85,247,0.1)] text-[#A855F7] border-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.2)] cursor-pointer rounded-full px-3">
                    Ver todos
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentClients.map((client: { 
                  id: string; 
                  name: string; 
                  slug: string;
                  plan: string; 
                  status: string;
                  logo_url: string | null;
                  created_at: string 
                }) => (
                  <Link key={client.id} href={`/admin/clientes/${client.id}`}>
                    <div className="p-4 bg-[#141424] rounded-xl border border-[rgba(255,255,255,0.06)] hover:border-[rgba(168,85,247,0.3)] transition-all duration-200 cursor-pointer hover:shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center overflow-hidden">
                            {client.logo_url ? (
                              <img 
                                src={client.logo_url || "/placeholder.svg"} 
                                alt={client.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-white font-bold">
                                {client.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#F5F5F7]">{client.name}</p>
                            <p className="text-xs text-[rgba(245,245,247,0.42)]">@{client.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${planColors[client.plan]} rounded-full`}>
                            {client.plan}
                          </Badge>
                          <Badge variant="outline" className={`${statusColors[client.status]} rounded-full`}>
                            {client.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Plan Distribution */}
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardHeader>
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#A855F7]" />
                Distribuição de Planos
              </CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Visão geral dos planos ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED]" />
                      <span className="text-[rgba(245,245,247,0.72)]">Scale</span>
                    </div>
                    <span className="font-bold text-[#F5F5F7]">{stats.clients?.scale || 0}</span>
                  </div>
                  <div className="h-2 bg-[#141424] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-full transition-all duration-500"
                      style={{ width: `${(Number(stats.clients?.scale) / Number(stats.clients?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                      <span className="text-[rgba(245,245,247,0.72)]">Pro</span>
                    </div>
                    <span className="font-bold text-[#F5F5F7]">{stats.clients?.pro || 0}</span>
                  </div>
                  <div className="h-2 bg-[#141424] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#7C3AED] rounded-full transition-all duration-500"
                      style={{ width: `${(Number(stats.clients?.pro) / Number(stats.clients?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[rgba(245,245,247,0.3)]" />
                      <span className="text-[rgba(245,245,247,0.72)]">Start</span>
                    </div>
                    <span className="font-bold text-[#F5F5F7]">{stats.clients?.start || 0}</span>
                  </div>
                  <div className="h-2 bg-[#141424] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[rgba(245,245,247,0.3)] rounded-full transition-all duration-500"
                      style={{ width: `${(Number(stats.clients?.start) / Number(stats.clients?.total || 1)) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(168,85,247,0.1)] to-[rgba(124,58,237,0.05)] border border-[rgba(168,85,247,0.2)]">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-[#A855F7]" />
                      <div>
                        <p className="font-medium text-[#F5F5F7]">Sistema Operacional</p>
                        <p className="text-sm text-[rgba(245,245,247,0.52)]">{stats.clients?.active} de {stats.clients?.total} clientes ativos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
