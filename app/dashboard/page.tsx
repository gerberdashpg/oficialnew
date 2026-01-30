import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { DashboardHeader } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Key, Bell, FolderOpen, TrendingUp, Clock, Activity } from "lucide-react"
import Link from "next/link"

async function getDashboardData(clientId: string) {
  const [accessesResult, noticesResult] = await Promise.all([
    sql`SELECT COUNT(*) as count FROM accesses WHERE client_id = ${clientId}`,
    sql`SELECT COUNT(*) as count FROM notices WHERE client_id = ${clientId}`,
  ])

  const recentNotices = await sql`
    SELECT * FROM notices 
    WHERE client_id = ${clientId} 
    ORDER BY created_at DESC 
    LIMIT 3
  `

  return {
    accessesCount: Number(accessesResult[0]?.count) || 0,
    noticesCount: Number(noticesResult[0]?.count) || 0,
    recentNotices,
  }
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session || !session.client_id) {
    redirect("/login")
  }

  const data = await getDashboardData(session.client_id)

  const stats = [
    {
      label: "Acessos Salvos",
      value: data.accessesCount,
      icon: Key,
      href: "/dashboard/acessos",
    },
    {
      label: "Avisos",
      value: data.noticesCount,
      icon: Bell,
      href: "/dashboard/avisos",
    },
    {
      label: "Drive",
      value: session.client?.drive_link ? "Disponível" : "Não configurado",
      icon: FolderOpen,
      href: "/dashboard/drive",
    },
  ]

  return (
    <div className="min-h-screen bg-[#07070A]">
      <DashboardHeader
        title={`Bem-vindo, ${session.name.split(" ")[0]}!`}
        subtitle={session.client?.name}
        user={session}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href}>
              <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018] cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[rgba(245,245,247,0.52)]">{stat.label}</p>
                      <p className="text-3xl font-bold text-[#F5F5F7] mt-1">
                        {typeof stat.value === "number" ? stat.value : stat.value}
                      </p>
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
          {/* Recent Notices */}
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                    <Bell className="w-5 h-5 text-[#A855F7]" />
                    Avisos Recentes
                  </CardTitle>
                  <CardDescription className="text-[rgba(245,245,247,0.52)]">
                    Últimas atualizações da sua conta
                  </CardDescription>
                </div>
                <Link href="/dashboard/avisos">
                  <Badge variant="outline" className="bg-[rgba(168,85,247,0.1)] text-[#A855F7] border-[rgba(168,85,247,0.3)] hover:bg-[rgba(168,85,247,0.2)] cursor-pointer rounded-full px-3">
                    Ver todos
                  </Badge>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {data.recentNotices.length > 0 ? (
                <div className="space-y-4">
                  {data.recentNotices.map((notice: { id: string; title: string; message: string; created_at: string }) => (
                    <div
                      key={notice.id}
                      className="p-4 bg-[#141424] rounded-xl border border-[rgba(255,255,255,0.06)]"
                    >
                      <h4 className="font-medium text-[#F5F5F7]">{notice.title}</h4>
                      <p className="text-sm text-[rgba(245,245,247,0.52)] mt-1 line-clamp-2">
                        {notice.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-[rgba(245,245,247,0.42)]">
                        <Clock className="w-3 h-3" />
                        {new Date(notice.created_at).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-[rgba(245,245,247,0.42)]">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum aviso ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions / Status */}
          <Card className="card-premium border-[rgba(255,255,255,0.06)] bg-[#101018]">
            <CardHeader>
              <CardTitle className="text-[#F5F5F7] flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#A855F7]" />
                Status da Conta
              </CardTitle>
              <CardDescription className="text-[rgba(245,245,247,0.52)]">
                Informações do seu plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-[#141424] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[rgba(245,245,247,0.52)]">Plano</span>
                    <Badge className={`
                      ${session.client?.plan === "SCALE" ? "bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white" :
                        session.client?.plan === "PRO" ? "bg-[#7C3AED] text-white" :
                        "bg-[rgba(245,245,247,0.2)] text-[#F5F5F7]"}
                      rounded-full
                    `}>
                      {session.client?.plan || "START"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-[#141424] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[rgba(245,245,247,0.52)]">Status</span>
                    <Badge className={`
                      ${session.client?.status === "ACTIVE" ? "bg-[#22C55E] text-white" :
                        session.client?.status === "PAUSED" ? "bg-[#F59E0B] text-black" :
                        "bg-[#A855F7] text-white"}
                      rounded-full
                    `}>
                      {session.client?.status || "ACTIVE"}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-[#141424] rounded-xl border border-[rgba(255,255,255,0.06)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[rgba(245,245,247,0.52)]">Google Drive</span>
                    {session.client?.drive_link ? (
                      <Badge className="bg-[#22C55E] text-white rounded-full">Conectado</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[rgba(245,245,247,0.52)] border-[rgba(255,255,255,0.1)] rounded-full">Não configurado</Badge>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-[rgba(168,85,247,0.1)] to-[rgba(124,58,237,0.05)] border border-[rgba(168,85,247,0.2)]">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-[#A855F7]" />
                      <div>
                        <p className="font-medium text-[#F5F5F7]">Sua conta está ativa</p>
                        <p className="text-sm text-[rgba(245,245,247,0.52)]">Todos os recursos estão disponíveis</p>
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
